import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Simple admin email check - replace with proper RBAC later
const ADMIN_EMAILS = ["levidavidspublic@proton.me"];

// ============================================
// VALIDATORS
// ============================================

const subscriptionTierValidator = v.union(
  v.literal("free_trial"),
  v.literal("plus"),
  v.literal("pro"),
  v.literal("max")
);

const subscriptionStatusValidator = v.union(
  v.literal("active"),
  v.literal("canceled"),
  v.literal("past_due"),
  v.literal("trialing")
);

// ============================================
// QUERIES
// ============================================

/**
 * List all users (admin only).
 */
export const listAllUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 100 }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const adminUser = await ctx.db.get(userId);
    if (!adminUser || !adminUser.email || !ADMIN_EMAILS.includes(adminUser.email)) {
      throw new Error("Admin access required");
    }

    const users = await ctx.db.query("users").order("desc").take(limit);

    // Get subscriptions for each user
    const usersWithSubscriptions = await Promise.all(
      users.map(async (user) => {
        const subscription = await ctx.db
          .query("subscriptions")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .unique();

        return {
          ...user,
          subscription,
        };
      })
    );

    return usersWithSubscriptions;
  },
});

/**
 * Get user details by email (admin only).
 */
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const adminUser = await ctx.db.get(userId);
    if (!adminUser || !adminUser.email || !ADMIN_EMAILS.includes(adminUser.email)) {
      throw new Error("Admin access required");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!targetUser) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .unique();

    const usageTracking = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .unique();

    return {
      ...targetUser,
      subscription,
      usageTracking,
    };
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Set subscription tier for a user by email (admin only).
 */
export const adminSetSubscriptionByEmail = mutation({
  args: {
    email: v.string(),
    tier: subscriptionTierValidator,
    status: v.optional(subscriptionStatusValidator),
  },
  handler: async (ctx, { email, tier, status }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const adminUser = await ctx.db.get(userId);
    if (!adminUser || !adminUser.email || !ADMIN_EMAILS.includes(adminUser.email)) {
      throw new Error("Admin access required");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!targetUser) {
      throw new Error("User not found");
    }

    const now = Date.now();

    // Check if subscription exists
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .unique();

    // Pricing per tier in shekels
    const tierPricing: Record<string, number> = {
      free_trial: 0,
      plus: 29,
      pro: 49,
      max: 99,
    };

    if (subscription) {
      // Update existing subscription
      await ctx.db.patch(subscription._id, {
        tier,
        status: status || "active",
        priceInShekels: tierPricing[tier] || 0,
        currentPeriodStart: now,
        currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000,
        updatedAt: now,
      });
    } else {
      // Create new subscription
      await ctx.db.insert("subscriptions", {
        userId: targetUser._id,
        tier,
        status: status || "active",
        priceInShekels: tierPricing[tier] || 0,
        currentPeriodStart: now,
        currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000,
        createdAt: now,
        updatedAt: now,
      });
    }

    return targetUser._id;
  },
});

/**
 * Reset usage for a user (admin only).
 */
export const adminResetUsage = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const adminUser = await ctx.db.get(userId);
    if (!adminUser || !adminUser.email || !ADMIN_EMAILS.includes(adminUser.email)) {
      throw new Error("Admin access required");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!targetUser) {
      throw new Error("User not found");
    }

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .unique();

    if (usage) {
      const now = Date.now();
      await ctx.db.patch(usage._id, {
        apiCreditsUsed: 0,
        crawlCreditsUsed: 0,
        totalTokensUsed: 0,
        softCapReached: false,
        hardCapReached: false,
        softCapAlertSent: false,
        hardCapAlertSent: false,
        periodStart: now,
        periodEnd: now + 30 * 24 * 60 * 60 * 1000,
        updatedAt: now,
      });
    }

    return targetUser._id;
  },
});

/**
 * Create an alert for a user (admin only).
 */
export const adminCreateAlert = mutation({
  args: {
    email: v.string(),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    priority: v.string(),
  },
  handler: async (ctx, { email, type, title, message, priority }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const adminUser = await ctx.db.get(userId);
    if (!adminUser || !adminUser.email || !ADMIN_EMAILS.includes(adminUser.email)) {
      throw new Error("Admin access required");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!targetUser) {
      throw new Error("User not found");
    }

    const now = Date.now();

    return await ctx.db.insert("alerts", {
      userId: targetUser._id,
      type,
      title,
      message,
      priority,
      isRead: false,
      isDismissed: false,
      createdAt: now,
    });
  },
});

/**
 * Delete a user and all associated data (admin only).
 * WARNING: This is destructive!
 */
export const adminDeleteUser = mutation({
  args: {
    email: v.string(),
    confirmEmail: v.string(), // Must match email for safety
  },
  handler: async (ctx, { email, confirmEmail }) => {
    if (email !== confirmEmail) {
      throw new Error("Email confirmation does not match");
    }

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const adminUser = await ctx.db.get(userId);
    if (!adminUser || !adminUser.email || !ADMIN_EMAILS.includes(adminUser.email)) {
      throw new Error("Admin access required");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!targetUser) {
      throw new Error("User not found");
    }

    // Delete all associated data
    // 1. Subscriptions
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .collect();
    for (const sub of subscriptions) {
      await ctx.db.delete(sub._id);
    }

    // 2. User profiles
    const profiles = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .collect();
    for (const profile of profiles) {
      await ctx.db.delete(profile._id);
    }

    // 3. Chat sessions and messages
    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .collect();
    for (const session of sessions) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const message of messages) {
        await ctx.db.delete(message._id);
      }
      await ctx.db.delete(session._id);
    }

    // 4. Usage tracking
    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .collect();
    for (const u of usage) {
      await ctx.db.delete(u._id);
    }

    // 5. Alerts
    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .collect();
    for (const alert of alerts) {
      await ctx.db.delete(alert._id);
    }

    // 6. Saved rights
    const rights = await ctx.db
      .query("savedRights")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .collect();
    for (const right of rights) {
      await ctx.db.delete(right._id);
    }

    // 7. Checklists and items
    const checklists = await ctx.db
      .query("checklists")
      .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
      .collect();
    for (const checklist of checklists) {
      const items = await ctx.db
        .query("checklistItems")
        .withIndex("by_checklistId", (q) => q.eq("checklistId", checklist._id))
        .collect();
      for (const item of items) {
        await ctx.db.delete(item._id);
      }
      await ctx.db.delete(checklist._id);
    }

    // Finally, delete the user
    await ctx.db.delete(targetUser._id);

    return targetUser._id;
  },
});
