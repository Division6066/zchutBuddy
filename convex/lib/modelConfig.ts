/**
 * AI Model Hierarchy Configuration
 *
 * Model Tiers (1 = highest/best, 5 = lowest/cheapest):
 * - Tier 1: Kimi K2 (Max only)
 * - Tier 2: DeepSeek V3 (Pro+)
 * - Tier 3: Mistral Medium (Pro+)
 * - Tier 4: Mistral Small (Plus+)
 * - Tier 5: Gemma 2 (All tiers, free)
 *
 * USD to ILS conversion rate: 3.7
 */

// USD to ILS conversion rate
export const USD_TO_ILS = 3.7;

export const AI_MODELS = {
  "kimi-k2": {
    modelId: "kimi-k2",
    displayName: "Kimi K2",
    provider: "moonshot",
    tier: 1,
    // Pricing per 1M tokens (USD)
    inputPricePerMillion: 0.6,
    outputPricePerMillion: 2.4,
    maxContextTokens: 128000,
    supportsStreaming: true,
    supportsVision: true,
    availableForTiers: ["max"],
    isActive: true,
    isDefault: false,
    description: "Most powerful model for complex reasoning",
    descriptionHe: "המודל החזק ביותר לחשיבה מורכבת",
  },

  "deepseek-v3": {
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
    description: "Excellent for deep analysis and research",
    descriptionHe: "מצוין לניתוח מעמיק ומחקר",
  },

  "mistral-medium": {
    modelId: "mistral-medium-latest",
    displayName: "Mistral Medium",
    provider: "mistral",
    tier: 3,
    inputPricePerMillion: 2.0,
    outputPricePerMillion: 6.0,
    maxContextTokens: 32000,
    supportsStreaming: true,
    supportsVision: false,
    availableForTiers: ["pro", "max"],
    isActive: true,
    isDefault: false,
    description: "Balanced performance and cost",
    descriptionHe: "איזון בין ביצועים ועלות",
  },

  "mistral-small": {
    modelId: "mistral-small-latest",
    displayName: "Mistral Small",
    provider: "mistral",
    tier: 4,
    inputPricePerMillion: 0.2,
    outputPricePerMillion: 0.6,
    maxContextTokens: 32000,
    supportsStreaming: true,
    supportsVision: false,
    availableForTiers: ["plus", "pro", "max"],
    isActive: true,
    isDefault: true, // Default for Plus tier
    description: "Fast and efficient for most tasks",
    descriptionHe: "מהיר ויעיל לרוב המשימות",
  },

  "gemma-2-9b": {
    modelId: "google/gemma-2-9b-it:free",
    displayName: "Gemma 2",
    provider: "google",
    tier: 5,
    inputPricePerMillion: 0,
    outputPricePerMillion: 0,
    maxContextTokens: 8192,
    supportsStreaming: true,
    supportsVision: false,
    availableForTiers: ["free_trial", "plus", "pro", "max"],
    isActive: true,
    isDefault: true, // Default for Free Trial
    description: "Free model for basic queries",
    descriptionHe: "מודל חינמי לשאילתות בסיסיות",
  },
} as const;

export type ModelId = keyof typeof AI_MODELS;
export type ModelConfig = (typeof AI_MODELS)[ModelId];

/**
 * Get model configuration by ID
 */
export function getModelConfig(modelId: ModelId): ModelConfig {
  return AI_MODELS[modelId];
}

/**
 * Get all active models
 */
export function getActiveModels(): ModelConfig[] {
  return Object.values(AI_MODELS).filter((m) => m.isActive);
}

/**
 * Get models available for a specific subscription tier
 */
export function getModelsForTier(subscriptionTier: string): ModelConfig[] {
  return Object.values(AI_MODELS)
    .filter(
      (m) => m.isActive && (m.availableForTiers as readonly string[]).includes(subscriptionTier)
    )
    .sort((a, b) => a.tier - b.tier);
}

/**
 * Get the best (lowest tier number) available model for a subscription tier
 */
export function getBestModelForTier(subscriptionTier: string): ModelId {
  const models = Object.entries(AI_MODELS)
    .filter(
      ([_, m]) =>
        m.isActive && (m.availableForTiers as readonly string[]).includes(subscriptionTier)
    )
    .sort((a, b) => a[1].tier - b[1].tier);

  return (models[0]?.[0] as ModelId) || "gemma-2-9b";
}

/**
 * Get the default model for a subscription tier
 */
export function getDefaultModelForTier(subscriptionTier: string): ModelId {
  // For free trial, use Gemma (free)
  if (subscriptionTier === "free_trial") {
    return "gemma-2-9b";
  }

  // For Plus, use Mistral Small
  if (subscriptionTier === "plus") {
    return "mistral-small";
  }

  // For Pro and Max, use the best available
  return getBestModelForTier(subscriptionTier);
}

/**
 * Check if a model is available for a subscription tier
 */
export function isModelAvailableForTier(modelId: ModelId, subscriptionTier: string): boolean {
  const model = AI_MODELS[modelId];
  return (
    model.isActive && (model.availableForTiers as readonly string[]).includes(subscriptionTier)
  );
}

/**
 * Calculate token cost in USD
 */
export function calculateTokenCostUSD(
  modelId: ModelId,
  inputTokens: number,
  outputTokens: number
): number {
  const model = AI_MODELS[modelId];
  const inputCostUSD = (inputTokens / 1_000_000) * model.inputPricePerMillion;
  const outputCostUSD = (outputTokens / 1_000_000) * model.outputPricePerMillion;
  return inputCostUSD + outputCostUSD;
}

/**
 * Calculate token cost in Shekels (ILS)
 */
export function calculateTokenCostShekels(
  modelId: ModelId,
  inputTokens: number,
  outputTokens: number
): number {
  const costUSD = calculateTokenCostUSD(modelId, inputTokens, outputTokens);
  return costUSD * USD_TO_ILS;
}

/**
 * Get model tier by model ID
 */
export function getModelTier(modelId: ModelId): number {
  return AI_MODELS[modelId].tier;
}

/**
 * Check if user's subscription tier can access a model
 * based on the maxModelTier setting
 */
export function canAccessModel(modelId: ModelId, maxModelTier: number): boolean {
  const model = AI_MODELS[modelId];
  return model.tier >= maxModelTier; // Lower tier number = better model
}

/**
 * Get all model IDs
 */
export function getAllModelIds(): ModelId[] {
  return Object.keys(AI_MODELS) as ModelId[];
}

/**
 * Get model display info for UI
 */
export function getModelDisplayInfo(modelId: ModelId) {
  const model = AI_MODELS[modelId];
  return {
    id: model.modelId,
    name: model.displayName,
    provider: model.provider,
    tier: model.tier,
    description: model.description,
    descriptionHe: model.descriptionHe,
    maxContextTokens: model.maxContextTokens,
    supportsVision: model.supportsVision,
    isFree: model.inputPricePerMillion === 0 && model.outputPricePerMillion === 0,
  };
}

/**
 * Get pricing info for all models (for display)
 */
export function getModelPricingInfo() {
  return Object.values(AI_MODELS).map((model) => ({
    modelId: model.modelId,
    displayName: model.displayName,
    tier: model.tier,
    inputPricePerMillion: model.inputPricePerMillion,
    outputPricePerMillion: model.outputPricePerMillion,
    inputPricePerMillionILS: model.inputPricePerMillion * USD_TO_ILS,
    outputPricePerMillionILS: model.outputPricePerMillion * USD_TO_ILS,
  }));
}
