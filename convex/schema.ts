import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // CONVEX AUTH TABLES
  // ============================================
  ...authTables,

  // ============================================
  // USERS & AUTH
  // ============================================
  users: defineTable({
    // Convex Auth user fields (linked via authTables)
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    name: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),

    // App-specific fields
    language: v.optional(v.string()), // "he" | "en"
    createdAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
    onboardingCompleted: v.optional(v.boolean()),

    // Legacy fields for backwards compatibility
    clerkId: v.optional(v.string()), // Legacy - kept for existing data
    fullName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    role: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    subscriptionTier: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
  })
    // Required by Convex Auth (expects index named "email")
    .index("email", ["email"]),

  // ============================================
  // SUBSCRIPTIONS
  // ============================================
  subscriptions: defineTable({
    userId: v.id("users"),
    tier: v.string(), // "free_trial" | "plus" | "pro" | "max"
    status: v.string(), // "active" | "canceled" | "past_due" | "trialing"

    // Trial info
    trialStartedAt: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),

    // Billing
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    priceInShekels: v.number(), // Monthly price in ₪

    // Stripe/Payment IDs (for future)
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  // ============================================
  // USER PROFILES (Onboarding Data)
  // ============================================
  userProfiles: defineTable({
    userId: v.id("users"),

    // Basic Info
    ageRange: v.optional(v.string()), // "18-25" | "26-35" | etc.
    city: v.optional(v.string()),
    hmo: v.optional(v.string()), // "clalit" | "maccabi" | "meuhedet" | "leumit"

    // Life Situation
    employmentStatus: v.optional(v.string()), // "employed" | "unemployed" | "student" | "retired" | "self_employed"
    idfService: v.optional(v.string()), // "served" | "not_served" | "currently_serving" | "national_service"
    isIdfDisabled: v.optional(v.boolean()),
    isRecognizedIdfDisabled: v.optional(v.boolean()), // Officially recognized by Ministry of Defense

    // Additional life situation fields
    receivingDisabilityBenefit: v.optional(v.boolean()), // קצבת נכות מביטוח לאומי
    hasChildrenUnder18: v.optional(v.boolean()), // ילדים מתחת לגיל 18
    isRenting: v.optional(v.boolean()), // For arnona exemption eligibility

    // Disabilities (multi-select)
    disabilities: v.optional(v.array(v.string())), // ["mobility", "vision", "hearing", etc.]
    disabilitySeverity: v.optional(v.string()), // "mild" | "moderate" | "severe"
    disabilityPercentage: v.optional(v.number()), // 0-100 or null for "don't know"
    disabilityRecognizedBy: v.optional(v.string()), // "bituach_leumi" | "defense" | "health" | "other"

    // Privacy & Terms
    isAnonymous: v.boolean(),
    termsAcceptedAt: v.optional(v.number()), // When user accepted terms

    // Language preference
    preferredLanguage: v.optional(v.string()), // "he" | "en"

    // Ministry interactions (calculated)
    relevantMinistries: v.optional(v.array(v.string())), // ["defense", "bituach_leumi", "health", "local"]

    // Legacy fields for backwards compatibility
    isVeteran: v.optional(v.boolean()),
    ministries: v.optional(v.array(v.string())),

    updatedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  // ============================================
  // CHAT SYSTEM
  // ============================================
  chatSessions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),

    // Chat type
    type: v.string(), // "rights_finder" | "deep_research" | "general"

    // Model used
    modelId: v.optional(v.string()),

    // Token tracking
    totalTokensUsed: v.number(),
    estimatedCostShekels: v.number(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_type", ["type"]),

  messages: defineTable({
    sessionId: v.id("chatSessions"),
    role: v.string(), // "user" | "assistant" | "system"
    content: v.string(),

    // Token tracking per message
    tokensUsed: v.optional(v.number()),
    modelUsed: v.optional(v.string()),

    // For citations/sources
    sources: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          snippet: v.optional(v.string()),
        })
      )
    ),

    createdAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  // ============================================
  // USAGE TRACKING & CAPS
  // ============================================
  usageTracking: defineTable({
    userId: v.id("users"),

    // Current billing period
    periodStart: v.number(),
    periodEnd: v.number(),

    // API Usage (in shekels equivalent)
    apiCreditsUsed: v.number(), // Total cost of API calls
    apiCreditsLimit: v.number(), // Based on subscription tier

    // Crawling/Deep Research
    crawlCreditsUsed: v.number(),
    crawlCreditsLimit: v.number(),

    // Token counts
    totalTokensUsed: v.number(),

    // Cap status
    softCapReached: v.boolean(), // 40% threshold
    hardCapReached: v.boolean(), // 60% threshold

    // Alerts sent
    softCapAlertSent: v.boolean(),
    hardCapAlertSent: v.boolean(),

    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_period", ["periodStart", "periodEnd"]),

  // ============================================
  // MODEL CONFIGURATION
  // ============================================
  modelConfig: defineTable({
    modelId: v.string(), // "kimi-k2" | "deepseek-v3" | etc.
    displayName: v.string(),
    provider: v.string(), // "moonshot" | "deepseek" | "mistral" | "google"

    // Hierarchy (1 = highest/best, 5 = lowest/cheapest)
    tier: v.number(),

    // Pricing per 1M tokens (in USD, we'll convert to shekels)
    inputPricePerMillion: v.number(),
    outputPricePerMillion: v.number(),

    // Capabilities
    maxContextTokens: v.number(),
    supportsStreaming: v.boolean(),
    supportsVision: v.boolean(),

    // Which subscription tiers can use this model
    availableForTiers: v.array(v.string()),

    // Status
    isActive: v.boolean(),
    isDefault: v.boolean(),
  })
    .index("by_modelId", ["modelId"])
    .index("by_tier", ["tier"]),

  // ============================================
  // ALERTS & NOTIFICATIONS
  // ============================================
  alerts: defineTable({
    userId: v.id("users"),

    type: v.string(), // "usage_warning" | "rights_update" | "deadline" | "system"
    title: v.string(),
    message: v.string(),

    // Priority
    priority: v.string(), // "low" | "medium" | "high" | "urgent"

    // Status
    isRead: v.boolean(),
    isDismissed: v.boolean(),

    // Action link (optional)
    actionUrl: v.optional(v.string()),
    actionLabel: v.optional(v.string()),

    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_type", ["type"])
    .index("by_isRead", ["isRead"]),

  // ============================================
  // SAVED RIGHTS & ANSWERS
  // ============================================
  savedRights: defineTable({
    userId: v.id("users"),

    title: v.string(),
    summary: v.string(),
    fullContent: v.string(),

    // Categorization
    category: v.string(), // "disability" | "health" | "employment" | etc.
    tags: v.array(v.string()),

    // Source
    sourceUrl: v.optional(v.string()),
    sourceName: v.optional(v.string()),

    // From chat
    fromSessionId: v.optional(v.id("chatSessions")),

    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_category", ["category"]),

  // ============================================
  // CHECKLISTS
  // ============================================
  checklists: defineTable({
    userId: v.id("users"),

    title: v.string(),
    description: v.optional(v.string()),

    // Type
    type: v.string(), // "rights_application" | "documents" | "custom"

    // Related right (if applicable)
    relatedRightId: v.optional(v.id("savedRights")),

    // Progress
    totalItems: v.number(),
    completedItems: v.number(),

    // Deadline
    dueDate: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  checklistItems: defineTable({
    checklistId: v.id("checklists"),

    title: v.string(),
    description: v.optional(v.string()),

    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),

    // Order
    sortOrder: v.number(),

    createdAt: v.number(),
  }).index("by_checklistId", ["checklistId"]),
});
