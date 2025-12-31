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

/**
 * Get detailed cap status with additional information for UI display
 */
export const getCapStatus = query({
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
        percentUsed: 0,
        daysUntilReset: 30,
        suggestedUpgrade: "plus",
        canUseApi: true,
      };
    }

    const tierConfig = await getUserTierConfig(ctx, userId);
    const caps = calculateCaps(tierConfig.id as SubscriptionTier);

    const now = Date.now();
    const daysUntilReset = Math.max(
      0,
      Math.ceil((usage.periodEnd - now) / (24 * 60 * 60 * 1000))
    );

    const percentUsed = Math.round((usage.apiCreditsUsed / caps.totalBudget) * 100);

    // Determine suggested upgrade based on current tier
    let suggestedUpgrade: SubscriptionTier = "plus";
    if (tierConfig.id === "plus") {
      suggestedUpgrade = "pro";
    } else if (tierConfig.id === "pro") {
      suggestedUpgrade = "max";
    } else if (tierConfig.id === "max") {
      suggestedUpgrade = "max"; // Already at max
    }

    return {
      softCapReached: usage.softCapReached,
      hardCapReached: usage.hardCapReached,
      percentUsed,
      daysUntilReset,
      suggestedUpgrade,
      canUseApi: usage.apiCreditsUsed < usage.apiCreditsLimit,
      currentTier: tierConfig.id,
      currentUsage: usage.apiCreditsUsed,
      totalBudget: caps.totalBudget,
      softCap: caps.softCap,
      hardCap: caps.hardCap,
    };
  },
});

/**
 * Check caps and create alerts if thresholds are crossed
 * Should be called after any usage update
 */
export const checkAndHandleCaps = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!usage) {
      return { alertsCreated: [] };
    }

    const tierConfig = await getUserTierConfig(ctx, userId);
    const caps = calculateCaps(tierConfig.id as SubscriptionTier);
    const alertsCreated: string[] = [];

    // Check soft cap (40%)
    if (usage.apiCreditsUsed >= caps.softCap && !usage.softCapAlertSent) {
      await ctx.db.insert("alerts", {
        userId,
        type: "usage_warning",
        title: "השתמשת ב-40% מהתקציב החודשי",
        message: `השתמשת בכ-₪${usage.apiCreditsUsed.toFixed(2)} מתוך ₪${caps.totalBudget} התקציב שלך. שקול לשדרג את המנוי שלך.`,
        priority: "medium",
        isRead: false,
        isDismissed: false,
        actionUrl: "/pricing",
        actionLabel: "צפה בתוכניות",
        createdAt: now,
      });

      await ctx.db.patch(usage._id, {
        softCapReached: true,
        softCapAlertSent: true,
        updatedAt: now,
      });

      alertsCreated.push("soft_cap");
    }

    // Check hard cap (60%)
    if (usage.apiCreditsUsed >= caps.hardCap && !usage.hardCapAlertSent) {
      await ctx.db.insert("alerts", {
        userId,
        type: "usage_warning",
        title: "אזהרה: השתמשת ב-60% מהתקציב",
        message: `השתמשת בכ-₪${usage.apiCreditsUsed.toFixed(2)} מתוך ₪${caps.totalBudget}. השימוש יוגבל בקרוב. שדרג עכשיו למניעת הפרעות.`,
        priority: "high",
        isRead: false,
        isDismissed: false,
        actionUrl: "/pricing",
        actionLabel: "שדרג עכשיו",
        createdAt: now,
      });

      await ctx.db.patch(usage._id, {
        hardCapReached: true,
        hardCapAlertSent: true,
        updatedAt: now,
      });

      alertsCreated.push("hard_cap");
    }

    // Check if usage has reached the limit
    if (usage.apiCreditsUsed >= usage.apiCreditsLimit) {
      await ctx.db.insert("alerts", {
        userId,
        type: "usage_warning",
        title: "התקציב החודשי נוצל",
        message: "הגעת לגבול השימוש החודשי. שדרג את המנוי שלך כדי להמשיך להשתמש בשירות.",
        priority: "urgent",
        isRead: false,
        isDismissed: false,
        actionUrl: "/pricing",
        actionLabel: "שדרג עכשיו",
        createdAt: now,
      });

      alertsCreated.push("limit_reached");
    }

    return { alertsCreated };
  },
});

/**
 * Handle downgrade from a higher tier to a lower tier
 * Adjusts limits but keeps current usage
 */
export const handleDowngrade = mutation({
  args: {
    userId: v.id("users"),
    newTier: v.string(),
  },
  handler: async (ctx, { userId, newTier }) => {
    const now = Date.now();

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!usage) {
      return;
    }

    const newTierConfig = SUBSCRIPTION_TIERS[newTier as SubscriptionTier] || SUBSCRIPTION_TIERS.free_trial;
    const newCaps = calculateCaps(newTier as SubscriptionTier);

    // Calculate new cap status with new limits
    const softCapReached = usage.apiCreditsUsed >= newCaps.softCap;
    const hardCapReached = usage.apiCreditsUsed >= newCaps.hardCap;

    // Update usage limits
    await ctx.db.patch(usage._id, {
      apiCreditsLimit: newTierConfig.apiBudget,
      crawlCreditsLimit:
        newTierConfig.limits.deepResearchPerMonth === -1
          ? 999999
          : newTierConfig.limits.deepResearchPerMonth,
      softCapReached,
      hardCapReached,
      // Don't reset alert flags - let them see caps if applicable
      softCapAlertSent: softCapReached ? usage.softCapAlertSent : false,
      hardCapAlertSent: hardCapReached ? usage.hardCapAlertSent : false,
      updatedAt: now,
    });

    // Create alert about downgrade
    await ctx.db.insert("alerts", {
      userId,
      type: "system",
      title: "המנוי שלך עודכן",
      message: `המנוי שלך שונה ל-${newTierConfig.nameHe}. התקציב החודשי שלך כעת ₪${newTierConfig.apiBudget}.`,
      priority: "medium",
      isRead: false,
      isDismissed: false,
      createdAt: now,
    });
  },
});

/**
 * Reset monthly usage at the start of a new billing period
 */
export const resetMonthlyUsage = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const now = Date.now();

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!usage) {
      return;
    }

    // Get current tier to set proper limits
    const tierConfig = await getUserTierConfig(ctx, userId);

    // Calculate new period end (30 days from now)
    const newPeriodEnd = now + 30 * 24 * 60 * 60 * 1000;

    // Reset all usage counters
    await ctx.db.patch(usage._id, {
      periodStart: now,
      periodEnd: newPeriodEnd,
      apiCreditsUsed: 0,
      crawlCreditsUsed: 0,
      totalTokensUsed: 0,
      softCapReached: false,
      hardCapReached: false,
      softCapAlertSent: false,
      hardCapAlertSent: false,
      updatedAt: now,
    });

    // Create alert about reset
    await ctx.db.insert("alerts", {
      userId,
      type: "system",
      title: "התקציב החודשי שלך אופס",
      message: `התקציב החודשי שלך אופס. יש לך כעת ₪${tierConfig.apiBudget} לשימוש החודש.`,
      priority: "low",
      isRead: false,
      isDismissed: false,
      createdAt: now,
    });

    return { newPeriodEnd };
  },
});