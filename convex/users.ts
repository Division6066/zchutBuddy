import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "./lib/subscriptionConfig";

/**
 * Calculate relevant ministries based on user profile
 * This helps prioritize which government bodies the user should interact with
 */
function calculateRelevantMinistries(profile: {
  isIdfDisabled?: boolean;
  isRecognizedIdfDisabled?: boolean;
  receivingDisabilityBenefit?: boolean;
  disabilities?: string[];
  city?: string;
}): string[] {
  const ministries: Set<string> = new Set();

  // Always include local municipality
  if (profile.city) {
    ministries.add("local");
  }

  // Ministry of Defense - for IDF disabled
  if (profile.isIdfDisabled || profile.isRecognizedIdfDisabled) {
    ministries.add("defense");
  }

  // Bituach Leumi (National Insurance) - for disability benefits
  if (profile.receivingDisabilityBenefit) {
    ministries.add("bituach_leumi");
  }

  // Ministry of Health - for chronic illness or medical conditions
  if (profile.disabilities?.some((d) => ["chronic", "mental", "vision", "hearing"].includes(d))) {
    ministries.add("health");
  }

  // Ministry of Welfare - for disabilities
  if (profile.disabilities && profile.disabilities.length > 0) {
    ministries.add("welfare");
  }

  // Ministry of Labor - if unemployed or receiving disability
  if (profile.receivingDisabilityBenefit) {
    ministries.add("labor");
  }

  return Array.from(ministries);
}

/**
 * Get the current authenticated user
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});

/**
 * Get a user by their ID
 */
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

/**
 * Get or create a user based on Convex Auth identity.
 * Creates a new user with default values if not found.
 * Also creates:
 * - Default subscription (free trial)
 * - Usage tracking initialized with tier limits
 * - Empty user profile
 * - Welcome alert
 */
export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the user record (Convex Auth creates this)
    const existingUser = await ctx.db.get(userId);

    if (existingUser) {
      // Update last login
      await ctx.db.patch(existingUser._id, {
        lastLoginAt: Date.now(),
      });
      return existingUser;
    }

    // This shouldn't happen with Convex Auth as it creates the user,
    // but we handle it just in case
    throw new Error("User not found after authentication");
  },
});

/**
 * Internal mutation to initialize a new user.
 * Called from the Convex Auth afterUserCreatedOrUpdated callback.
 * This is idempotent - safe to call multiple times.
 */
export const initializeNewUserInternal = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      console.error(`[initializeNewUserInternal] User ${userId} not found`);
      return { status: "user_not_found" };
    }

    // Check if already initialized (has subscription) - idempotent check
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingSubscription) {
      console.log(`[initializeNewUserInternal] User ${userId} already initialized, updating lastLoginAt`);
      await ctx.db.patch(userId, {
        lastLoginAt: Date.now(),
      });
      return { status: "already_initialized" };
    }

    console.log(`[initializeNewUserInternal] Initializing new user ${userId}`);

    // Get free trial configuration
    const trialConfig = SUBSCRIPTION_TIERS.free_trial;
    const now = Date.now();
    const trialEnd = now + trialConfig.trialDays * 24 * 60 * 60 * 1000;

    // Update user with app-specific fields
    await ctx.db.patch(userId, {
      language: "he", // Default to Hebrew
      createdAt: now,
      lastLoginAt: now,
      onboardingCompleted: false,
    });

    // Create free trial subscription
    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId,
      tier: "free_trial",
      status: "trialing",
      trialStartedAt: now,
      trialEndsAt: trialEnd,
      priceInShekels: trialConfig.priceShekels,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize usage tracking with tier limits
    const usageId = await ctx.db.insert("usageTracking", {
      userId,
      periodStart: now,
      periodEnd: trialEnd,
      apiCreditsUsed: 0,
      apiCreditsLimit: trialConfig.apiBudget,
      crawlCreditsUsed: 0,
      crawlCreditsLimit: trialConfig.limits.deepResearchPerMonth,
      totalTokensUsed: 0,
      softCapReached: false,
      hardCapReached: false,
      softCapAlertSent: false,
      hardCapAlertSent: false,
      updatedAt: now,
    });

    // Create empty user profile
    const profileId = await ctx.db.insert("userProfiles", {
      userId,
      isAnonymous: false,
      updatedAt: now,
    });

    // Create welcome alert for new users
    const alertId = await ctx.db.insert("alerts", {
      userId,
      type: "system",
      title: "ברוכים הבאים לזכויות באדי!",
      message: "נעזור לך למצוא את כל הזכויות שמגיעות לך. התחל על ידי מילוי הפרופיל שלך.",
      priority: "medium",
      isRead: false,
      isDismissed: false,
      actionUrl: "/onboarding/welcome",
      actionLabel: "התחל עכשיו",
      createdAt: now,
    });

    console.log(`[initializeNewUserInternal] Created subscription=${subscriptionId}, usage=${usageId}, profile=${profileId}, alert=${alertId} for user ${userId}`);

    return {
      status: "initialized",
      subscriptionId,
      usageId,
      profileId,
      alertId,
    };
  },
});

/**
 * Initialize a new user after first sign-in (public mutation).
 * Called from client after authentication to set up subscription, usage tracking, etc.
 * This is a wrapper around initializeNewUserInternal for client calls.
 */
export const initializeNewUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if already initialized (has subscription)
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingSubscription) {
      // Already initialized, just update last login
      await ctx.db.patch(userId, {
        lastLoginAt: Date.now(),
      });
      return user;
    }

    // Get free trial configuration
    const trialConfig = SUBSCRIPTION_TIERS.free_trial;
    const now = Date.now();
    const trialEnd = now + trialConfig.trialDays * 24 * 60 * 60 * 1000;

    // Update user with app-specific fields
    await ctx.db.patch(userId, {
      language: "he", // Default to Hebrew
      createdAt: now,
      lastLoginAt: now,
      onboardingCompleted: false,
    });

    // Create free trial subscription
    await ctx.db.insert("subscriptions", {
      userId,
      tier: "free_trial",
      status: "trialing",
      trialStartedAt: now,
      trialEndsAt: trialEnd,
      priceInShekels: trialConfig.priceShekels,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize usage tracking with tier limits
    await ctx.db.insert("usageTracking", {
      userId,
      periodStart: now,
      periodEnd: trialEnd,
      apiCreditsUsed: 0,
      apiCreditsLimit: trialConfig.apiBudget,
      crawlCreditsUsed: 0,
      crawlCreditsLimit: trialConfig.limits.deepResearchPerMonth,
      totalTokensUsed: 0,
      softCapReached: false,
      hardCapReached: false,
      softCapAlertSent: false,
      hardCapAlertSent: false,
      updatedAt: now,
    });

    // Create empty user profile
    await ctx.db.insert("userProfiles", {
      userId,
      isAnonymous: false,
      updatedAt: now,
    });

    // Create welcome alert for new users
    await ctx.db.insert("alerts", {
      userId,
      type: "system",
      title: "ברוכים הבאים לזכויות באדי!",
      message: "נעזור לך למצוא את כל הזכויות שמגיעות לך. התחל על ידי מילוי הפרופיל שלך.",
      priority: "medium",
      isRead: false,
      isDismissed: false,
      actionUrl: "/onboarding/welcome",
      actionLabel: "התחל עכשיו",
      createdAt: now,
    });

    return await ctx.db.get(userId);
  },
});

/**
 * Get user subscription with tier details
 */
export const getUserSubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!subscription) {
      return null;
    }

    // Get tier config
    const tierConfig = SUBSCRIPTION_TIERS[subscription.tier as SubscriptionTier];

    return {
      ...subscription,
      tierConfig,
    };
  },
});

/**
 * Get user usage tracking
 */
export const getUserUsage = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

/**
 * Update user profile information
 */
export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    language: v.optional(v.string()),
    onboardingCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updateData: Record<string, unknown> = {};
    if (args.name !== undefined) {
      updateData.name = args.name;
    }
    if (args.imageUrl !== undefined) {
      updateData.imageUrl = args.imageUrl;
    }
    if (args.language !== undefined) {
      updateData.language = args.language;
    }
    if (args.onboardingCompleted !== undefined) {
      updateData.onboardingCompleted = args.onboardingCompleted;
    }

    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(userId, updateData);
    }

    return await ctx.db.get(userId);
  },
});

/**
 * Mark onboarding as completed and create completion alert
 */
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();

    await ctx.db.patch(userId, {
      onboardingCompleted: true,
    });

    // Get user profile to calculate recommendations
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    // Create onboarding complete alert
    await ctx.db.insert("alerts", {
      userId,
      type: "system",
      title: "הפרופיל שלך מוכן!",
      message: "אנחנו מחפשים זכויות שמתאימות לפרופיל שלך. בינתיים, נסה את מנוע החיפוש שלנו.",
      priority: "low",
      isRead: false,
      isDismissed: false,
      actionUrl: "/rights-finder",
      actionLabel: "חפש זכויות",
      createdAt: now,
    });

    // If user has disabilities or special conditions, create a targeted alert
    if (profile?.disabilities && profile.disabilities.length > 0) {
      await ctx.db.insert("alerts", {
        userId,
        type: "rights_update",
        title: "מצאנו זכויות פוטנציאליות",
        message: `על סמך הפרופיל שלך, ייתכן שאתה זכאי לזכויות נוספות. לחץ לפרטים.`,
        priority: "high",
        isRead: false,
        isDismissed: false,
        actionUrl: "/rights-finder",
        actionLabel: "לצפייה בזכויות",
        createdAt: now,
      });
    }

    return userId;
  },
});

/**
 * Get user profile
 */
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

/**
 * Update user profile (onboarding data)
 * Supports all profile fields including new ones
 */
export const updateUserProfile = mutation({
  args: {
    // Basic Info
    ageRange: v.optional(v.string()),
    city: v.optional(v.string()),
    hmo: v.optional(v.string()),

    // Life Situation
    employmentStatus: v.optional(v.string()),
    idfService: v.optional(v.string()),
    isIdfDisabled: v.optional(v.boolean()),
    isRecognizedIdfDisabled: v.optional(v.boolean()),

    // Additional life situation
    receivingDisabilityBenefit: v.optional(v.boolean()),
    hasChildrenUnder18: v.optional(v.boolean()),
    isRenting: v.optional(v.boolean()),

    // Disabilities
    disabilities: v.optional(v.array(v.string())),
    disabilitySeverity: v.optional(v.string()),
    disabilityPercentage: v.optional(v.number()),
    disabilityRecognizedBy: v.optional(v.string()),

    // Privacy & Terms
    isAnonymous: v.optional(v.boolean()),
    termsAcceptedAt: v.optional(v.number()),

    // Language
    preferredLanguage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();

    // Calculate relevant ministries based on profile data
    const relevantMinistries = calculateRelevantMinistries({
      isIdfDisabled: args.isIdfDisabled ?? profile?.isIdfDisabled,
      isRecognizedIdfDisabled: args.isRecognizedIdfDisabled ?? profile?.isRecognizedIdfDisabled,
      receivingDisabilityBenefit:
        args.receivingDisabilityBenefit ?? profile?.receivingDisabilityBenefit,
      disabilities: args.disabilities ?? profile?.disabilities,
      city: args.city ?? profile?.city,
    });

    if (profile) {
      // Update existing profile
      const updateData: Record<string, unknown> = {
        updatedAt: now,
        relevantMinistries,
      };

      // Add all provided fields to update data
      for (const [key, value] of Object.entries(args)) {
        if (value !== undefined) {
          updateData[key] = value;
        }
      }

      await ctx.db.patch(profile._id, updateData);

      // Also update user's language preference if changed
      if (args.preferredLanguage && args.preferredLanguage !== user.language) {
        await ctx.db.patch(userId, {
          language: args.preferredLanguage,
        });
      }

      return profile._id;
    }

    // Create new profile
    return await ctx.db.insert("userProfiles", {
      userId,
      ...args,
      relevantMinistries,
      isAnonymous: args.isAnonymous ?? false,
      updatedAt: now,
    });
  },
});

/**
 * Save complete user profile in one mutation
 * Used at the end of onboarding to save all data at once
 */
export const saveUserProfile = mutation({
  args: {
    // Basic Info
    ageRange: v.string(),
    city: v.string(),
    hmo: v.string(),

    // Life Situation
    employmentStatus: v.string(),
    idfService: v.string(),
    isIdfDisabled: v.optional(v.boolean()),
    isRecognizedIdfDisabled: v.optional(v.boolean()),
    receivingDisabilityBenefit: v.optional(v.boolean()),
    hasChildrenUnder18: v.optional(v.boolean()),
    isRenting: v.optional(v.boolean()),

    // Disabilities
    disabilities: v.optional(v.array(v.string())),
    disabilitySeverity: v.optional(v.string()),
    disabilityPercentage: v.optional(v.number()),
    disabilityRecognizedBy: v.optional(v.string()),

    // Privacy
    isAnonymous: v.boolean(),
    termsAcceptedAt: v.number(),
    preferredLanguage: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();

    // Calculate relevant ministries
    const relevantMinistries = calculateRelevantMinistries({
      isIdfDisabled: args.isIdfDisabled,
      isRecognizedIdfDisabled: args.isRecognizedIdfDisabled,
      receivingDisabilityBenefit: args.receivingDisabilityBenefit,
      disabilities: args.disabilities,
      city: args.city,
    });

    // Get existing profile
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const profileData = {
      ageRange: args.ageRange,
      city: args.city,
      hmo: args.hmo,
      employmentStatus: args.employmentStatus,
      idfService: args.idfService,
      isIdfDisabled: args.isIdfDisabled,
      isRecognizedIdfDisabled: args.isRecognizedIdfDisabled,
      receivingDisabilityBenefit: args.receivingDisabilityBenefit,
      hasChildrenUnder18: args.hasChildrenUnder18,
      isRenting: args.isRenting,
      disabilities: args.disabilities,
      disabilitySeverity: args.disabilitySeverity,
      disabilityPercentage: args.disabilityPercentage,
      disabilityRecognizedBy: args.disabilityRecognizedBy,
      isAnonymous: args.isAnonymous,
      termsAcceptedAt: args.termsAcceptedAt,
      preferredLanguage: args.preferredLanguage,
      relevantMinistries,
      updatedAt: now,
    };

    let profileId;
    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, profileData);
      profileId = existingProfile._id;
    } else {
      profileId = await ctx.db.insert("userProfiles", {
        userId,
        ...profileData,
      });
    }

    // Update user's language preference
    if (args.preferredLanguage !== user.language) {
      await ctx.db.patch(userId, {
        language: args.preferredLanguage,
      });
    }

    return profileId;
  },
});

/**
 * Get user alerts
 */
export const getUserAlerts = query({
  args: {
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const alertsQuery = ctx.db
      .query("alerts")
      .withIndex("by_userId", (q) => q.eq("userId", userId));

    const alerts = await alertsQuery.collect();

    if (args.unreadOnly) {
      return alerts.filter((a) => !a.isRead && !a.isDismissed);
    }

    return alerts.filter((a) => !a.isDismissed);
  },
});

/**
 * Mark an alert as read
 */
export const markAlertRead = mutation({
  args: {
    alertId: v.id("alerts"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const alert = await ctx.db.get(args.alertId);
    if (!alert) {
      throw new Error("Alert not found");
    }

    await ctx.db.patch(args.alertId, {
      isRead: true,
    });
  },
});

/**
 * Dismiss an alert
 */
export const dismissAlert = mutation({
  args: {
    alertId: v.id("alerts"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const alert = await ctx.db.get(args.alertId);
    if (!alert) {
      throw new Error("Alert not found");
    }

    await ctx.db.patch(args.alertId, {
      isDismissed: true,
    });
  },
});
