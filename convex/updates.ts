import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================
// SOURCE SNAPSHOTS (Crawl results)
// ============================================

/**
 * Create a new source snapshot (admin/worker only)
 */
export const createSnapshot = mutation({
  args: {
    sourceId: v.id("sources"),
    contentHash: v.string(),
    normalizedText: v.string(),
  },
  handler: async (ctx, { sourceId, contentHash, normalizedText }) => {
    // For MVP, we allow this without auth for worker processes
    // In production, use internal mutations or API keys

    const now = Date.now();

    return await ctx.db.insert("sourceSnapshots", {
      sourceId,
      fetchedAt: now,
      contentHash,
      normalizedText,
    });
  },
});

/**
 * Get the latest snapshot for a source
 */
export const getLatestSnapshot = query({
  args: { sourceId: v.id("sources") },
  handler: async (ctx, { sourceId }) => {
    const snapshots = await ctx.db
      .query("sourceSnapshots")
      .withIndex("by_source_fetchedAt", (q) => q.eq("sourceId", sourceId))
      .order("desc")
      .take(1);

    return snapshots[0] ?? null;
  },
});

/**
 * Get snapshot by ID
 */
export const getSnapshotById = query({
  args: { snapshotId: v.id("sourceSnapshots") },
  handler: async (ctx, { snapshotId }) => {
    return await ctx.db.get(snapshotId);
  },
});

// ============================================
// UPDATE ITEMS (Detected changes)
// ============================================

/**
 * Create a new update item (admin/worker only)
 */
export const createUpdateItem = mutation({
  args: {
    sourceId: v.id("sources"),
    prevSnapshotId: v.optional(v.id("sourceSnapshots")),
    newSnapshotId: v.id("sourceSnapshots"),
    diffSummary: v.string(),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    tags: v.array(v.string()),
  },
  handler: async (
    ctx,
    { sourceId, prevSnapshotId, newSnapshotId, diffSummary, severity, tags }
  ) => {
    const now = Date.now();

    return await ctx.db.insert("updateItems", {
      sourceId,
      prevSnapshotId,
      newSnapshotId,
      diffSummary,
      severity,
      tags,
      createdAt: now,
    });
  },
});

/**
 * List recent update items (public feed)
 */
export const listRecentUpdates = query({
  args: {
    limit: v.optional(v.number()),
    sinceDays: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50, sinceDays = 7 }) => {
    const cutoff = Date.now() - sinceDays * 24 * 60 * 60 * 1000;

    const updates = await ctx.db
      .query("updateItems")
      .withIndex("by_createdAt")
      .order("desc")
      .filter((q) => q.gte(q.field("createdAt"), cutoff))
      .take(limit);

    // Enrich with source info
    const enriched = await Promise.all(
      updates.map(async (update) => {
        const source = await ctx.db.get(update.sourceId);
        return { ...update, source };
      })
    );

    return enriched;
  },
});

/**
 * List updates feed for the current user (filtered by profile tags)
 */
export const listUpdatesFeedForUser = query({
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

    // Get the user's profile to get their tags
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    // Get recent updates
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000; // Last 30 days

    const allUpdates = await ctx.db
      .query("updateItems")
      .withIndex("by_createdAt")
      .order("desc")
      .filter((q) => q.gte(q.field("createdAt"), cutoff))
      .take(200); // Get more to filter

    // Filter by user's tags if they have a profile
    let filteredUpdates = allUpdates;
    if (profile && profile.tags.length > 0) {
      const userTags = new Set(profile.tags);
      const userTracks = new Set(profile.tracks);

      filteredUpdates = allUpdates.filter((update) => {
        // Match if any of the update's tags match user's tags or tracks
        return update.tags.some(
          (tag) => userTags.has(tag) || userTracks.has(tag as "nii" | "mod" | "moh")
        );
      });
    }

    // Take the requested limit
    const limitedUpdates = filteredUpdates.slice(0, limit);

    // Enrich with source info
    const enriched = await Promise.all(
      limitedUpdates.map(async (update) => {
        const source = await ctx.db.get(update.sourceId);
        return { ...update, source };
      })
    );

    return enriched;
  },
});

/**
 * Get update item by ID
 */
export const getUpdateById = query({
  args: { updateId: v.id("updateItems") },
  handler: async (ctx, { updateId }) => {
    const update = await ctx.db.get(updateId);
    if (!update) return null;

    const source = await ctx.db.get(update.sourceId);
    return { ...update, source };
  },
});
