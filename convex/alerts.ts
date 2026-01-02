import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";

// ============================================
// INTERNAL HELPERS
// ============================================

async function getCurrentUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}

// ============================================
// VALIDATORS
// ============================================

export const alertTypeValidator = v.union(
  v.literal("usage_warning"),
  v.literal("rights_update"),
  v.literal("deadline"),
  v.literal("system")
);

export const alertPriorityValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("urgent")
);

// ============================================
// QUERIES
// ============================================

/**
 * Get all alerts for the current user.
 */
export const getMyAlerts = query({
  args: {
    includeRead: v.optional(v.boolean()),
    includeDismissed: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { includeRead = false, includeDismissed = false, limit = 50 }) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    let alerts = await ctx.db
      .query("alerts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Filter out expired alerts
    alerts = alerts.filter((alert) => !alert.expiresAt || alert.expiresAt > now);

    // Filter based on read/dismissed status
    if (!includeRead) {
      alerts = alerts.filter((alert) => !alert.isRead);
    }

    if (!includeDismissed) {
      alerts = alerts.filter((alert) => !alert.isDismissed);
    }

    return alerts.slice(0, limit);
  },
});

/**
 * Get unread alert count for the current user.
 * Returns 0 for unauthenticated users (graceful fallback for guest mode).
 */
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    // Gracefully handle unauthenticated users (e.g., guest mode)
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0; // Return 0 for guests instead of throwing
    }

    const now = Date.now();

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.and(q.eq(q.field("isRead"), false), q.eq(q.field("isDismissed"), false)))
      .collect();

    // Filter out expired
    const activeAlerts = alerts.filter((alert) => !alert.expiresAt || alert.expiresAt > now);

    return activeAlerts.length;
  },
});

/**
 * Get alerts by type.
 */
export const getAlertsByType = query({
  args: {
    type: alertTypeValidator,
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { type, limit = 20 }) => {
    const userId = await getCurrentUserId(ctx);

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_type", (q) => q.eq("type", type))
      .order("desc")
      .collect();

    // Filter to only user's alerts
    const userAlerts = alerts.filter((a) => a.userId === userId && !a.isDismissed);

    return userAlerts.slice(0, limit);
  },
});

/**
 * Get urgent alerts (high and urgent priority).
 */
export const getUrgentAlerts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return alerts
      .filter(
        (alert) =>
          (alert.priority === "high" || alert.priority === "urgent") &&
          !alert.isDismissed &&
          (!alert.expiresAt || alert.expiresAt > now)
      )
      .sort((a, b) => {
        // Urgent first, then high
        if (a.priority === "urgent" && b.priority !== "urgent") return -1;
        if (b.priority === "urgent" && a.priority !== "urgent") return 1;
        return b.createdAt - a.createdAt;
      });
  },
});

/**
 * Get a single alert by ID.
 */
export const getById = query({
  args: {
    alertId: v.id("alerts"),
  },
  handler: async (ctx, { alertId }) => {
    const userId = await getCurrentUserId(ctx);

    const alert = await ctx.db.get(alertId);

    if (!alert || alert.userId !== userId) {
      return null;
    }

    return alert;
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Create an alert for a user (internal/system use).
 */
export const createAlert = mutation({
  args: {
    userId: v.id("users"),
    type: alertTypeValidator,
    title: v.string(),
    message: v.string(),
    priority: alertPriorityValidator,
    actionUrl: v.optional(v.string()),
    actionLabel: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("alerts", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      priority: args.priority,
      isRead: false,
      isDismissed: false,
      actionUrl: args.actionUrl,
      actionLabel: args.actionLabel,
      createdAt: now,
      expiresAt: args.expiresAt,
    });
  },
});

/**
 * Create a usage warning alert.
 */
export const createUsageWarningAlert = mutation({
  args: {
    usagePercentage: v.number(),
    isHardCap: v.optional(v.boolean()),
  },
  handler: async (ctx, { usagePercentage, isHardCap = false }) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    const title = isHardCap ? "שימוש גבוה - חשוב!" : "אזהרת שימוש";
    const message = isHardCap
      ? `השתמשת ב-${usagePercentage}% מהקרדיטים החודשיים שלך. שקול לשדרג את המנוי.`
      : `השתמשת ב-${usagePercentage}% מהקרדיטים החודשיים שלך.`;

    return await ctx.db.insert("alerts", {
      userId,
      type: "usage_warning",
      title,
      message,
      priority: isHardCap ? "high" : "medium",
      isRead: false,
      isDismissed: false,
      actionUrl: "/settings/subscription",
      actionLabel: "שדרג מנוי",
      createdAt: now,
    });
  },
});

/**
 * Create a deadline reminder alert.
 */
export const createDeadlineAlert = mutation({
  args: {
    title: v.string(),
    deadline: v.number(),
    checklistId: v.optional(v.id("checklists")),
  },
  handler: async (ctx, { title, deadline, checklistId }) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    const daysUntil = Math.ceil((deadline - now) / (24 * 60 * 60 * 1000));

    return await ctx.db.insert("alerts", {
      userId,
      type: "deadline",
      title: `תזכורת: ${title}`,
      message: `נותרו ${daysUntil} ימים עד למועד האחרון`,
      priority: daysUntil <= 1 ? "urgent" : daysUntil <= 3 ? "high" : "medium",
      isRead: false,
      isDismissed: false,
      actionUrl: checklistId ? `/checklists/${checklistId}` : undefined,
      actionLabel: checklistId ? "צפה בצ'קליסט" : undefined,
      createdAt: now,
      expiresAt: deadline,
    });
  },
});

/**
 * Mark an alert as read.
 */
export const markAsRead = mutation({
  args: {
    alertId: v.id("alerts"),
  },
  handler: async (ctx, { alertId }) => {
    const userId = await getCurrentUserId(ctx);

    const alert = await ctx.db.get(alertId);
    if (!alert || alert.userId !== userId) {
      throw new Error("Alert not found");
    }

    await ctx.db.patch(alertId, { isRead: true });
    return alertId;
  },
});

/**
 * Mark multiple alerts as read.
 */
export const markMultipleAsRead = mutation({
  args: {
    alertIds: v.array(v.id("alerts")),
  },
  handler: async (ctx, { alertIds }) => {
    const userId = await getCurrentUserId(ctx);

    for (const alertId of alertIds) {
      const alert = await ctx.db.get(alertId);
      if (alert && alert.userId === userId) {
        await ctx.db.patch(alertId, { isRead: true });
      }
    }

    return alertIds;
  },
});

/**
 * Mark all alerts as read.
 */
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    for (const alert of alerts) {
      await ctx.db.patch(alert._id, { isRead: true });
    }

    return alerts.length;
  },
});

/**
 * Dismiss an alert.
 */
export const dismissAlert = mutation({
  args: {
    alertId: v.id("alerts"),
  },
  handler: async (ctx, { alertId }) => {
    const userId = await getCurrentUserId(ctx);

    const alert = await ctx.db.get(alertId);
    if (!alert || alert.userId !== userId) {
      throw new Error("Alert not found");
    }

    await ctx.db.patch(alertId, {
      isDismissed: true,
      isRead: true,
    });

    return alertId;
  },
});

/**
 * Delete an alert.
 */
export const deleteAlert = mutation({
  args: {
    alertId: v.id("alerts"),
  },
  handler: async (ctx, { alertId }) => {
    const userId = await getCurrentUserId(ctx);

    const alert = await ctx.db.get(alertId);
    if (!alert || alert.userId !== userId) {
      throw new Error("Alert not found");
    }

    await ctx.db.delete(alertId);
    return alertId;
  },
});

/**
 * Delete all dismissed alerts for the current user.
 */
export const clearDismissedAlerts = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isDismissed"), true))
      .collect();

    for (const alert of alerts) {
      await ctx.db.delete(alert._id);
    }

    return alerts.length;
  },
});
