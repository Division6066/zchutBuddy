import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============================================
// CONSTANTS
// ============================================

/**
 * API credit limits per subscription tier (in shekels).
 */
const TIER_API_LIMITS: Record<string, number> = {
  free_trial: 5, // ₪5 API credits
  plus: 50, // ₪50 API credits
  pro: 150, // ₪150 API credits
  max: 500, // ₪500 API credits
};

/**
 * Crawl credit limits per subscription tier.
 */
const TIER_CRAWL_LIMITS: Record<string, number> = {
  free_trial: 0,
  plus: 10,
  pro: 50,
  max: 200,
};

/**
 * Soft cap threshold (40% of limit).
 */
const SOFT_CAP_THRESHOLD = 0.4;

/**
 * Hard cap threshold (60% of limit).
 */
const HARD_CAP_THRESHOLD = 0.6;

// ============================================
// INTERNAL HELPERS
// ============================================

async function getCurrentUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user._id;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get the current user's usage tracking for the current period.
 */
export const getMyUsage = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!usage) {
      return null;
    }

    // Calculate percentages
    const apiUsagePercent =
      usage.apiCreditsLimit > 0 ? (usage.apiCreditsUsed / usage.apiCreditsLimit) * 100 : 0;

    const crawlUsagePercent =
      usage.crawlCreditsLimit > 0 ? (usage.crawlCreditsUsed / usage.crawlCreditsLimit) * 100 : 0;

    return {
      ...usage,
      apiUsagePercent: Math.round(apiUsagePercent),
      crawlUsagePercent: Math.round(crawlUsagePercent),
      apiRemaining: Math.max(0, usage.apiCreditsLimit - usage.apiCreditsUsed),
      crawlRemaining: Math.max(0, usage.crawlCreditsLimit - usage.crawlCreditsUsed),
    };
  },
});

/**
 * Get usage by user ID (admin/internal use).
 */
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

/**
 * Check if user has reached any usage caps.
 */
export const checkUsageCaps = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!usage) {
      return {
        softCapReached: false,
        hardCapReached: false,
        canUseApi: true,
        canUseCrawl: true,
      };
    }

    return {
      softCapReached: usage.softCapReached,
      hardCapReached: usage.hardCapReached,
      canUseApi: usage.apiCreditsUsed < usage.apiCreditsLimit,
      canUseCrawl: usage.crawlCreditsUsed < usage.crawlCreditsLimit,
    };
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Initialize or reset usage tracking for a user.
 */
export const initializeUsage = mutation({
  args: {
    userId: v.id("users"),
    tier: v.string(),
  },
  handler: async (ctx, { userId, tier }) => {
    const now = Date.now();
    const periodEnd = now + 30 * 24 * 60 * 60 * 1000; // 30 days

    // Check if usage already exists
    const existing = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    const apiLimit = TIER_API_LIMITS[tier] || TIER_API_LIMITS.free_trial;
    const crawlLimit = TIER_CRAWL_LIMITS[tier] || TIER_CRAWL_LIMITS.free_trial;

    if (existing) {
      // Reset existing usage
      await ctx.db.patch(existing._id, {
        periodStart: now,
        periodEnd,
        apiCreditsUsed: 0,
        apiCreditsLimit: apiLimit,
        crawlCreditsUsed: 0,
        crawlCreditsLimit: crawlLimit,
        totalTokensUsed: 0,
        softCapReached: false,
        hardCapReached: false,
        softCapAlertSent: false,
        hardCapAlertSent: false,
        updatedAt: now,
      });
      return existing._id;
    }

    // Create new usage tracking
    return await ctx.db.insert("usageTracking", {
      userId,
      periodStart: now,
      periodEnd,
      apiCreditsUsed: 0,
      apiCreditsLimit: apiLimit,
      crawlCreditsUsed: 0,
      crawlCreditsLimit: crawlLimit,
      totalTokensUsed: 0,
      softCapReached: false,
      hardCapReached: false,
      softCapAlertSent: false,
      hardCapAlertSent: false,
      updatedAt: now,
    });
  },
});

/**
 * Record API usage (tokens and cost).
 */
export const recordApiUsage = mutation({
  args: {
    tokensUsed: v.number(),
    costInShekels: v.number(),
  },
  handler: async (ctx, { tokensUsed, costInShekels }) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    let usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    // If no usage record, get subscription tier and initialize
    if (!usage) {
      const subscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();

      const tier = subscription?.tier || "free_trial";

      const usageId = await ctx.db.insert("usageTracking", {
        userId,
        periodStart: now,
        periodEnd: now + 30 * 24 * 60 * 60 * 1000,
        apiCreditsUsed: 0,
        apiCreditsLimit: TIER_API_LIMITS[tier] || TIER_API_LIMITS.free_trial,
        crawlCreditsUsed: 0,
        crawlCreditsLimit: TIER_CRAWL_LIMITS[tier] || TIER_CRAWL_LIMITS.free_trial,
        totalTokensUsed: 0,
        softCapReached: false,
        hardCapReached: false,
        softCapAlertSent: false,
        hardCapAlertSent: false,
        updatedAt: now,
      });

      usage = await ctx.db.get(usageId);
    }

    if (!usage) {
      throw new Error("Failed to create usage tracking");
    }

    // Update usage
    const newApiCreditsUsed = usage.apiCreditsUsed + costInShekels;
    const newTotalTokensUsed = usage.totalTokensUsed + tokensUsed;

    // Check caps
    const softCapReached = newApiCreditsUsed >= usage.apiCreditsLimit * SOFT_CAP_THRESHOLD;
    const hardCapReached = newApiCreditsUsed >= usage.apiCreditsLimit * HARD_CAP_THRESHOLD;

    await ctx.db.patch(usage._id, {
      apiCreditsUsed: newApiCreditsUsed,
      totalTokensUsed: newTotalTokensUsed,
      softCapReached,
      hardCapReached,
      updatedAt: now,
    });

    return {
      softCapReached: softCapReached && !usage.softCapReached,
      hardCapReached: hardCapReached && !usage.hardCapReached,
      apiCreditsUsed: newApiCreditsUsed,
      apiCreditsLimit: usage.apiCreditsLimit,
    };
  },
});

/**
 * Record crawl/deep research usage.
 */
export const recordCrawlUsage = mutation({
  args: {
    creditsUsed: v.optional(v.number()),
  },
  handler: async (ctx, { creditsUsed = 1 }) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!usage) {
      throw new Error("No usage tracking found");
    }

    const newCrawlCreditsUsed = usage.crawlCreditsUsed + creditsUsed;

    await ctx.db.patch(usage._id, {
      crawlCreditsUsed: newCrawlCreditsUsed,
      updatedAt: now,
    });

    return {
      crawlCreditsUsed: newCrawlCreditsUsed,
      crawlCreditsLimit: usage.crawlCreditsLimit,
      remaining: Math.max(0, usage.crawlCreditsLimit - newCrawlCreditsUsed),
    };
  },
});

/**
 * Mark soft cap alert as sent.
 */
export const markSoftCapAlertSent = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (usage) {
      await ctx.db.patch(usage._id, {
        softCapAlertSent: true,
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Mark hard cap alert as sent.
 */
export const markHardCapAlertSent = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (usage) {
      await ctx.db.patch(usage._id, {
        hardCapAlertSent: true,
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Update usage limits based on subscription tier change.
 */
export const updateLimitsForTier = mutation({
  args: {
    userId: v.id("users"),
    tier: v.string(),
  },
  handler: async (ctx, { userId, tier }) => {
    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!usage) {
      return;
    }

    const apiLimit = TIER_API_LIMITS[tier] || TIER_API_LIMITS.free_trial;
    const crawlLimit = TIER_CRAWL_LIMITS[tier] || TIER_CRAWL_LIMITS.free_trial;

    // Recalculate caps with new limits
    const softCapReached = usage.apiCreditsUsed >= apiLimit * SOFT_CAP_THRESHOLD;
    const hardCapReached = usage.apiCreditsUsed >= apiLimit * HARD_CAP_THRESHOLD;

    await ctx.db.patch(usage._id, {
      apiCreditsLimit: apiLimit,
      crawlCreditsLimit: crawlLimit,
      softCapReached,
      hardCapReached,
      updatedAt: Date.now(),
    });
  },
});

