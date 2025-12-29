import { v } from "convex/values";
import { query } from "./_generated/server";

// ============================================
// TYPES
// ============================================

/**
 * Subscription tier levels available in the system.
 */
export type SubscriptionTier = "free_trial" | "plus" | "pro" | "max";

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

// Simple admin email check - replace with proper RBAC later
const ADMIN_EMAILS = ["levidavidspublic@proton.me"];

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
 * Daily usage limits for free_trial tier.
 * Other tiers have unlimited access.
 */
const FREE_TRIAL_DAILY_LIMITS: Partial<Record<FeatureAccess, number>> = {
  rights_finder: 5,
};

// ============================================
// QUERIES
// ============================================

/**
 * Check if the current user has access to a specific feature.
 * For free_trial users, also enforces daily usage limits.
 *
 * Returns:
 * - hasAccess: boolean - whether the user can use the feature
 * - reason: string - explanation if access denied
 * - remaining: number | null - remaining uses today (for limited features)
 */
export const hasFeatureAccess = query({
  args: {
    feature: featureAccessValidator,
  },
  handler: async (ctx, { feature }) => {
    const identity = await ctx.auth.getUserIdentity();

    // Not authenticated - no access
    if (!identity) {
      return {
        hasAccess: false,
        reason: "Not authenticated",
        remaining: null,
      };
    }

    // Get user from database
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

    const tier = user.subscriptionTier;
    const allowedFeatures = TIER_FEATURES[tier];

    // Check if feature is allowed for this tier
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
        // Calculate start of today (midnight UTC)
        const now = Date.now();
        const startOfDay = now - (now % (24 * 60 * 60 * 1000));

        // Count usage today by querying the queries table
        // (rights_finder uses the queries table)
        if (feature === "rights_finder") {
          const todayQueries = await ctx.db
            .query("queries")
            .withIndex("by_user_createdAt", (q) =>
              q.eq("userId", user._id).gte("createdAt", startOfDay)
            )
            .collect();

          const usedToday = todayQueries.length;
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

    // Access granted (no limits for paid tiers)
    return {
      hasAccess: true,
      reason: "Access granted",
      remaining: null,
    };
  },
});

/**
 * Get subscription tier for a user by Clerk ID.
 * Admin-only query for looking up other users.
 */
export const getSubscriptionTier = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify caller is admin by email
    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!adminUser || !ADMIN_EMAILS.includes(adminUser.email)) {
      throw new Error("Admin access required");
    }

    // Look up target user
    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (!targetUser) {
      return null;
    }

    return {
      subscriptionTier: targetUser.subscriptionTier,
    };
  },
});

/**
 * Get the current user's own subscription info.
 * Public query - no admin check needed.
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

    return {
      subscriptionTier: user.subscriptionTier,
      features: TIER_FEATURES[user.subscriptionTier],
    };
  },
});
