import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";

// ============================================
// INTERNAL HELPER: Ownership verification
// ============================================

/**
 * Get the current user's ID from Clerk identity.
 * Throws if not authenticated or user not found.
 */
async function getCurrentUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
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

  return user._id;
}

/**
 * Verify that the current user owns the given session.
 * Returns the session if owned, throws otherwise.
 */
async function getOwnedSessionOrThrow(ctx: QueryCtx | MutationCtx, sessionId: Id<"chatSessions">) {
  const userId = await getCurrentUserId(ctx);

  const session = await ctx.db.get(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  if (session.userId !== userId) {
    throw new Error("Forbidden");
  }

  return session;
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new chat session for the current user.
 * Returns the new session ID.
 */
export const createChatSession = mutation({
  args: {
    type: v.optional(v.string()), // "rights_finder" | "deep_research" | "general"
    title: v.optional(v.string()),
    modelId: v.optional(v.string()),
  },
  handler: async (ctx, { type = "general", title, modelId }) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    const sessionId = await ctx.db.insert("chatSessions", {
      userId,
      title: title || "New Chat",
      type,
      modelId,
      totalTokensUsed: 0,
      estimatedCostShekels: 0,
      createdAt: now,
      updatedAt: now,
    });

    return sessionId;
  },
});

/**
 * Send a user message in a chat session.
 * Updates the session's updatedAt timestamp.
 * Returns the new message ID.
 */
export const sendMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, content }) => {
    await getOwnedSessionOrThrow(ctx, sessionId);
    const now = Date.now();

    // Create user message
    const messageId = await ctx.db.insert("messages", {
      sessionId,
      role: "user",
      content,
      createdAt: now,
    });

    // Update session timestamp
    await ctx.db.patch(sessionId, { updatedAt: now });

    return messageId;
  },
});

/**
 * Save an assistant message in a chat session.
 * Updates the session's updatedAt timestamp and token tracking.
 * Returns the new message ID.
 */
export const saveAssistantMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
    tokensUsed: v.optional(v.number()),
    modelUsed: v.optional(v.string()),
    sources: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          snippet: v.optional(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, { sessionId, content, tokensUsed, modelUsed, sources }) => {
    const session = await getOwnedSessionOrThrow(ctx, sessionId);
    const now = Date.now();

    // Create assistant message
    const messageId = await ctx.db.insert("messages", {
      sessionId,
      role: "assistant",
      content,
      tokensUsed,
      modelUsed,
      sources,
      createdAt: now,
    });

    // Update session timestamp and token tracking
    const updateData: Record<string, unknown> = { updatedAt: now };

    if (tokensUsed) {
      updateData.totalTokensUsed = session.totalTokensUsed + tokensUsed;

      // Calculate cost estimate (rough: $0.002 per 1K tokens, convert to shekels ~3.7)
      const costUSD = (tokensUsed / 1000) * 0.002;
      const costShekels = costUSD * 3.7;
      updateData.estimatedCostShekels = session.estimatedCostShekels + costShekels;
    }

    if (modelUsed && !session.modelId) {
      updateData.modelId = modelUsed;
    }

    await ctx.db.patch(sessionId, updateData);

    return messageId;
  },
});

/**
 * Save a system message in a chat session.
 */
export const saveSystemMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, content }) => {
    await getOwnedSessionOrThrow(ctx, sessionId);
    const now = Date.now();

    const messageId = await ctx.db.insert("messages", {
      sessionId,
      role: "system",
      content,
      createdAt: now,
    });

    return messageId;
  },
});

/**
 * Update the title of a chat session.
 */
export const updateSessionTitle = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    title: v.string(),
  },
  handler: async (ctx, { sessionId, title }) => {
    await getOwnedSessionOrThrow(ctx, sessionId);
    const now = Date.now();

    await ctx.db.patch(sessionId, {
      title,
      updatedAt: now,
    });

    return sessionId;
  },
});

/**
 * Update session description.
 */
export const updateSessionDescription = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    description: v.string(),
  },
  handler: async (ctx, { sessionId, description }) => {
    await getOwnedSessionOrThrow(ctx, sessionId);
    const now = Date.now();

    await ctx.db.patch(sessionId, {
      description,
      updatedAt: now,
    });

    return sessionId;
  },
});

/**
 * Delete a chat session and all its messages.
 */
export const deleteSession = mutation({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    await getOwnedSessionOrThrow(ctx, sessionId);

    // Delete all messages in the session
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the session
    await ctx.db.delete(sessionId);

    return sessionId;
  },
});

// ============================================
// QUERIES
// ============================================

/**
 * Get all chat sessions for the current user.
 * Ordered by updatedAt descending (most recent first).
 */
export const getChatSessions = query({
  args: {
    type: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { type, limit = 50 }) => {
    const userId = await getCurrentUserId(ctx);

    let sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Filter by type if specified
    if (type) {
      sessions = sessions.filter((s) => s.type === type);
    }

    return sessions.slice(0, limit);
  },
});

/**
 * Get a single chat session by ID.
 */
export const getSession = query({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    const session = await getOwnedSessionOrThrow(ctx, sessionId);
    return session;
  },
});

/**
 * Get all messages for a chat session.
 * Ordered by createdAt ascending (oldest first).
 */
export const getChatMessages = query({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    await getOwnedSessionOrThrow(ctx, sessionId);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .order("asc")
      .collect();

    return messages;
  },
});

/**
 * Get session statistics (total tokens, cost).
 */
export const getSessionStats = query({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    const session = await getOwnedSessionOrThrow(ctx, sessionId);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .collect();

    return {
      messageCount: messages.length,
      totalTokensUsed: session.totalTokensUsed,
      estimatedCostShekels: session.estimatedCostShekels,
      modelId: session.modelId,
      type: session.type,
    };
  },
});

/**
 * Get recent sessions with message previews.
 */
export const getRecentSessionsWithPreview = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 10 }) => {
    const userId = await getCurrentUserId(ctx);

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    // Get first message preview for each session
    const sessionsWithPreview = await Promise.all(
      sessions.map(async (session) => {
        const firstMessage = await ctx.db
          .query("messages")
          .withIndex("by_sessionId", (q) => q.eq("sessionId", session._id))
          .order("asc")
          .first();

        return {
          ...session,
          preview: firstMessage?.content.slice(0, 100) || "",
        };
      })
    );

    return sessionsWithPreview;
  },
});
