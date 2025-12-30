import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
      .unique();
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
 * Also creates a default subscription for new users.
 */
export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing) {
      // Update lastLoginAt
      await ctx.db.patch(existing._id, {
        lastLoginAt: Date.now(),
      });
      return existing;
    }

    const now = Date.now();
    const trialEndsAt = now + 14 * 24 * 60 * 60 * 1000; // 14 days trial

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email ?? "",
      name: identity.name ?? identity.nickname ?? undefined,
      imageUrl: identity.pictureUrl ?? undefined,
      language: "he", // Default to Hebrew
      createdAt: now,
      lastLoginAt: now,
      onboardingCompleted: false,
    });

    // Create default subscription (free trial)
    await ctx.db.insert("subscriptions", {
      userId,
      tier: "free_trial",
      status: "trialing",
      trialStartedAt: now,
      trialEndsAt,
      priceInShekels: 0,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(userId);
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
