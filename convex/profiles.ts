import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get the current user's profile (ProfileLite)
 */
export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // First get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    // Get the profile for this user
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return profile;
  },
});

/**
 * Upsert (create or update) the current user's profile
 */
export const upsertMyProfile = mutation({
  args: {
    region: v.optional(v.string()),
    city: v.optional(v.string()),
    tracks: v.array(v.union(v.literal("nii"), v.literal("mod"), v.literal("moh"))),
    tags: v.array(v.string()),
  },
  handler: async (ctx, { region, city, tracks, tags }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();

    // Check if profile exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        region,
        city,
        tracks,
        tags,
        updatedAt: now,
      });
      return existingProfile._id;
    }

    // Create new profile
    return await ctx.db.insert("profiles", {
      userId: user._id,
      region,
      city,
      tracks,
      tags,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Get a profile by user ID (for internal use / admin)
 */
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

