import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
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
 * Get or create a user based on Clerk identity.
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      // Update last login
      await ctx.db.patch(existingUser._id, {
        lastLoginAt: Date.now(),
      });
      return existingUser;
    }

    // Get free trial configuration
    const trialConfig = SUBSCRIPTION_TIERS.free_trial;
    const now = Date.now();
    const trialEnd = now + trialConfig.trialDays * 24 * 60 * 60 * 1000;

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId,
      email: identity.email ?? "",
      name: identity.name ?? identity.nickname ?? undefined,
      imageUrl: identity.pictureUrl ?? undefined,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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

    const updateData: Record<string, unknown> = {};
    if (args.name !== undefined) updateData.name = args.name;
    if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;
    if (args.language !== undefined) updateData.language = args.language;
    if (args.onboardingCompleted !== undefined)
      updateData.onboardingCompleted = args.onboardingCompleted;

    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(user._id, updateData);
    }

    return await ctx.db.get(user._id);
  },
});

/**
 * Mark onboarding as completed and create completion alert
 */
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
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

    const now = Date.now();

    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
    });

    // Get user profile to calculate recommendations
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    // Create onboarding complete alert
    await ctx.db.insert("alerts", {
      userId: user._id,
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
        userId: user._id,
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

    return user._id;
  },
});

/**
 * Get user profile
 */
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
        await ctx.db.patch(user._id, {
          language: args.preferredLanguage,
        });
      }

      return profile._id;
    }

    // Create new profile
    return await ctx.db.insert("userProfiles", {
      userId: user._id,
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
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
        userId: user._id,
        ...profileData,
      });
    }

    // Update user's language preference
    if (args.preferredLanguage !== user.language) {
      await ctx.db.patch(user._id, {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return [];
    }

    const alertsQuery = ctx.db
      .query("alerts")
      .withIndex("by_userId", (q) => q.eq("userId", user._id));

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
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
