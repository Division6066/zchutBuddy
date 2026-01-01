import type { Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

// ============================================
// DUMMY USER DEFINITIONS
// ============================================

interface DummyUserConfig {
  clerkId: string;
  email: string;
  name: string;
  subscriptionTier: "free_trial" | "plus" | "pro" | "max";
}

interface DummyProfileConfig {
  ageRange: string;
  city: string;
  hmo: string;
  employmentStatus: string;
  idfService: string; // "served" | "not_served" | "currently_serving"
  isIdfDisabled: boolean;
  disabilities: string[];
  relevantMinistries: string[];
  isAnonymous: boolean;
}

const DUMMY_USERS: DummyUserConfig[] = [
  {
    clerkId: "dummy_free_trial_user",
    email: "free.trial@zchuyotbuddy.test",
    name: "משתמש ניסיון",
    subscriptionTier: "free_trial",
  },
  {
    clerkId: "dummy_plus_user",
    email: "plus.user@zchuyotbuddy.test",
    name: "משתמש פלוס",
    subscriptionTier: "plus",
  },
  {
    clerkId: "dummy_pro_user",
    email: "pro.user@zchuyotbuddy.test",
    name: "משתמש פרו",
    subscriptionTier: "pro",
  },
  {
    clerkId: "dummy_max_user",
    email: "max.user@zchuyotbuddy.test",
    name: "משתמש מקס",
    subscriptionTier: "max",
  },
];

const DUMMY_PROFILES: Record<string, DummyProfileConfig> = {
  "free.trial@zchuyotbuddy.test": {
    ageRange: "25-34",
    city: "תל אביב",
    hmo: "clalit",
    employmentStatus: "employed",
    idfService: "served",
    isIdfDisabled: false,
    disabilities: [],
    relevantMinistries: ["ביטוח לאומי"],
    isAnonymous: false,
  },
  "plus.user@zchuyotbuddy.test": {
    ageRange: "35-44",
    city: "ירושלים",
    hmo: "maccabi",
    employmentStatus: "self_employed",
    idfService: "served",
    isIdfDisabled: false,
    disabilities: [],
    relevantMinistries: ["ביטוח לאומי", "משרד הבריאות"],
    isAnonymous: false,
  },
  "pro.user@zchuyotbuddy.test": {
    ageRange: "45-54",
    city: "חיפה",
    hmo: "meuhedet",
    employmentStatus: "employed",
    idfService: "served",
    isIdfDisabled: true,
    disabilities: [],
    relevantMinistries: ["ביטוח לאומי", "משרד הביטחון"],
    isAnonymous: false,
  },
  "max.user@zchuyotbuddy.test": {
    ageRange: "55-64",
    city: "באר שבע",
    hmo: "leumit",
    employmentStatus: "retired",
    idfService: "served",
    isIdfDisabled: true,
    disabilities: ["mobility"],
    relevantMinistries: ["ביטוח לאומי", "משרד הביטחון", "משרד הרווחה"],
    isAnonymous: false,
  },
};

// Pricing per tier in shekels
const TIER_PRICING: Record<string, number> = {
  free_trial: 0,
  plus: 29,
  pro: 49,
  max: 99,
};

// ============================================
// INTERNAL MUTATION
// ============================================

/**
 * Internal mutation to create dummy users for testing.
 * Idempotent - safe to run multiple times.
 *
 * Creates:
 * - 4 dummy users (free_trial, plus, pro, max)
 * - Corresponding subscriptions
 * - Corresponding userProfiles with sample data
 *
 * Returns a summary of what was created/updated.
 */
export const createDummyUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const trialEndsAt = now + 14 * 24 * 60 * 60 * 1000; // 14 days
    const summary = {
      usersCreated: [] as string[],
      usersUpdated: [] as string[],
      subscriptionsCreated: [] as string[],
      subscriptionsUpdated: [] as string[],
      profilesCreated: [] as string[],
      profilesSkipped: [] as string[],
    };

    for (const userConfig of DUMMY_USERS) {
      // Check if user already exists by email
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", userConfig.email))
        .unique();

      let userId: Id<"users">;

      if (existingUser) {
        // Update existing user
        await ctx.db.patch(existingUser._id, {
          clerkId: userConfig.clerkId,
          name: userConfig.name,
          lastLoginAt: now,
        });
        userId = existingUser._id;
        summary.usersUpdated.push(userConfig.email);
      } else {
        // Create new user
        userId = await ctx.db.insert("users", {
          clerkId: userConfig.clerkId,
          email: userConfig.email,
          name: userConfig.name,
          language: "he",
          createdAt: now,
          lastLoginAt: now,
          onboardingCompleted: true,
        });
        summary.usersCreated.push(userConfig.email);
      }

      // Check if subscription exists for this user
      const existingSubscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();

      if (existingSubscription) {
        // Update existing subscription
        await ctx.db.patch(existingSubscription._id, {
          tier: userConfig.subscriptionTier,
          status: userConfig.subscriptionTier === "free_trial" ? "trialing" : "active",
          priceInShekels: TIER_PRICING[userConfig.subscriptionTier] || 0,
          updatedAt: now,
        });
        summary.subscriptionsUpdated.push(userConfig.email);
      } else {
        // Create subscription
        await ctx.db.insert("subscriptions", {
          userId,
          tier: userConfig.subscriptionTier,
          status: userConfig.subscriptionTier === "free_trial" ? "trialing" : "active",
          trialStartedAt: userConfig.subscriptionTier === "free_trial" ? now : undefined,
          trialEndsAt: userConfig.subscriptionTier === "free_trial" ? trialEndsAt : undefined,
          priceInShekels: TIER_PRICING[userConfig.subscriptionTier] || 0,
          createdAt: now,
          updatedAt: now,
        });
        summary.subscriptionsCreated.push(userConfig.email);
      }

      // Check if userProfile exists for this user
      const existingProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();

      if (!existingProfile) {
        // Create userProfile
        const profileConfig = DUMMY_PROFILES[userConfig.email];
        if (profileConfig) {
          await ctx.db.insert("userProfiles", {
            userId,
            ageRange: profileConfig.ageRange,
            city: profileConfig.city,
            hmo: profileConfig.hmo,
            employmentStatus: profileConfig.employmentStatus,
            idfService: profileConfig.idfService,
            isIdfDisabled: profileConfig.isIdfDisabled,
            disabilities: profileConfig.disabilities,
            relevantMinistries: profileConfig.relevantMinistries,
            isAnonymous: profileConfig.isAnonymous,
            updatedAt: now,
          });
          summary.profilesCreated.push(userConfig.email);
        }
      } else {
        summary.profilesSkipped.push(userConfig.email);
      }
    }

    return {
      success: true,
      summary,
      message: `Created ${summary.usersCreated.length} users, updated ${summary.usersUpdated.length} users, created ${summary.subscriptionsCreated.length} subscriptions, created ${summary.profilesCreated.length} profiles.`,
    };
  },
});
