import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a checklist plan from an answer (auth required)
 */
export const createChecklistFromAnswer = mutation({
  args: {
    title: v.string(),
    fromAnswerId: v.optional(v.id("answers")),
    stepsJson: v.string(), // JSON string of steps array
    nextActionsJson: v.string(), // JSON string of next 1-3 actions
  },
  handler: async (ctx, { title, fromAnswerId, stepsJson, nextActionsJson }) => {
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

    // Create the checklist plan
    return await ctx.db.insert("checklistPlans", {
      userId: user._id,
      title,
      fromAnswerId,
      stepsJson,
      nextActionsJson,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * List checklist plans for the current user
 */
export const listMyChecklists = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50 }) => {
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

    // Get checklist plans for this user
    const checklists = await ctx.db
      .query("checklistPlans")
      .withIndex("by_user_updatedAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    return checklists;
  },
});

/**
 * Get a single checklist plan by ID
 */
export const getById = query({
  args: { checklistId: v.id("checklistPlans") },
  handler: async (ctx, { checklistId }) => {
    return await ctx.db.get(checklistId);
  },
});

/**
 * Update a checklist plan
 */
export const updateChecklist = mutation({
  args: {
    checklistId: v.id("checklistPlans"),
    title: v.optional(v.string()),
    stepsJson: v.optional(v.string()),
    nextActionsJson: v.optional(v.string()),
  },
  handler: async (ctx, { checklistId, title, stepsJson, nextActionsJson }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the checklist to verify ownership
    const checklist = await ctx.db.get(checklistId);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    // Get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || checklist.userId !== user._id) {
      throw new Error("Not authorized");
    }

    const now = Date.now();

    // Update only provided fields
    const updateData: Record<string, unknown> = { updatedAt: now };
    if (title !== undefined) updateData.title = title;
    if (stepsJson !== undefined) updateData.stepsJson = stepsJson;
    if (nextActionsJson !== undefined) updateData.nextActionsJson = nextActionsJson;

    await ctx.db.patch(checklistId, updateData);
    return checklistId;
  },
});

/**
 * Delete a checklist plan
 */
export const deleteChecklist = mutation({
  args: { checklistId: v.id("checklistPlans") },
  handler: async (ctx, { checklistId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the checklist to verify ownership
    const checklist = await ctx.db.get(checklistId);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    // Get the user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || checklist.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(checklistId);
  },
});

