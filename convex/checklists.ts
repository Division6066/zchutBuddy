import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";

// ============================================
// INTERNAL HELPERS
// ============================================

/**
 * Get the current user's ID from Convex Auth.
 */
async function getCurrentUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}

/**
 * Verify ownership of a checklist.
 */
async function getOwnedChecklistOrThrow(
  ctx: QueryCtx | MutationCtx,
  checklistId: Id<"checklists">
) {
  const userId = await getCurrentUserId(ctx);

  const checklist = await ctx.db.get(checklistId);
  if (!checklist) {
    throw new Error("Checklist not found");
  }

  if (checklist.userId !== userId) {
    throw new Error("Forbidden");
  }

  return checklist;
}

// ============================================
// CHECKLIST MUTATIONS
// ============================================

/**
 * Create a new checklist.
 */
export const createChecklist = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(), // "rights_application" | "documents" | "custom"
    relatedRightId: v.optional(v.id("savedRights")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, { title, description, type, relatedRightId, dueDate }) => {
    const userId = await getCurrentUserId(ctx);
    const now = Date.now();

    return await ctx.db.insert("checklists", {
      userId,
      title,
      description,
      type,
      relatedRightId,
      totalItems: 0,
      completedItems: 0,
      dueDate,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update a checklist.
 */
export const updateChecklist = mutation({
  args: {
    checklistId: v.id("checklists"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, { checklistId, title, description, dueDate }) => {
    await getOwnedChecklistOrThrow(ctx, checklistId);
    const now = Date.now();

    const updateData: Record<string, unknown> = { updatedAt: now };
    if (title !== undefined) {
      updateData.title = title;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate;
    }

    await ctx.db.patch(checklistId, updateData);
    return checklistId;
  },
});

/**
 * Delete a checklist and all its items.
 */
export const deleteChecklist = mutation({
  args: {
    checklistId: v.id("checklists"),
  },
  handler: async (ctx, { checklistId }) => {
    await getOwnedChecklistOrThrow(ctx, checklistId);

    // Delete all items
    const items = await ctx.db
      .query("checklistItems")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", checklistId))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    // Delete the checklist
    await ctx.db.delete(checklistId);
    return checklistId;
  },
});

// ============================================
// CHECKLIST ITEM MUTATIONS
// ============================================

/**
 * Add an item to a checklist.
 */
export const addItem = mutation({
  args: {
    checklistId: v.id("checklists"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { checklistId, title, description }) => {
    const checklist = await getOwnedChecklistOrThrow(ctx, checklistId);
    const now = Date.now();

    // Get current max sortOrder
    const items = await ctx.db
      .query("checklistItems")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", checklistId))
      .collect();

    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.sortOrder)) : -1;

    // Create the item
    const itemId = await ctx.db.insert("checklistItems", {
      checklistId,
      title,
      description,
      isCompleted: false,
      sortOrder: maxOrder + 1,
      createdAt: now,
    });

    // Update checklist totalItems
    await ctx.db.patch(checklistId, {
      totalItems: checklist.totalItems + 1,
      updatedAt: now,
    });

    return itemId;
  },
});

/**
 * Update a checklist item.
 */
export const updateItem = mutation({
  args: {
    itemId: v.id("checklistItems"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { itemId, title, description }) => {
    const item = await ctx.db.get(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // Verify ownership through checklist
    await getOwnedChecklistOrThrow(ctx, item.checklistId);

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) {
      updateData.title = title;
    }
    if (description !== undefined) {
      updateData.description = description;
    }

    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(itemId, updateData);
    }

    return itemId;
  },
});

/**
 * Toggle item completion status.
 */
export const toggleItemComplete = mutation({
  args: {
    itemId: v.id("checklistItems"),
  },
  handler: async (ctx, { itemId }) => {
    const item = await ctx.db.get(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const checklist = await getOwnedChecklistOrThrow(ctx, item.checklistId);
    const now = Date.now();

    const newIsCompleted = !item.isCompleted;

    // Update item
    await ctx.db.patch(itemId, {
      isCompleted: newIsCompleted,
      completedAt: newIsCompleted ? now : undefined,
    });

    // Update checklist completedItems count
    await ctx.db.patch(checklist._id, {
      completedItems: newIsCompleted ? checklist.completedItems + 1 : checklist.completedItems - 1,
      updatedAt: now,
    });

    return itemId;
  },
});

/**
 * Mark an item as completed.
 */
export const markItemComplete = mutation({
  args: {
    itemId: v.id("checklistItems"),
  },
  handler: async (ctx, { itemId }) => {
    const item = await ctx.db.get(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    if (item.isCompleted) {
      return itemId; // Already completed
    }

    const checklist = await getOwnedChecklistOrThrow(ctx, item.checklistId);
    const now = Date.now();

    await ctx.db.patch(itemId, {
      isCompleted: true,
      completedAt: now,
    });

    await ctx.db.patch(checklist._id, {
      completedItems: checklist.completedItems + 1,
      updatedAt: now,
    });

    return itemId;
  },
});

/**
 * Delete a checklist item.
 */
export const deleteItem = mutation({
  args: {
    itemId: v.id("checklistItems"),
  },
  handler: async (ctx, { itemId }) => {
    const item = await ctx.db.get(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const checklist = await getOwnedChecklistOrThrow(ctx, item.checklistId);
    const now = Date.now();

    // Update checklist counts
    await ctx.db.patch(checklist._id, {
      totalItems: checklist.totalItems - 1,
      completedItems: item.isCompleted ? checklist.completedItems - 1 : checklist.completedItems,
      updatedAt: now,
    });

    // Delete the item
    await ctx.db.delete(itemId);

    return itemId;
  },
});

/**
 * Reorder items within a checklist.
 */
export const reorderItems = mutation({
  args: {
    checklistId: v.id("checklists"),
    itemIds: v.array(v.id("checklistItems")),
  },
  handler: async (ctx, { checklistId, itemIds }) => {
    await getOwnedChecklistOrThrow(ctx, checklistId);

    // Update sortOrder for each item
    for (let i = 0; i < itemIds.length; i++) {
      await ctx.db.patch(itemIds[i], { sortOrder: i });
    }

    await ctx.db.patch(checklistId, { updatedAt: Date.now() });

    return checklistId;
  },
});

// ============================================
// QUERIES
// ============================================

/**
 * List all checklists for the current user.
 */
export const listMyChecklists = query({
  args: {
    type: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { type, limit = 50 }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    let checklists = await ctx.db
      .query("checklists")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    if (type) {
      checklists = checklists.filter((c) => c.type === type);
    }

    return checklists.slice(0, limit);
  },
});

/**
 * Get a checklist by ID with its items.
 */
export const getChecklistWithItems = query({
  args: {
    checklistId: v.id("checklists"),
  },
  handler: async (ctx, { checklistId }) => {
    const checklist = await getOwnedChecklistOrThrow(ctx, checklistId);

    const items = await ctx.db
      .query("checklistItems")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", checklistId))
      .collect();

    // Sort by sortOrder
    items.sort((a, b) => a.sortOrder - b.sortOrder);

    return {
      ...checklist,
      items,
    };
  },
});

/**
 * Get a checklist by ID.
 */
export const getById = query({
  args: {
    checklistId: v.id("checklists"),
  },
  handler: async (ctx, { checklistId }) => {
    return await getOwnedChecklistOrThrow(ctx, checklistId);
  },
});

/**
 * Get items for a checklist.
 */
export const getItems = query({
  args: {
    checklistId: v.id("checklists"),
  },
  handler: async (ctx, { checklistId }) => {
    await getOwnedChecklistOrThrow(ctx, checklistId);

    const items = await ctx.db
      .query("checklistItems")
      .withIndex("by_checklistId", (q) => q.eq("checklistId", checklistId))
      .collect();

    // Sort by sortOrder
    items.sort((a, b) => a.sortOrder - b.sortOrder);

    return items;
  },
});

/**
 * Get checklist progress statistics.
 */
export const getProgress = query({
  args: {
    checklistId: v.id("checklists"),
  },
  handler: async (ctx, { checklistId }) => {
    const checklist = await getOwnedChecklistOrThrow(ctx, checklistId);

    const percentage =
      checklist.totalItems > 0
        ? Math.round((checklist.completedItems / checklist.totalItems) * 100)
        : 0;

    return {
      totalItems: checklist.totalItems,
      completedItems: checklist.completedItems,
      percentage,
      isComplete: checklist.completedItems === checklist.totalItems && checklist.totalItems > 0,
    };
  },
});

/**
 * Get all checklists with upcoming due dates.
 */
export const getUpcomingDueDates = query({
  args: {
    daysAhead: v.optional(v.number()),
  },
  handler: async (ctx, { daysAhead = 7 }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const now = Date.now();
    const cutoff = now + daysAhead * 24 * 60 * 60 * 1000;

    const checklists = await ctx.db
      .query("checklists")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return checklists
      .filter((c) => c.dueDate && c.dueDate <= cutoff && c.dueDate >= now)
      .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0));
  },
});
