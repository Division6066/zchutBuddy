import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * List all sources (admin only)
 */
export const listSources = query({
  args: {
    isActive: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { isActive, limit = 100 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if admin (for MVP, we'll allow authenticated users to list sources)
    // In production, add admin check here

    let query = ctx.db.query("sources");

    if (isActive !== undefined) {
      query = query.filter((q) => q.eq(q.field("isActive"), isActive));
    }

    const sources = await query.take(limit);
    return sources;
  },
});

/**
 * Create a new source (admin/worker only)
 */
export const createSource = mutation({
  args: {
    url: v.string(),
    agency: v.optional(v.string()),
    tags: v.array(v.string()),
    crawlFrequency: v.union(v.literal("daily"), v.literal("weekly")),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { url, agency, tags, crawlFrequency, isActive = true }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const now = Date.now();

    // Check if source URL already exists
    const existing = await ctx.db
      .query("sources")
      .withIndex("by_url", (q) => q.eq("url", url))
      .unique();

    if (existing) {
      throw new Error("Source URL already exists");
    }

    return await ctx.db.insert("sources", {
      url,
      agency,
      tags,
      crawlFrequency,
      isActive,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update a source (admin only)
 */
export const updateSource = mutation({
  args: {
    sourceId: v.id("sources"),
    agency: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    crawlFrequency: v.optional(v.union(v.literal("daily"), v.literal("weekly"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { sourceId, agency, tags, crawlFrequency, isActive }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const now = Date.now();

    const updateData: Record<string, unknown> = { updatedAt: now };
    if (agency !== undefined) updateData.agency = agency;
    if (tags !== undefined) updateData.tags = tags;
    if (crawlFrequency !== undefined) updateData.crawlFrequency = crawlFrequency;
    if (isActive !== undefined) updateData.isActive = isActive;

    await ctx.db.patch(sourceId, updateData);
    return sourceId;
  },
});

/**
 * Get sources that need crawling
 */
export const getSourcesToCrawl = query({
  args: {
    frequency: v.union(v.literal("daily"), v.literal("weekly")),
  },
  handler: async (ctx, { frequency }) => {
    return await ctx.db
      .query("sources")
      .withIndex("by_active_frequency", (q) =>
        q.eq("isActive", true).eq("crawlFrequency", frequency)
      )
      .collect();
  },
});

/**
 * Get a source by ID
 */
export const getById = query({
  args: { sourceId: v.id("sources") },
  handler: async (ctx, { sourceId }) => {
    return await ctx.db.get(sourceId);
  },
});
