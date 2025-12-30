import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import {
  SUBSCRIPTION_TIERS,
  calculateCaps,
  type SubscriptionTier,
} from "./lib/subscriptionConfig";

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

/**
 * Get tier config for a user's subscription
 */
async function getUserTierConfig(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  const subscription = await ctx.db
    .query("subscriptions")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  const tier = (subscription?.tier as SubscriptionTier) || "free_trial";
  return SUBSCRIPTION_TIERS[tier];
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

    // Get tier config for cap calculation
    const tierConfig = await getUserTierConfig(ctx, userId);
    const caps = calculateCaps(tierConfig.id as SubscriptionTier);

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
      softCap: caps.softCap,
      hardCap: caps.hardCap,
      totalBudget: caps.totalBudget,
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

    // Get tier config for limits
    const tierConfig = await getUserTierConfig(ctx, userId);
    const caps = calculateCaps(tierConfig.id as SubscriptionTier);

    return {
      softCapReached: usage.apiCreditsUsed >= caps.softCap,
      hardCapReached: usage.apiCreditsUsed >= caps.hardCap,
      canUseApi: usage.apiCreditsUsed < usage.apiCreditsLimit,
      canUseCrawl:
        tierConfig.limits.deepResearchPerMonth === -1 ||
        usage.crawlCreditsUsed < usage.crawlCreditsLimit,
      currentUsage: usage.apiCreditsUsed,
      softCap: caps.softCap,
      hardCap: caps.hardCap,
      totalBudget: caps.totalBudget,
    };
  },
});

/**
 * Check daily chat limit
 */
export const checkDailyChatLimit = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    // Get tier config
    const tierConfig = await getUserTierConfig(ctx, userId);
    const dailyLimit = tierConfig.limits.chatsPerDay;

    // Unlimited
    if (dailyLimit === -1) {
      return {
        canChat: true,
        remaining: null,
        limit: null,
        isUnlimited: true,
      };
    }

    // Count today's chat sessions
    const now = Date.now();
    const startOfDay = now - (now % (24 * 60 * 60 * 1000));

    const todaySessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("createdAt"), startOfDay))
      .collect();

    const usedToday = todaySessions.length;
    const remaining = Math.max(0, dailyLimit - usedToday);

    return {
      canChat: usedToday < dailyLimit,
      remaining,
      limit: dailyLimit,
      isUnlimited: false,
    };
  },
});

/**
 * Check checklist limit
 */
export const checkChecklistLimit = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    // Get tier config
    const tierConfig = await getUserTierConfig(ctx, userId);
    const maxChecklists = tierConfig.limits.maxChecklists;

    // Unlimited
    if (maxChecklists === -1) {
      return {
        canCreate: true,
        remaining: null,
        limit: null,
        isUnlimited: true,
      };
    }

    // Count user's checklists
    const checklists = await ctx.db
      .query("checklists")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const currentCount = checklists.length;
    const remaining = Math.max(0, maxChecklists - currentCount);

    return {
      canCreate: currentCount < maxChecklists,
      remaining,
      limit: maxChecklists,
      current: currentCount,
      isUnlimited: false,
    };
  },
});

/**
 * Check saved rights limit
 */
export const checkSavedRightsLimit = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    // Get tier config
    const tierConfig = await getUserTierConfig(ctx, userId);
    const maxSavedRights = tierConfig.limits.maxSavedRights;

    // Unlimited
    if (maxSavedRights === -1) {
      return {
        canSave: true,
        remaining: null,
        limit: null,
        isUnlimited: true,
      };
    }

    // Count user's saved rights
    const savedRights = await ctx.db
      .query("savedRights")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const currentCount = savedRights.length;
    const remaining = Math.max(0, maxSavedRights - currentCount);

    return {
      canSave: currentCount < maxSavedRights,
      remaining,
      limit: maxSavedRights,
      current: currentCount,
      isUnlimited: false,
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

    // Get tier configuration
    const tierConfig = SUBSCRIPTION_TIERS[tier as SubscriptionTier] || SUBSCRIPTION_TIERS.free_trial;
    const periodEnd = now + 30 * 24 * 60 * 60 * 1000; // 30 days

    // Check if usage already exists
    const existing = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      // Reset existing usage
      await ctx.db.patch(existing._id, {
        periodStart: now,
        periodEnd,
        apiCreditsUsed: 0,
        apiCreditsLimit: tierConfig.apiBudget,
        crawlCreditsUsed: 0,
        crawlCreditsLimit:
          tierConfig.limits.deepResearchPerMonth === -1
            ? 999999
            : tierConfig.limits.deepResearchPerMonth,
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
      apiCreditsLimit: tierConfig.apiBudget,
      crawlCreditsUsed: 0,
      crawlCreditsLimit:
        tierConfig.limits.deepResearchPerMonth === -1
          ? 999999
          : tierConfig.limits.deepResearchPerMonth,
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
      const tierConfig = await getUserTierConfig(ctx, userId);

      const usageId = await ctx.db.insert("usageTracking", {
        userId,
        periodStart: now,
        periodEnd: now + 30 * 24 * 60 * 60 * 1000,
        apiCreditsUsed: 0,
        apiCreditsLimit: tierConfig.apiBudget,
        crawlCreditsUsed: 0,
        crawlCreditsLimit:
          tierConfig.limits.deepResearchPerMonth === -1
            ? 999999
            : tierConfig.limits.deepResearchPerMonth,
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

    // Get tier config for cap calculation
    const tierConfig = await getUserTierConfig(ctx, userId);
    const caps = calculateCaps(tierConfig.id as SubscriptionTier);

    // Update usage
    const newApiCreditsUsed = usage.apiCreditsUsed + costInShekels;
    const newTotalTokensUsed = usage.totalTokensUsed + tokensUsed;

    // Check caps
    const softCapReached = newApiCreditsUsed >= caps.softCap;
    const hardCapReached = newApiCreditsUsed >= caps.hardCap;

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
      softCap: caps.softCap,
      hardCap: caps.hardCap,
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

    const tierConfig = SUBSCRIPTION_TIERS[tier as SubscriptionTier] || SUBSCRIPTION_TIERS.free_trial;
    const caps = calculateCaps(tier as SubscriptionTier);

    // Recalculate caps with new limits
    const softCapReached = usage.apiCreditsUsed >= caps.softCap;
    const hardCapReached = usage.apiCreditsUsed >= caps.hardCap;

    await ctx.db.patch(usage._id, {
      apiCreditsLimit: tierConfig.apiBudget,
      crawlCreditsLimit:
        tierConfig.limits.deepResearchPerMonth === -1
          ? 999999
          : tierConfig.limits.deepResearchPerMonth,
      softCapReached,
      hardCapReached,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Get usage summary for display
 */
export const getUsageSummary = query({
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

    const tierConfig = await getUserTierConfig(ctx, userId);
    const caps = calculateCaps(tierConfig.id as SubscriptionTier);

    // Calculate days remaining in period
    const now = Date.now();
    const daysRemaining = Math.max(
      0,
      Math.ceil((usage.periodEnd - now) / (24 * 60 * 60 * 1000))
    );

    return {
      tier: tierConfig.id,
      tierName: tierConfig.name,
      tierNameHe: tierConfig.nameHe,

      // API budget
      apiCreditsUsed: Math.round(usage.apiCreditsUsed * 100) / 100,
      apiCreditsLimit: tierConfig.apiBudget,
      apiUsagePercent: Math.round((usage.apiCreditsUsed / tierConfig.apiBudget) * 100),

      // Caps
      softCap: caps.softCap,
      hardCap: caps.hardCap,
      softCapReached: usage.softCapReached,
      hardCapReached: usage.hardCapReached,

      // Tokens
      totalTokensUsed: usage.totalTokensUsed,

      // Deep research
      crawlCreditsUsed: usage.crawlCreditsUsed,
      crawlCreditsLimit:
        tierConfig.limits.deepResearchPerMonth === -1
          ? "unlimited"
          : tierConfig.limits.deepResearchPerMonth,

      // Period
      periodStart: usage.periodStart,
      periodEnd: usage.periodEnd,
      daysRemaining,

      // Limits
      limits: tierConfig.limits,
    };
  },
});
