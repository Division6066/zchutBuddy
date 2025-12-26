import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save a chat message
export const saveMessage = mutation({
  args: {
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    answerHe: v.optional(v.string()),
    answerEn: v.optional(v.string()),
    mode: v.optional(v.union(v.literal("answer"), v.literal("clarify"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    await ctx.db.insert("chatMessages", {
      userId,
      role: args.role,
      content: args.content,
      answerHe: args.answerHe,
      answerEn: args.answerEn,
      mode: args.mode,
      timestamp: Date.now(),
    });
  },
});

// Get chat history for current user
export const getChatHistory = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;
    const limit = args.limit || 100;

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user_timestamp", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    // Return in chronological order (oldest first)
    return messages.reverse();
  },
});

// Clear chat history for current user
export const clearChatHistory = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Delete all messages
    await Promise.all(messages.map((msg) => ctx.db.delete(msg._id)));
  },
});
