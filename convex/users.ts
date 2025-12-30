import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "./lib/subscriptionConfig";

/**
 * Get the current authenticated user
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

/**
 * Get a user by their ID
 */
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

/**
 * Get or create a user based on Clerk identity.
 * Creates a new user with default values if not found.
 * Also creates:
 * - Default subscription (free trial)
 * - Usage tracking initialized with tier limits
 * - Empty user profile
 */
export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      // Update last login
      await ctx.db.patch(existingUser._id, {
        lastLoginAt: Date.now(),
      });
      return existingUser;
    }

    // Get free trial configuration
    const trialConfig = SUBSCRIPTION_TIERS.free_trial;
    const now = Date.now();
    const trialEnd = now + trialConfig.trialDays * 24 * 60 * 60 * 1000;

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId,
      email: identity.email ?? "",
      name: identity.name ?? identity.nickname ?? undefined,
      imageUrl: identity.pictureUrl ?? undefined,
      language: "he", // Default to Hebrew
      createdAt: now,
      lastLoginAt: now,
      onboardingCompleted: false,
    });

    // Create free trial subscription
    await ctx.db.insert("subscriptions", {
      userId,
      tier: "free_trial",
      status: "trialing",
      trialStartedAt: now,
      trialEndsAt: trialEnd,
      priceInShekels: trialConfig.priceShekels,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize usage tracking with tier limits
    await ctx.db.insert("usageTracking", {
      userId,
      periodStart: now,
      periodEnd: trialEnd,
      apiCreditsUsed: 0,
      apiCreditsLimit: trialConfig.apiBudget,
      crawlCreditsUsed: 0,
      crawlCreditsLimit: trialConfig.limits.deepResearchPerMonth,
      totalTokensUsed: 0,
      softCapReached: false,
      hardCapReached: false,
      softCapAlertSent: false,
      hardCapAlertSent: false,
      updatedAt: now,
    });

    // Create empty user profile
    await ctx.db.insert("userProfiles", {
      userId,
      isAnonymous: false,
      updatedAt: now,
    });

    return await ctx.db.get(userId);
  },
});

/**
 * Get user subscription with tier details
 */
export const getUserSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!subscription) {
      return null;
    }

    // Get tier config
    const tierConfig = SUBSCRIPTION_TIERS[subscription.tier as SubscriptionTier];

    return {
      ...subscription,
      tierConfig,
    };
  },
});

/**
 * Get user usage tracking
 */
export const getUserUsage = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
  },
});

/**
 * Update user profile information
 */
export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    language: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
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

    const updateData: Record<string, unknown> = {};
    if (args.name !== undefined) updateData.name = args.name;
    if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;
    if (args.language !== undefined) updateData.language = args.language;
    if (args.onboardingCompleted !== undefined)
      updateData.onboardingCompleted = args.onboardingCompleted;

    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(user._id, updateData);
    }

    return await ctx.db.get(user._id);
  },
});

/**
 * Mark onboarding as completed
 */
export const completeOnboarding = mutation({
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

    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
    });

    return user._id;
  },
});

/**
 * Get user profile
 */
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
  },
});

/**
 * Update user profile (onboarding data)
 */
export const updateUserProfile = mutation({
  args: {
    ageRange: v.optional(v.string()),
    city: v.optional(v.string()),
    hmo: v.optional(v.string()),
    employmentStatus: v.optional(v.string()),
    idfService: v.optional(v.string()),
    isIdfDisabled: v.optional(v.boolean()),
    disabilities: v.optional(v.array(v.string())),
    disabilitySeverity: v.optional(v.string()),
    relevantMinistries: v.optional(v.array(v.string())),
    isAnonymous: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
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

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    const now = Date.now();

    if (profile) {
      // Update existing profile
      const updateData: Record<string, unknown> = { updatedAt: now };
      for (const [key, value] of Object.entries(args)) {
        if (value !== undefined) {
          updateData[key] = value;
        }
      }
      await ctx.db.patch(profile._id, updateData);
      return profile._id;
    }

    // Create new profile
    return await ctx.db.insert("userProfiles", {
      userId: user._id,
      ...args,
      isAnonymous: args.isAnonymous ?? false,
      updatedAt: now,
    });
  },
});
