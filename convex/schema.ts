import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // USERS (Clerk-authenticated identities)
  // ============================================
  users: defineTable({
    // Clerk subject (user) ID from ctx.auth.getUserIdentity().subject
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    subscriptionTier: v.union(
      v.literal("free_trial"),
      v.literal("plus"),
      v.literal("pro"),
      v.literal("max")
    ),
    createdAt: v.number(),
    // Optional fields for backwards compatibility with existing data
    fullName: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    language: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
    role: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // ============================================
  // CHAT MESSAGES (existing)
  // ============================================
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

  // ============================================
  // CHAT SESSIONS (Session-based conversations)
  // ============================================
  chatSessions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_updatedAt", ["userId", "updatedAt"]),

  // ============================================
  // MESSAGES (Individual messages within sessions)
  // ============================================
  messages: defineTable({
    sessionId: v.id("chatSessions"),
    role: v.string(), // "user" | "assistant"
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_session_createdAt", ["sessionId", "createdAt"]),

  // ============================================
  // PROFILES (ProfileLite for impact matching)
  // ============================================
  profiles: defineTable({
    userId: v.id("users"),
    region: v.optional(v.string()),
    city: v.optional(v.string()),
    tracks: v.array(v.union(v.literal("nii"), v.literal("mod"), v.literal("moh"))),
    tags: v.array(v.string()), // Topic tags for matching updates
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ============================================
  // USER PROFILES (Onboarding profile details)
  // ============================================
  userProfiles: defineTable({
    userId: v.id("users"),
    ageRange: v.optional(v.string()),
    city: v.optional(v.string()),
    hmo: v.optional(v.string()),
    employmentStatus: v.optional(v.string()),
    isVeteran: v.optional(v.boolean()),
    disabilities: v.optional(v.array(v.string())),
    ministries: v.optional(v.array(v.string())),
    isAnonymous: v.boolean(),
  }).index("by_user", ["userId"]),

  // ============================================
  // QUERIES (Rights Finder Q&A)
  // ============================================
  queries: defineTable({
    userId: v.optional(v.id("users")), // null/undefined for anonymous
    anonSessionId: v.optional(v.string()), // For rate limiting anonymous users
    input: v.string(), // The user's question
    createdAt: v.number(),
  })
    .index("by_user_createdAt", ["userId", "createdAt"])
    .index("by_anon_createdAt", ["anonSessionId", "createdAt"]),

  // ============================================
  // ANSWERS (Citation-backed responses)
  // ============================================
  answers: defineTable({
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
    confidence: v.number(), // 0-1 confidence score
    generatedAt: v.number(),
  }).index("by_query", ["queryId"]),

  // ============================================
  // CHECKLIST PLANS (Ordered action plans)
  // ============================================
  checklistPlans: defineTable({
    userId: v.id("users"),
    title: v.string(),
    fromAnswerId: v.optional(v.id("answers")),
    stepsJson: v.string(), // JSON string of steps array
    nextActionsJson: v.string(), // JSON string of next 1-3 actions
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_updatedAt", ["userId", "updatedAt"]),

  // ============================================
  // SOURCES (Updates Radar - curated sources)
  // ============================================
  sources: defineTable({
    url: v.string(),
    agency: v.optional(v.string()), // e.g. "nii", "mod", "moh"
    tags: v.array(v.string()),
    crawlFrequency: v.union(v.literal("daily"), v.literal("weekly")),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_url", ["url"])
    .index("by_active_frequency", ["isActive", "crawlFrequency"]),

  // ============================================
  // SOURCE SNAPSHOTS (Crawl results)
  // ============================================
  sourceSnapshots: defineTable({
    sourceId: v.id("sources"),
    fetchedAt: v.number(),
    contentHash: v.string(),
    normalizedText: v.string(), // MVP: store inline; later move to file storage
  }).index("by_source_fetchedAt", ["sourceId", "fetchedAt"]),

  // ============================================
  // UPDATE ITEMS (Detected changes)
  // ============================================
  updateItems: defineTable({
    sourceId: v.id("sources"),
    prevSnapshotId: v.optional(v.id("sourceSnapshots")),
    newSnapshotId: v.id("sourceSnapshots"),
    diffSummary: v.string(), // Human-readable summary of what changed
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    tags: v.array(v.string()), // For matching to user profiles
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_source_createdAt", ["sourceId", "createdAt"]),

  // ============================================
  // NOTIFICATION SETTINGS (User preferences)
  // ============================================
  notificationSettings: defineTable({
    userId: v.id("users"),
    emailEnabled: v.boolean(),
    digestFrequency: v.union(v.literal("weekly"), v.literal("daily")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ============================================
  // NOTIFICATION EVENTS (Sent/queued alerts)
  // ============================================
  notificationEvents: defineTable({
    userId: v.id("users"),
    updateItemId: v.id("updateItems"),
    channel: v.literal("email"), // MVP: email only
    status: v.union(v.literal("queued"), v.literal("sent"), v.literal("failed")),
    createdAt: v.number(),
    sentAt: v.optional(v.number()),
  })
    .index("by_user_createdAt", ["userId", "createdAt"])
    .index("by_updateItem", ["updateItemId"]),
});
