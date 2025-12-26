import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a new rights query (auth optional for anonymous preview)
 */
export const createQuery = mutation({
  args: {
    input: v.string(),
    anonSessionId: v.optional(v.string()), // For anonymous rate limiting
  },
  handler: async (ctx, { input, anonSessionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const now = Date.now();

    let userId;

    if (identity) {
      // Get the user record
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique();

      userId = user?._id;
    }

    // Create the query record
    return await ctx.db.insert("queries", {
      userId,
      anonSessionId: userId ? undefined : anonSessionId, // Only store anonSessionId if not authenticated
      input,
      createdAt: now,
    });
  },
});

/**
 * List queries for the current authenticated user
 */
export const listMyQueries = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    // Get queries for this user
    const queries = await ctx.db
      .query("queries")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    return queries;
  },
});

/**
 * Get a single query by ID
 */
export const getById = query({
  args: { queryId: v.id("queries") },
  handler: async (ctx, { queryId }) => {
    return await ctx.db.get(queryId);
  },
});

/**
 * Count recent queries for anonymous rate limiting
 */
export const countRecentAnonQueries = query({
  args: {
    anonSessionId: v.string(),
    windowMs: v.optional(v.number()), // Time window in ms (default 1 hour)
  },
  handler: async (ctx, { anonSessionId, windowMs = 3600000 }) => {
    const cutoff = Date.now() - windowMs;

    const queries = await ctx.db
      .query("queries")
      .withIndex("by_anon_createdAt", (q) => q.eq("anonSessionId", anonSessionId))
      .filter((q) => q.gte(q.field("createdAt"), cutoff))
      .collect();

    return queries.length;
  },
});
