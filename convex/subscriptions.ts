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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return {
        hasAccess: false,
        reason: "Not authenticated",
        remaining: null,
      };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return {
        hasAccess: false,
        reason: "User not found",
        remaining: null,
      };
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
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

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
