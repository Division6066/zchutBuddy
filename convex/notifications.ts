import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================
// NOTIFICATION SETTINGS
// ============================================

/**
 * Get the current user's notification settings
 */
export const getMyNotificationSettings = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    // Get notification settings
    const settings = await ctx.db
      .query("notificationSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    // Return default settings if none exist
    if (!settings) {
      return {
        emailEnabled: true,
        digestFrequency: "weekly" as const,
        isDefault: true,
      };
    }

    return settings;
  },
});

/**
 * Update the current user's notification settings
 */
export const updateMyNotificationSettings = mutation({
  args: {
    emailEnabled: v.optional(v.boolean()),
    digestFrequency: v.optional(v.union(v.literal("weekly"), v.literal("daily"))),
  },
  handler: async (ctx, { emailEnabled, digestFrequency }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();

    // Check if settings exist
    const existingSettings = await ctx.db
      .query("notificationSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingSettings) {
      // Update existing settings
      const updateData: Record<string, unknown> = { updatedAt: now };
      if (emailEnabled !== undefined) updateData.emailEnabled = emailEnabled;
      if (digestFrequency !== undefined) updateData.digestFrequency = digestFrequency;

      await ctx.db.patch(existingSettings._id, updateData);
      return existingSettings._id;
    }

    // Create new settings
    return await ctx.db.insert("notificationSettings", {
      userId: user._id,
      emailEnabled: emailEnabled ?? true,
      digestFrequency: digestFrequency ?? "weekly",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ============================================
// NOTIFICATION EVENTS
// ============================================

/**
 * Create a notification event (for worker/system use)
 */
export const createNotificationEvent = mutation({
  args: {
    userId: v.id("users"),
    updateItemId: v.id("updateItems"),
    channel: v.literal("email"),
    status: v.optional(v.union(v.literal("queued"), v.literal("sent"), v.literal("failed"))),
  },
  handler: async (ctx, { userId, updateItemId, channel, status = "queued" }) => {
    const now = Date.now();

    return await ctx.db.insert("notificationEvents", {
      userId,
      updateItemId,
      channel,
      status,
      createdAt: now,
    });
  },
});

/**
 * Update notification event status (for worker use)
 */
export const updateNotificationStatus = mutation({
  args: {
    eventId: v.id("notificationEvents"),
    status: v.union(v.literal("queued"), v.literal("sent"), v.literal("failed")),
    sentAt: v.optional(v.number()),
  },
  handler: async (ctx, { eventId, status, sentAt }) => {
    const updateData: Record<string, unknown> = { status };
    if (sentAt !== undefined) updateData.sentAt = sentAt;
    if (status === "sent" && !sentAt) updateData.sentAt = Date.now();

    await ctx.db.patch(eventId, updateData);
    return eventId;
  },
});

/**
 * List notification events for the current user
 */
export const listMyNotificationEvents = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.union(v.literal("queued"), v.literal("sent"), v.literal("failed"))),
  },
  handler: async (ctx, { limit = 50, status }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    // Get notification events
    let events = await ctx.db
      .query("notificationEvents")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit * 2); // Get more to filter

    // Filter by status if provided
    if (status) {
      events = events.filter((e) => e.status === status);
    }

    events = events.slice(0, limit);

    // Enrich with update item info
    const enriched = await Promise.all(
      events.map(async (event) => {
        const updateItem = await ctx.db.get(event.updateItemId);
        let source = null;
        if (updateItem) {
          source = await ctx.db.get(updateItem.sourceId);
        }
        return { ...event, updateItem, source };
      })
    );

    return enriched;
  },
});

/**
 * Get queued notifications for a user (for digest building)
 */
export const getQueuedNotificationsForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const events = await ctx.db
      .query("notificationEvents")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .filter((q) => q.eq(q.field("status"), "queued"))
      .collect();

    // Enrich with update item info
    const enriched = await Promise.all(
      events.map(async (event) => {
        const updateItem = await ctx.db.get(event.updateItemId);
        let source = null;
        if (updateItem) {
          source = await ctx.db.get(updateItem.sourceId);
        }
        return { ...event, updateItem, source };
      })
    );

    return enriched;
  },
});

/**
 * Get users who should receive notifications (for digest worker)
 */
export const getUsersForDigest = query({
  args: {
    frequency: v.union(v.literal("weekly"), v.literal("daily")),
  },
  handler: async (ctx, { frequency }) => {
    // Get all notification settings with this frequency and email enabled
    const settings = await ctx.db
      .query("notificationSettings")
      .filter((q) =>
        q.and(q.eq(q.field("emailEnabled"), true), q.eq(q.field("digestFrequency"), frequency))
      )
      .collect();

    // Get user info for each
    const users = await Promise.all(
      settings.map(async (setting) => {
        const user = await ctx.db.get(setting.userId);
        return user ? { user, settings: setting } : null;
      })
    );

    return users.filter(Boolean);
  },
});
