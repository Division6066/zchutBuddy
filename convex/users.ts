import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const createOrUpdateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const userData = {
      email: identity.email || "",
      fullName: identity.name || identity.nickname || "User",
      role: "user" as const,
      isActive: true,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, userData);
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      ...userData,
      createdAt: now,
    });
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, { userId, fullName }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(userId, {
      fullName,
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const remove = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.delete(userId);
  },
});

// ============================================
// PLAN TIER FUNCTIONS (MVP - manual, no billing)
// ============================================

/**
 * Get the current user's plan details
 */
export const getMyPlan = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    return {
      planTier: user.planTier ?? "free",
      planId: user.planId,
      planStartedAt: user.planStartedAt,
      planEndsAt: user.planEndsAt,
      planUpdatedAt: user.planUpdatedAt,
    };
  },
});

/**
 * Set plan tier for a user (admin-only for MVP)
 */
export const setPlanTier = mutation({
  args: {
    userId: v.id("users"),
    planTier: v.union(v.literal("free"), v.literal("trial"), v.literal("plus")),
    planId: v.optional(v.string()),
    planStartedAt: v.optional(v.number()),
    planEndsAt: v.optional(v.number()),
  },
  handler: async (ctx, { userId, planTier, planId, planStartedAt, planEndsAt }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if current user is admin
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Admin access required");
    }

    const now = Date.now();
    await ctx.db.patch(userId, {
      planTier,
      planId,
      planStartedAt: planStartedAt ?? now,
      planEndsAt,
      planUpdatedAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

/**
 * Check if user's plan is active (not expired)
 */
export const isPlanActive = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { isActive: false, planTier: "free" as const };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return { isActive: false, planTier: "free" as const };
    }

    const planTier = user.planTier ?? "free";

    // Free tier is always active
    if (planTier === "free") {
      return { isActive: true, planTier };
    }

    // Check expiration for trial/plus
    if (user.planEndsAt && user.planEndsAt < Date.now()) {
      return { isActive: false, planTier, expired: true };
    }

    return { isActive: true, planTier };
  },
});
