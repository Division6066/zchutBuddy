import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  chatMessages: defineTable({
    userId: v.string(), // Clerk user ID
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    answerHe: v.optional(v.string()), // Hebrew answer if assistant message
    answerEn: v.optional(v.string()), // English answer if assistant message
    mode: v.optional(v.union(v.literal("answer"), v.literal("clarify"))),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_timestamp", ["userId", "timestamp"]),
});
