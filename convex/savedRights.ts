import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";

// ============================================
// INTERNAL HELPERS
// ============================================

async function getCurrentUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}

async function getOwnedRightOrThrow(ctx: QueryCtx | MutationCtx, rightId: Id<"savedRights">) {
  const userId = await getCurrentUserId(ctx);

  const right = await ctx.db.get(rightId);
  if (!right) {
    throw new Error("Saved right not found");
  }

  if (right.userId !== userId) {
    throw new Error("Forbidden");
  }

  return right;
}

// ============================================
// VALIDATORS
// ============================================

export const categoryValidator = v.union(
  v.literal("disability"),
  v.literal("health"),
  v.literal("employment"),
  v.literal("housing"),
  v.literal("education"),
  v.literal("social"),
  v.literal("military"),
  v.literal("other")
);

// ============================================
// QUERIES
// ============================================

/**
 * Get all saved rights for the current user.
 */
export const getMySavedRights = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { category, limit = 50 }) => {
    const userId = await getCurrentUserId(ctx);

    let rights = await ctx.db
      .query("savedRights")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    if (category) {
      rights = rights.filter((r) => r.category === category);
    }

    return rights.slice(0, limit);
  },
});

/**
 * Get a saved right by ID.
 */
export const getById = query({
  args: {
    rightId: v.id("savedRights"),
  },
  handler: async (ctx, { rightId }) => {
    return await getOwnedRightOrThrow(ctx, rightId);
  },
});

/**
 * Get saved rights by category.
 */
export const getByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { category, limit = 50 }) => {
    const userId = await getCurrentUserId(ctx);

    const rights = await ctx.db
      .query("savedRights")
      .withIndex("by_category", (q) => q.eq("category", category))
      .order("desc")
      .collect();

    // Filter to only user's rights
    const userRights = rights.filter((r) => r.userId === userId);

    return userRights.slice(0, limit);
  },
});

/**
 * Search saved rights by tag.
 */
export const searchByTag = query({
  args: {
    tag: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { tag, limit = 50 }) => {
    const userId = await getCurrentUserId(ctx);

    const rights = await ctx.db
      .query("savedRights")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const matchingRights = rights.filter((r) =>
      r.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
    );

    return matchingRights.slice(0, limit);
  },
});

/**
 * Search saved rights by text (title/summary).
 */
export const searchByText = query({
  args: {
    searchText: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { searchText, limit = 50 }) => {
    const userId = await getCurrentUserId(ctx);

    const rights = await ctx.db
      .query("savedRights")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const searchLower = searchText.toLowerCase();

    const matchingRights = rights.filter(
      (r) =>
        r.title.toLowerCase().includes(searchLower) || r.summary.toLowerCase().includes(searchLower)
    );

    return matchingRights.slice(0, limit);
  },
});

/**
 * Get all unique categories used by the current user.
 */
export const getMyCategories = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const rights = await ctx.db
      .query("savedRights")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const categories = [...new Set(rights.map((r) => r.category))];
    return categories;
  },
});

/**
 * Get all unique tags used by the current user.
 */
export const getMyTags = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const rights = await ctx.db
      .query("savedRights")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const allTags = rights.flatMap((r) => r.tags);
    const uniqueTags = [...new Set(allTags)];

    return uniqueTags.sort();
  },
});

/**
 * Get count of saved rights per category.
 */
export const getCategoryCounts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const rights = await ctx.db
      .query("savedRights")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const counts: Record<string, number> = {};

    for (const right of rights) {
      counts[right.category] = (counts[right.category] || 0) + 1;
    }

    return counts;
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Save a new right.
 */
export const saveRight = mutation({
  args: {
    title: v.string(),
    summary: v.string(),
    fullContent: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    sourceUrl: v.optional(v.string()),
    sourceName: v.optional(v.string()),
    fromSessionId: v.optional(v.id("chatSessions")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    return await ctx.db.insert("savedRights", {
      userId,
      title: args.title,
      summary: args.summary,
      fullContent: args.fullContent,
      category: args.category,
      tags: args.tags,
      sourceUrl: args.sourceUrl,
      sourceName: args.sourceName,
      fromSessionId: args.fromSessionId,
      createdAt: now,
    });
  },
});

/**
 * Update a saved right.
 */
export const updateRight = mutation({
  args: {
    rightId: v.id("savedRights"),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    fullContent: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    sourceUrl: v.optional(v.string()),
    sourceName: v.optional(v.string()),
  },
  handler: async (ctx, { rightId, ...updates }) => {
    await getOwnedRightOrThrow(ctx, rightId);

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(rightId, updateData);
    }

    return rightId;
  },
});

/**
 * Add tags to a saved right.
 */
export const addTags = mutation({
  args: {
    rightId: v.id("savedRights"),
    tags: v.array(v.string()),
  },
  handler: async (ctx, { rightId, tags }) => {
    const right = await getOwnedRightOrThrow(ctx, rightId);

    // Merge tags, avoiding duplicates
    const existingTags = new Set(right.tags);
    for (const tag of tags) {
      existingTags.add(tag);
    }

    await ctx.db.patch(rightId, {
      tags: [...existingTags],
    });

    return rightId;
  },
});

/**
 * Remove tags from a saved right.
 */
export const removeTags = mutation({
  args: {
    rightId: v.id("savedRights"),
    tags: v.array(v.string()),
  },
  handler: async (ctx, { rightId, tags }) => {
    const right = await getOwnedRightOrThrow(ctx, rightId);

    const tagsToRemove = new Set(tags);
    const updatedTags = right.tags.filter((t) => !tagsToRemove.has(t));

    await ctx.db.patch(rightId, {
      tags: updatedTags,
    });

    return rightId;
  },
});

/**
 * Delete a saved right.
 */
export const deleteRight = mutation({
  args: {
    rightId: v.id("savedRights"),
  },
  handler: async (ctx, { rightId }) => {
    await getOwnedRightOrThrow(ctx, rightId);

    await ctx.db.delete(rightId);

    return rightId;
  },
});

/**
 * Save a right from a chat session.
 */
export const saveFromChat = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    messageContent: v.string(),
    title: v.string(),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { sessionId, messageContent, title, category, tags = [] }) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    // Verify user owns the session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found");
    }

    // Extract summary (first 200 chars)
    const summary =
      messageContent.length > 200 ? `${messageContent.slice(0, 200)}...` : messageContent;

    return await ctx.db.insert("savedRights", {
      userId,
      title,
      summary,
      fullContent: messageContent,
      category,
      tags,
      fromSessionId: sessionId,
      createdAt: now,
    });
  },
});

/**
 * Duplicate a saved right.
 */
export const duplicateRight = mutation({
  args: {
    rightId: v.id("savedRights"),
  },
  handler: async (ctx, { rightId }) => {
    const right = await getOwnedRightOrThrow(ctx, rightId);
    const now = Date.now();

    return await ctx.db.insert("savedRights", {
      userId: right.userId,
      title: `${right.title} (העתק)`,
      summary: right.summary,
      fullContent: right.fullContent,
      category: right.category,
      tags: right.tags,
      sourceUrl: right.sourceUrl,
      sourceName: right.sourceName,
      fromSessionId: right.fromSessionId,
      createdAt: now,
    });
  },
});
