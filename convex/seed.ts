import { mutation, internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// ============================================
// DUMMY USER DEFINITIONS (inline to avoid circular imports)
// ============================================

interface DummyUserConfig {
  clerkId: string;
  email: string;
  name: string;
  subscriptionTier: "free_trial" | "plus" | "pro" | "max";
  subscriptionStatus: "active" | "expired" | "cancelled";
  trialEndsAt?: number;
  onboardingCompleted: boolean;
}

interface DummyProfileConfig {
  ageRange: string;
  city: string;
  hmo: string;
  employmentStatus: string;
  isVeteran: boolean;
  disabilities: string[];
  ministries: string[];
  isAnonymous: boolean;
}

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

const DUMMY_USERS: DummyUserConfig[] = [
  {
    clerkId: "dummy_free_trial_user",
    email: "free.trial@zchuyotbuddy.test",
    name: "משתמש ניסיון",
    subscriptionTier: "free_trial",
    subscriptionStatus: "active",
    trialEndsAt: Date.now() + FOURTEEN_DAYS_MS,
    onboardingCompleted: true,
  },
  {
    clerkId: "dummy_plus_user",
    email: "plus.user@zchuyotbuddy.test",
    name: "משתמש פלוס",
    subscriptionTier: "plus",
    subscriptionStatus: "active",
    onboardingCompleted: true,
  },
  {
    clerkId: "dummy_pro_user",
    email: "pro.user@zchuyotbuddy.test",
    name: "משתמש פרו",
    subscriptionTier: "pro",
    subscriptionStatus: "active",
    onboardingCompleted: true,
  },
  {
    clerkId: "dummy_max_user",
    email: "max.user@zchuyotbuddy.test",
    name: "משתמש מקס",
    subscriptionTier: "max",
    subscriptionStatus: "active",
    onboardingCompleted: true,
  },
];

const DUMMY_PROFILES: Record<string, DummyProfileConfig> = {
  "free.trial@zchuyotbuddy.test": {
    ageRange: "25-34",
    city: "תל אביב",
    hmo: "כללית",
    employmentStatus: "employed",
    isVeteran: false,
    disabilities: [],
    ministries: ["ביטוח לאומי"],
    isAnonymous: false,
  },
  "plus.user@zchuyotbuddy.test": {
    ageRange: "35-44",
    city: "ירושלים",
    hmo: "מכבי",
    employmentStatus: "self_employed",
    isVeteran: false,
    disabilities: [],
    ministries: ["ביטוח לאומי", "משרד הבריאות"],
    isAnonymous: false,
  },
  "pro.user@zchuyotbuddy.test": {
    ageRange: "45-54",
    city: "חיפה",
    hmo: "מאוחדת",
    employmentStatus: "employed",
    isVeteran: true,
    disabilities: [],
    ministries: ["ביטוח לאומי", "משרד הביטחון"],
    isAnonymous: false,
  },
  "max.user@zchuyotbuddy.test": {
    ageRange: "55-64",
    city: "באר שבע",
    hmo: "לאומית",
    employmentStatus: "retired",
    isVeteran: true,
    disabilities: ["ניידות"],
    ministries: ["ביטוח לאומי", "משרד הביטחון", "משרד הרווחה"],
    isAnonymous: false,
  },
};

// ============================================
// SEED MUTATION RESULT TYPE
// ============================================

interface SeedResult {
  success: boolean;
  summary: {
    usersCreated: string[];
    usersUpdated: string[];
    profilesCreated: string[];
    profilesSkipped: string[];
  };
  message: string;
}

/**
 * Admin-only mutation to seed dummy accounts for testing.
 *
 * Creates 4 dummy users with different subscription tiers:
 * - free_trial (14-day trial)
 * - plus (active)
 * - pro (active)
 * - max (active)
 *
 * Also creates corresponding userProfiles with sample data.
 *
 * This mutation is idempotent - safe to run multiple times.
 * Existing users will be updated, not duplicated.
 *
 * @requires Admin role (users.role === "admin")
 */
export const seedDummyAccounts = mutation({
  args: {},
  handler: async (ctx): Promise<SeedResult> => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify caller is admin
    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Perform the seeding directly (avoid circular import issues)
    const now = Date.now();
    const summary = {
      usersCreated: [] as string[],
      usersUpdated: [] as string[],
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
          fullName: userConfig.name,
          subscriptionTier: userConfig.subscriptionTier,
          subscriptionStatus: userConfig.subscriptionStatus,
          trialEndsAt: userConfig.trialEndsAt,
          onboardingCompleted: userConfig.onboardingCompleted,
          updatedAt: now,
        });
        userId = existingUser._id;
        summary.usersUpdated.push(userConfig.email);
      } else {
        // Create new user
        userId = await ctx.db.insert("users", {
          clerkId: userConfig.clerkId,
          email: userConfig.email,
          name: userConfig.name,
          fullName: userConfig.name,
          role: "user",
          isActive: true,
          subscriptionTier: userConfig.subscriptionTier,
          subscriptionStatus: userConfig.subscriptionStatus,
          trialEndsAt: userConfig.trialEndsAt,
          onboardingCompleted: userConfig.onboardingCompleted,
          language: "he",
          createdAt: now,
          updatedAt: now,
        });
        summary.usersCreated.push(userConfig.email);
      }

      // Check if userProfile exists for this user
      const existingProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
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
            isVeteran: profileConfig.isVeteran,
            disabilities: profileConfig.disabilities,
            ministries: profileConfig.ministries,
            isAnonymous: profileConfig.isAnonymous,
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
      message: `Created ${summary.usersCreated.length} users, updated ${summary.usersUpdated.length} users, created ${summary.profilesCreated.length} profiles.`,
    };
  },
});

/**
 * Internal mutation for CLI seeding (no auth required).
 * Run with: npx convex run seed:seedDummyAccountsInternal
 *
 * This is safe because internal mutations can only be called from:
 * - Other Convex functions
 * - The Convex CLI (development)
 * - Scheduled functions
 *
 * They are NOT exposed to the public API.
 */
export const seedDummyAccountsInternal = internalMutation({
  args: {},
  handler: async (ctx): Promise<SeedResult> => {
    const now = Date.now();
    const summary = {
      usersCreated: [] as string[],
      usersUpdated: [] as string[],
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
          fullName: userConfig.name,
          subscriptionTier: userConfig.subscriptionTier,
          subscriptionStatus: userConfig.subscriptionStatus,
          trialEndsAt: userConfig.trialEndsAt,
          onboardingCompleted: userConfig.onboardingCompleted,
          updatedAt: now,
        });
        userId = existingUser._id;
        summary.usersUpdated.push(userConfig.email);
      } else {
        // Create new user
        userId = await ctx.db.insert("users", {
          clerkId: userConfig.clerkId,
          email: userConfig.email,
          name: userConfig.name,
          fullName: userConfig.name,
          role: "user",
          isActive: true,
          subscriptionTier: userConfig.subscriptionTier,
          subscriptionStatus: userConfig.subscriptionStatus,
          trialEndsAt: userConfig.trialEndsAt,
          onboardingCompleted: userConfig.onboardingCompleted,
          language: "he",
          createdAt: now,
          updatedAt: now,
        });
        summary.usersCreated.push(userConfig.email);
      }

      // Check if userProfile exists for this user
      const existingProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
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
            isVeteran: profileConfig.isVeteran,
            disabilities: profileConfig.disabilities,
            ministries: profileConfig.ministries,
            isAnonymous: profileConfig.isAnonymous,
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
      message: `Created ${summary.usersCreated.length} users, updated ${summary.usersUpdated.length} users, created ${summary.profilesCreated.length} profiles.`,
    };
  },
});

