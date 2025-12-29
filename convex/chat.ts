import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
async function getOwnedSessionOrThrow(
  ctx: QueryCtx | MutationCtx,
  sessionId: Id<"chatSessions">
) {
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
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    const sessionId = await ctx.db.insert("chatSessions", {
      userId,
      title: "New Chat",
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
 * Updates the session's updatedAt timestamp.
 * Returns the new message ID.
 */
export const saveAssistantMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, content }) => {
    await getOwnedSessionOrThrow(ctx, sessionId);
    const now = Date.now();

    // Create assistant message
    const messageId = await ctx.db.insert("messages", {
      sessionId,
      role: "assistant",
      content,
      createdAt: now,
    });

    // Update session timestamp
    await ctx.db.patch(sessionId, { updatedAt: now });

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

// ============================================
// QUERIES
// ============================================

/**
 * Get all chat sessions for the current user.
 * Ordered by updatedAt descending (most recent first).
 */
export const getChatSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return sessions;
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
      .withIndex("by_session_createdAt", (q) => q.eq("sessionId", sessionId))
      .order("asc")
      .collect();

    return messages;
  },
});
