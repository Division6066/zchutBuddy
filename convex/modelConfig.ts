import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// Simple admin email check - replace with proper RBAC later
const ADMIN_EMAILS = ["levidavidspublic@proton.me"];

// ============================================
// QUERIES
// ============================================

/**
 * Get all active models.
 */
export const getActiveModels = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx.db
      .query("modelConfig")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Sort by tier (lowest tier number = highest priority)
    return models.sort((a, b) => a.tier - b.tier);
  },
});

/**
 * Get models available for a specific subscription tier.
 */
export const getModelsForTier = query({
  args: {
    subscriptionTier: v.string(),
  },
  handler: async (ctx, { subscriptionTier }) => {
    const models = await ctx.db
      .query("modelConfig")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter by subscription tier availability
    const availableModels = models.filter((model) =>
      model.availableForTiers.includes(subscriptionTier)
    );

    // Sort by tier
    return availableModels.sort((a, b) => a.tier - b.tier);
  },
});

/**
 * Get the default model.
 */
export const getDefaultModel = query({
  args: {},
  handler: async (ctx) => {
    const defaultModel = await ctx.db
      .query("modelConfig")
      .filter((q) => q.and(q.eq(q.field("isActive"), true), q.eq(q.field("isDefault"), true)))
      .first();

    return defaultModel;
  },
});

/**
 * Get a model by ID.
 */
export const getByModelId = query({
  args: {
    modelId: v.string(),
  },
  handler: async (ctx, { modelId }) => {
    return await ctx.db
      .query("modelConfig")
      .withIndex("by_modelId", (q) => q.eq("modelId", modelId))
      .unique();
  },
});

/**
 * Get all models (admin view).
 */
export const getAllModels = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      throw new Error("Admin access required");
    }

    const models = await ctx.db.query("modelConfig").collect();
    return models.sort((a, b) => a.tier - b.tier);
  },
});

/**
 * Calculate cost for token usage.
 */
export const calculateCost = query({
  args: {
    modelId: v.string(),
    inputTokens: v.number(),
    outputTokens: v.number(),
  },
  handler: async (ctx, { modelId, inputTokens, outputTokens }) => {
    const model = await ctx.db
      .query("modelConfig")
      .withIndex("by_modelId", (q) => q.eq("modelId", modelId))
      .unique();

    if (!model) {
      return null;
    }

    // Calculate cost in USD
    const inputCostUSD = (inputTokens / 1_000_000) * model.inputPricePerMillion;
    const outputCostUSD = (outputTokens / 1_000_000) * model.outputPricePerMillion;
    const totalCostUSD = inputCostUSD + outputCostUSD;

    // Convert to shekels (rough rate: 1 USD = 3.7 ILS)
    const totalCostShekels = totalCostUSD * 3.7;

    return {
      inputCostUSD,
      outputCostUSD,
      totalCostUSD,
      totalCostShekels,
    };
  },
});

// ============================================
// MUTATIONS (Admin only)
// ============================================

/**
 * Create a new model configuration (admin only).
 */
export const createModel = mutation({
  args: {
    modelId: v.string(),
    displayName: v.string(),
    provider: v.string(),
    tier: v.number(),
    inputPricePerMillion: v.number(),
    outputPricePerMillion: v.number(),
    maxContextTokens: v.number(),
    supportsStreaming: v.boolean(),
    supportsVision: v.boolean(),
    availableForTiers: v.array(v.string()),
    isActive: v.optional(v.boolean()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      throw new Error("Admin access required");
    }

    // Check if model ID already exists
    const existing = await ctx.db
      .query("modelConfig")
      .withIndex("by_modelId", (q) => q.eq("modelId", args.modelId))
      .unique();

    if (existing) {
      throw new Error("Model ID already exists");
    }

    // If setting as default, unset other defaults
    if (args.isDefault) {
      const models = await ctx.db.query("modelConfig").collect();
      for (const model of models) {
        if (model.isDefault) {
          await ctx.db.patch(model._id, { isDefault: false });
        }
      }
    }

    return await ctx.db.insert("modelConfig", {
      modelId: args.modelId,
      displayName: args.displayName,
      provider: args.provider,
      tier: args.tier,
      inputPricePerMillion: args.inputPricePerMillion,
      outputPricePerMillion: args.outputPricePerMillion,
      maxContextTokens: args.maxContextTokens,
      supportsStreaming: args.supportsStreaming,
      supportsVision: args.supportsVision,
      availableForTiers: args.availableForTiers,
      isActive: args.isActive ?? true,
      isDefault: args.isDefault ?? false,
    });
  },
});

/**
 * Update a model configuration (admin only).
 */
export const updateModel = mutation({
  args: {
    modelId: v.string(),
    displayName: v.optional(v.string()),
    provider: v.optional(v.string()),
    tier: v.optional(v.number()),
    inputPricePerMillion: v.optional(v.number()),
    outputPricePerMillion: v.optional(v.number()),
    maxContextTokens: v.optional(v.number()),
    supportsStreaming: v.optional(v.boolean()),
    supportsVision: v.optional(v.boolean()),
    availableForTiers: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, { modelId, ...updates }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      throw new Error("Admin access required");
    }

    const model = await ctx.db
      .query("modelConfig")
      .withIndex("by_modelId", (q) => q.eq("modelId", modelId))
      .unique();

    if (!model) {
      throw new Error("Model not found");
    }

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      const models = await ctx.db.query("modelConfig").collect();
      for (const m of models) {
        if (m.isDefault && m._id !== model._id) {
          await ctx.db.patch(m._id, { isDefault: false });
        }
      }
    }

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(model._id, updateData);
    }

    return model._id;
  },
});

/**
 * Delete a model configuration (admin only).
 */
export const deleteModel = mutation({
  args: {
    modelId: v.string(),
  },
  handler: async (ctx, { modelId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      throw new Error("Admin access required");
    }

    const model = await ctx.db
      .query("modelConfig")
      .withIndex("by_modelId", (q) => q.eq("modelId", modelId))
      .unique();

    if (!model) {
      throw new Error("Model not found");
    }

    await ctx.db.delete(model._id);
    return model._id;
  },
});

/**
 * Seed default model configurations (internal - no auth required).
 * Run from Convex dashboard to initialize models.
 */
export const seedDefaultModels = internalMutation({
  args: {},
  handler: async (ctx) => {
    const defaultModels = [
      {
        modelId: "kimi-k2",
        displayName: "Kimi K2",
        provider: "moonshot",
        tier: 1,
        inputPricePerMillion: 0.6,
        outputPricePerMillion: 2.4,
        maxContextTokens: 128000,
        supportsStreaming: true,
        supportsVision: false,
        availableForTiers: ["max"],
        isActive: true,
        isDefault: false,
      },
      {
        modelId: "deepseek-v3",
        displayName: "DeepSeek V3",
        provider: "deepseek",
        tier: 2,
        inputPricePerMillion: 0.27,
        outputPricePerMillion: 1.1,
        maxContextTokens: 64000,
        supportsStreaming: true,
        supportsVision: false,
        availableForTiers: ["pro", "max"],
        isActive: true,
        isDefault: false,
      },
      {
        modelId: "mistral-large",
        displayName: "Mistral Large",
        provider: "mistral",
        tier: 3,
        inputPricePerMillion: 2.0,
        outputPricePerMillion: 6.0,
        maxContextTokens: 32000,
        supportsStreaming: true,
        supportsVision: false,
        availableForTiers: ["plus", "pro", "max"],
        isActive: true,
        isDefault: true,
      },
      {
        modelId: "gemini-flash",
        displayName: "Gemini Flash",
        provider: "google",
        tier: 4,
        inputPricePerMillion: 0.075,
        outputPricePerMillion: 0.3,
        maxContextTokens: 1000000,
        supportsStreaming: true,
        supportsVision: true,
        availableForTiers: ["free_trial", "plus", "pro", "max"],
        isActive: true,
        isDefault: false,
      },
    ];

    const insertedIds = [];

    for (const modelData of defaultModels) {
      const existing = await ctx.db
        .query("modelConfig")
        .withIndex("by_modelId", (q) => q.eq("modelId", modelData.modelId))
        .unique();

      if (!existing) {
        const id = await ctx.db.insert("modelConfig", modelData);
        insertedIds.push(id);
      }
    }

    return insertedIds;
  },
});
