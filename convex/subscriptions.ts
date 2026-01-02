import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================
// TYPES
// ============================================

/**
 * Subscription tier levels available in the system.
 */
export type SubscriptionTier = "free_trial" | "plus" | "pro" | "max";

/**
 * Subscription status values.
 */
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

/**
 * Features that can be gated by subscription tier.
 */
export type FeatureAccess =
  | "rights_finder"
  | "basic_checklists"
  | "checklists"
  | "updates_feed"
  | "export_pdf"
  | "deep_search"
  | "priority_support";

// ============================================
// VALIDATORS
// ============================================

/**
 * Convex validator for subscription tier.
 */
export const subscriptionTierValidator = v.union(
  v.literal("free_trial"),
  v.literal("plus"),
  v.literal("pro"),
  v.literal("max")
);

/**
 * Convex validator for subscription status.
 */
export const subscriptionStatusValidator = v.union(
  v.literal("active"),
  v.literal("canceled"),
  v.literal("past_due"),
  v.literal("trialing")
);

/**
 * Convex validator for feature access.
 */
export const featureAccessValidator = v.union(
  v.literal("rights_finder"),
  v.literal("basic_checklists"),
  v.literal("checklists"),
  v.literal("updates_feed"),
  v.literal("export_pdf"),
  v.literal("deep_search"),
  v.literal("priority_support")
);

// ============================================
// FEATURE ACCESS RULES
// ============================================

/**
 * Define which features each tier can access.
 * Higher tiers inherit all features from lower tiers.
 */
const TIER_FEATURES: Record<SubscriptionTier, FeatureAccess[]> = {
  free_trial: ["rights_finder", "basic_checklists"],
  plus: ["rights_finder", "basic_checklists", "checklists", "updates_feed"],
  pro: ["rights_finder", "basic_checklists", "checklists", "updates_feed", "export_pdf"],
  max: [
    "rights_finder",
    "basic_checklists",
    "checklists",
    "updates_feed",
    "export_pdf",
    "deep_search",
    "priority_support",
  ],
};

/**
 * Pricing per tier in shekels (monthly).
 */
const TIER_PRICING: Record<SubscriptionTier, number> = {
  free_trial: 0,
  plus: 29,
  pro: 49,
  max: 99,
};

/**
 * Daily usage limits for free_trial tier.
 */
const FREE_TRIAL_DAILY_LIMITS: Partial<Record<FeatureAccess, number>> = {
  rights_finder: 5,
};

// ============================================
// QUERIES
// ============================================

/**
 * Get the current user's subscription.
 */
export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!subscription) {
      return null;
    }

    return {
      ...subscription,
      features: TIER_FEATURES[subscription.tier as SubscriptionTier] || [],
    };
  },
});

/**
 * Check if the current user has access to a specific feature.
 */
export const hasFeatureAccess = query({
  args: {
    feature: featureAccessValidator,
  },
  handler: async (ctx, { feature }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return {
        hasAccess: false,
        reason: "Not authenticated",
        remaining: null,
      };
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!subscription) {
      return {
        hasAccess: false,
        reason: "No subscription found",
        remaining: null,
      };
    }

    // Check if subscription is active or trialing
    if (subscription.status !== "active" && subscription.status !== "trialing") {
      return {
        hasAccess: false,
        reason: "Subscription is not active",
        remaining: null,
      };
    }

    // Check if trial has expired
    if (subscription.status === "trialing" && subscription.trialEndsAt) {
      if (Date.now() > subscription.trialEndsAt) {
        return {
          hasAccess: false,
          reason: "Trial period has expired",
          remaining: null,
        };
      }
    }

    const tier = subscription.tier as SubscriptionTier;
    const allowedFeatures = TIER_FEATURES[tier] || [];

    if (!allowedFeatures.includes(feature)) {
      return {
        hasAccess: false,
        reason: `Feature "${feature}" requires a higher subscription tier`,
        remaining: null,
      };
    }

    // For free_trial, check daily usage limits
    if (tier === "free_trial") {
      const dailyLimit = FREE_TRIAL_DAILY_LIMITS[feature];

      if (dailyLimit !== undefined) {
        // Get usage tracking for today
        const now = Date.now();
        const startOfDay = now - (now % (24 * 60 * 60 * 1000));

        const usageTracking = await ctx.db
          .query("usageTracking")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .unique();

        // If no usage tracking exists or it's from a previous period, user has full limit
        if (!usageTracking || usageTracking.periodStart < startOfDay) {
          return {
            hasAccess: true,
            reason: "Access granted",
            remaining: dailyLimit,
          };
        }

        // Count based on chat sessions created today (for rights_finder)
        if (feature === "rights_finder") {
          const todaySessions = await ctx.db
            .query("chatSessions")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .filter((q) => q.gte(q.field("createdAt"), startOfDay))
            .collect();

          const usedToday = todaySessions.filter((s) => s.type === "rights_finder").length;
          const remaining = Math.max(0, dailyLimit - usedToday);

          if (usedToday >= dailyLimit) {
            return {
              hasAccess: false,
              reason: `Daily limit of ${dailyLimit} reached for "${feature}"`,
              remaining: 0,
            };
          }

          return {
            hasAccess: true,
            reason: "Access granted",
            remaining,
          };
        }
      }
    }

    return {
      hasAccess: true,
      reason: "Access granted",
      remaining: null,
    };
  },
});

/**
 * Get subscription by user ID (admin/internal use).
 */
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

/**
 * Get all features available for a tier.
 */
export const getTierFeatures = query({
  args: { tier: subscriptionTierValidator },
  handler: async (_ctx, { tier }) => {
    return TIER_FEATURES[tier as SubscriptionTier] || [];
  },
});

/**
 * Get pricing for all tiers.
 */
export const getTierPricing = query({
  args: {},
  handler: async () => {
    return TIER_PRICING;
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a subscription for a user (internal use).
 */
export const createSubscription = mutation({
  args: {
    userId: v.id("users"),
    tier: subscriptionTierValidator,
    status: subscriptionStatusValidator,
    trialEndsAt: v.optional(v.number()),
  },
  handler: async (ctx, { userId, tier, status, trialEndsAt }) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
      throw new Error("Not authenticated");
    }

    // Check if subscription already exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      throw new Error("Subscription already exists for this user");
    }

    const now = Date.now();

    return await ctx.db.insert("subscriptions", {
      userId,
      tier,
      status,
      trialStartedAt: status === "trialing" ? now : undefined,
      trialEndsAt,
      priceInShekels: TIER_PRICING[tier as SubscriptionTier] || 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update subscription tier.
 */
export const updateTier = mutation({
  args: {
    tier: subscriptionTierValidator,
  },
  handler: async (ctx, { tier }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!subscription) {
      throw new Error("No subscription found");
    }

    const now = Date.now();

    await ctx.db.patch(subscription._id, {
      tier,
      status: "active",
      priceInShekels: TIER_PRICING[tier as SubscriptionTier] || 0,
      currentPeriodStart: now,
      currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000, // 30 days
      updatedAt: now,
    });

    return subscription._id;
  },
});

/**
 * Cancel subscription.
 */
export const cancelSubscription = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!subscription) {
      throw new Error("No subscription found");
    }

    await ctx.db.patch(subscription._id, {
      status: "canceled",
      updatedAt: Date.now(),
    });

    return subscription._id;
  },
});

/**
 * Change subscription tier with upgrade/downgrade detection.
 * Creates appropriate alerts and adjusts usage limits.
 */
export const changeTier = mutation({
  args: {
    newTier: subscriptionTierValidator,
    billingCycle: v.optional(v.union(v.literal("monthly"), v.literal("annual"))),
  },
  handler: async (ctx, { newTier, billingCycle = "monthly" }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!subscription) {
      throw new Error("No subscription found");
    }

    const now = Date.now();
    const oldTier = subscription.tier as SubscriptionTier;
    const tierOrder: SubscriptionTier[] = ["free_trial", "plus", "pro", "max"];
    const isUpgrade = tierOrder.indexOf(newTier) > tierOrder.indexOf(oldTier);
    const isDowngrade = tierOrder.indexOf(newTier) < tierOrder.indexOf(oldTier);

    // Calculate period end based on billing cycle
    // Annual = 12 months for price of 10
    const periodDays = billingCycle === "annual" ? 365 : 30;
    const periodEnd = now + periodDays * 24 * 60 * 60 * 1000;

    // Calculate price
    const monthlyPrice = TIER_PRICING[newTier];
    const finalPrice = billingCycle === "annual" ? monthlyPrice * 10 : monthlyPrice;

    await ctx.db.patch(subscription._id, {
      tier: newTier,
      status: "active",
      priceInShekels: finalPrice,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      // Clear trial info if upgrading from trial
      trialEndsAt: undefined,
      trialStartedAt: undefined,
      updatedAt: now,
    });

    // Create alert based on change type
    if (isUpgrade) {
      await ctx.db.insert("alerts", {
        userId,
        type: "system",
        title: "המנוי שלך שודרג!",
        message: `שודרגת בהצלחה למנוי ${newTier === "plus" ? "פלוס" : newTier === "pro" ? "פרו" : "מקס"}. נהנה מכל היתרונות החדשים!`,
        priority: "medium",
        isRead: false,
        isDismissed: false,
        actionUrl: "/settings",
        actionLabel: "צפה בפרטי המנוי",
        createdAt: now,
      });
    } else if (isDowngrade) {
      await ctx.db.insert("alerts", {
        userId,
        type: "system",
        title: "המנוי שלך שונה",
        message: `המנוי שלך שונה. חלק מהתכונות עשויות להיות מוגבלות.`,
        priority: "medium",
        isRead: false,
        isDismissed: false,
        createdAt: now,
      });
    }

    return {
      subscriptionId: subscription._id,
      isUpgrade,
      isDowngrade,
      newTier,
      periodEnd,
    };
  },
});

/**
 * Reactivate a canceled subscription.
 */
export const reactivateSubscription = mutation({
  args: {
    tier: v.optional(subscriptionTierValidator),
  },
  handler: async (ctx, { tier }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!subscription) {
      throw new Error("No subscription found");
    }

    const now = Date.now();
    const reactiveTier = tier || (subscription.tier as SubscriptionTier);

    await ctx.db.patch(subscription._id, {
      status: "active",
      tier: reactiveTier,
      priceInShekels: TIER_PRICING[reactiveTier],
      currentPeriodStart: now,
      currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000,
      updatedAt: now,
    });

    // Create reactivation alert
    await ctx.db.insert("alerts", {
      userId,
      type: "system",
      title: "ברוך שובך!",
      message: "המנוי שלך הופעל מחדש. שמחים לראות אותך חוזר!",
      priority: "low",
      isRead: false,
      isDismissed: false,
      actionUrl: "/dashboard",
      actionLabel: "לדשבורד",
      createdAt: now,
    });

    return subscription._id;
  },
});

/**
 * Check if trial has expired.
 */
export const checkTrialExpiry = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { isExpired: false, daysRemaining: null };
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!subscription) {
      return { isExpired: false, daysRemaining: null };
    }

    // Only check for trialing subscriptions
    if (subscription.status !== "trialing") {
      return {
        isExpired: false,
        daysRemaining: null,
        status: subscription.status,
        tier: subscription.tier,
      };
    }

    const now = Date.now();
    const trialEnd = subscription.trialEndsAt || now;
    const isExpired = now > trialEnd;
    const daysRemaining = isExpired ? 0 : Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000));

    return {
      isExpired,
      daysRemaining,
      trialEndsAt: trialEnd,
      status: subscription.status,
      tier: subscription.tier,
    };
  },
});

/**
 * Handle expired trial - convert to limited free tier or prompt upgrade.
 */
export const handleExpiredTrial = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!subscription) {
      throw new Error("No subscription found");
    }

    // Only handle expired trials
    if (subscription.status !== "trialing") {
      return { handled: false, reason: "Not in trial" };
    }

    const now = Date.now();
    const trialEnd = subscription.trialEndsAt || now;

    if (now <= trialEnd) {
      return { handled: false, reason: "Trial not yet expired" };
    }

    // Mark as past_due (trial expired, needs upgrade)
    await ctx.db.patch(subscription._id, {
      status: "past_due",
      updatedAt: now,
    });

    // Create trial expired alert
    await ctx.db.insert("alerts", {
      userId,
      type: "system",
      title: "תקופת הניסיון הסתיימה",
      message: "תקופת הניסיון שלך הסתיימה. שדרג עכשיו כדי להמשיך ליהנות מכל התכונות.",
      priority: "urgent",
      isRead: false,
      isDismissed: false,
      actionUrl: "/pricing",
      actionLabel: "שדרג עכשיו",
      createdAt: now,
    });

    return { handled: true, newStatus: "past_due" };
  },
});

/**
 * Get upgrade options from current tier.
 */
export const getUpgradeOptions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const currentTier = (subscription?.tier as SubscriptionTier) || "free_trial";
    const tierOrder: SubscriptionTier[] = ["free_trial", "plus", "pro", "max"];
    const currentIndex = tierOrder.indexOf(currentTier);

    // Return all tiers higher than current
    return tierOrder.slice(currentIndex + 1).map((tier) => ({
      tier,
      monthlyPrice: TIER_PRICING[tier],
      annualPrice: TIER_PRICING[tier] * 10, // Pay 10 months for 12
      features: TIER_FEATURES[tier],
    }));
  },
});
