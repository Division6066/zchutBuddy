import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Save an answer for a query
 */
export const saveAnswer = mutation({
  args: {
    queryId: v.id("queries"),
    structuredJson: v.string(), // JSON string of structured answer
    citations: v.array(
      v.object({
        url: v.string(),
        title: v.optional(v.string()),
        lastCheckedAt: v.optional(v.number()),
        excerpt: v.optional(v.string()),
      })
    ),
    confidence: v.number(),
  },
  handler: async (ctx, { queryId, structuredJson, citations, confidence }) => {
    const now = Date.now();

    // Verify the query exists
    const queryRecord = await ctx.db.get(queryId);
    if (!queryRecord) {
      throw new Error("Query not found");
    }

    // Create the answer
    return await ctx.db.insert("answers", {
      queryId,
      structuredJson,
      citations,
      confidence,
      generatedAt: now,
    });
  },
});

/**
 * Get answer by query ID
 */
export const getByQueryId = query({
  args: { queryId: v.id("queries") },
  handler: async (ctx, { queryId }) => {
    return await ctx.db
      .query("answers")
      .withIndex("by_query", (q) => q.eq("queryId", queryId))
      .unique();
  },
});

/**
 * Get answer by ID
 */
export const getById = query({
  args: { answerId: v.id("answers") },
  handler: async (ctx, { answerId }) => {
    return await ctx.db.get(answerId);
  },
});

/**
 * List answers for current user's queries
 */
export const listMyAnswers = query({
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

    // Get user's queries
    const queries = await ctx.db
      .query("queries")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    // Get answers for those queries
    const answers = await Promise.all(
      queries.map(async (queryRecord) => {
        const answer = await ctx.db
          .query("answers")
          .withIndex("by_query", (q) => q.eq("queryId", queryRecord._id))
          .unique();
        return answer ? { query: queryRecord, answer } : null;
      })
    );

    return answers.filter(Boolean);
  },
});

