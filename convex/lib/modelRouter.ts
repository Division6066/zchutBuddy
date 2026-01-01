/**
 * Model Router - Intelligent Model Selection with Fallback
 *
 * Handles model selection based on subscription tiers with automatic fallback
 * if preferred models are unavailable or if the user doesn't have access.
 */

import {
  AI_MODELS,
  getDefaultModelForTier as getDefaultModel,
  isModelAvailableForTier,
  type ModelId,
} from "./modelConfig";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "./subscriptionConfig";

// Re-export types for convenience
export type { ModelId } from "./modelConfig";
export type { SubscriptionTier } from "./subscriptionConfig";

/**
 * Model access matrix by subscription tier
 */
export const MODEL_ACCESS: Record<SubscriptionTier, ModelId[]> = {
  free_trial: ["gemma-2-9b"],
  plus: ["gemma-2-9b", "mistral-small"],
  pro: ["gemma-2-9b", "mistral-small", "mistral-medium", "deepseek-v3"],
  max: ["gemma-2-9b", "mistral-small", "mistral-medium", "deepseek-v3", "kimi-k2"],
};

/**
 * Default model for each subscription tier (best available)
 */
export const DEFAULT_MODELS: Record<SubscriptionTier, ModelId> = {
  free_trial: "gemma-2-9b",
  plus: "mistral-small",
  pro: "deepseek-v3",
  max: "kimi-k2",
};

/**
 * Fallback chain - if preferred model unavailable, try next best
 */
export const FALLBACK_CHAIN: Record<ModelId, ModelId[]> = {
  "kimi-k2": ["deepseek-v3", "mistral-medium", "mistral-small", "gemma-2-9b"],
  "deepseek-v3": ["mistral-medium", "mistral-small", "gemma-2-9b"],
  "mistral-medium": ["mistral-small", "gemma-2-9b"],
  "mistral-small": ["gemma-2-9b"],
  "gemma-2-9b": [], // No fallback, always available
};

/**
 * OpenRouter model IDs mapping
 */
export const OPENROUTER_MODEL_IDS: Record<ModelId, string> = {
  "gemma-2-9b": "google/gemma-2-9b-it:free",
  "mistral-small": "mistralai/mistral-small-latest",
  "mistral-medium": "mistralai/mistral-medium-latest",
  "deepseek-v3": "deepseek/deepseek-chat",
  "kimi-k2": "moonshotai/kimi-k2",
};

/**
 * Get available models for a subscription tier
 */
export function getAvailableModelsForTier(tier: SubscriptionTier): ModelId[] {
  return MODEL_ACCESS[tier] || MODEL_ACCESS.free_trial;
}

/**
 * Get the default (best) model for a subscription tier
 */
export function getDefaultModelForTier(tier: SubscriptionTier): ModelId {
  return DEFAULT_MODELS[tier] || DEFAULT_MODELS.free_trial;
}

/**
 * Check if a user can access a specific model based on their tier
 */
export function canUserAccessModel(userTier: SubscriptionTier, modelId: ModelId): boolean {
  const availableModels = MODEL_ACCESS[userTier];
  return availableModels?.includes(modelId) ?? false;
}

/**
 * Get model info with tier access check
 */
export function getModelWithAccess(modelId: ModelId, userTier: SubscriptionTier) {
  const model = AI_MODELS[modelId];
  const hasAccess = canUserAccessModel(userTier, modelId);
  const isDefault = DEFAULT_MODELS[userTier] === modelId;

  return {
    ...model,
    hasAccess,
    isDefault,
    isLocked: !hasAccess,
    openRouterId: OPENROUTER_MODEL_IDS[modelId],
  };
}

/**
 * Get all models with access info for a tier (for UI display)
 */
export function getAllModelsWithAccess(userTier: SubscriptionTier) {
  const allModelIds = Object.keys(AI_MODELS) as ModelId[];

  return allModelIds.map((modelId) => getModelWithAccess(modelId, userTier));
}

/**
 * Select model with automatic fallback
 *
 * @param userTier - User's subscription tier
 * @param preferredModel - Optional preferred model ID
 * @param isModelDown - Optional map of model availability status
 * @returns Selected model ID
 */
export function selectModelWithFallback(
  userTier: SubscriptionTier,
  preferredModel?: ModelId,
  isModelDown?: Record<ModelId, boolean>
): ModelId {
  const available = MODEL_ACCESS[userTier];

  // If preferred model specified and accessible
  if (preferredModel && available.includes(preferredModel)) {
    // Check if model is down
    if (!isModelDown?.[preferredModel]) {
      return preferredModel;
    }
    // Try fallbacks
    for (const fallback of FALLBACK_CHAIN[preferredModel]) {
      if (available.includes(fallback) && !isModelDown?.[fallback]) {
        return fallback;
      }
    }
  }

  // Use default for tier
  const defaultModel = DEFAULT_MODELS[userTier];
  if (!isModelDown?.[defaultModel]) {
    return defaultModel;
  }

  // Last resort: find any working model
  for (const model of available) {
    if (!isModelDown?.[model]) {
      return model;
    }
  }

  // Absolute fallback
  return "gemma-2-9b";
}

/**
 * Select model for a request with full context
 *
 * @param userTier - User's subscription tier
 * @param preferredModel - Optional preferred model ID
 * @returns Object with selected model info and OpenRouter endpoint
 */
export function selectModelForRequest(
  userTier: SubscriptionTier,
  preferredModel?: ModelId
): {
  modelId: ModelId;
  openRouterId: string;
  modelConfig: (typeof AI_MODELS)[ModelId];
  wasPreferredUsed: boolean;
} {
  const selectedModelId = selectModelWithFallback(userTier, preferredModel);
  const modelConfig = AI_MODELS[selectedModelId];
  const openRouterId = OPENROUTER_MODEL_IDS[selectedModelId];

  return {
    modelId: selectedModelId,
    openRouterId,
    modelConfig,
    wasPreferredUsed: preferredModel === selectedModelId,
  };
}

/**
 * Validate if a model selection is valid for a user
 */
export function validateModelSelection(
  userTier: SubscriptionTier,
  requestedModel: string
): {
  isValid: boolean;
  selectedModel: ModelId;
  reason?: string;
} {
  // Check if it's a valid model ID
  if (!(requestedModel in AI_MODELS)) {
    return {
      isValid: false,
      selectedModel: getDefaultModelForTier(userTier),
      reason: `Invalid model ID: ${requestedModel}`,
    };
  }

  const modelId = requestedModel as ModelId;

  // Check if user has access
  if (!canUserAccessModel(userTier, modelId)) {
    return {
      isValid: false,
      selectedModel: getDefaultModelForTier(userTier),
      reason: `Model ${modelId} requires a higher subscription tier`,
    };
  }

  return {
    isValid: true,
    selectedModel: modelId,
  };
}

/**
 * Get upgrade suggestion when user tries to access locked model
 */
export function getUpgradeSuggestion(
  currentTier: SubscriptionTier,
  requestedModel: ModelId
): {
  requiredTier: SubscriptionTier;
  priceIncrease: number;
  message: string;
  messageHe: string;
} | null {
  // Find the minimum tier that has access to this model
  const tierOrder: SubscriptionTier[] = ["free_trial", "plus", "pro", "max"];
  const currentTierIndex = tierOrder.indexOf(currentTier);

  for (let i = currentTierIndex + 1; i < tierOrder.length; i++) {
    const tier = tierOrder[i];
    if (canUserAccessModel(tier, requestedModel)) {
      const currentPrice = SUBSCRIPTION_TIERS[currentTier].priceShekels;
      const newPrice = SUBSCRIPTION_TIERS[tier].priceShekels;

      return {
        requiredTier: tier,
        priceIncrease: newPrice - currentPrice,
        message: `Upgrade to ${SUBSCRIPTION_TIERS[tier].name} to access ${AI_MODELS[requestedModel].displayName}`,
        messageHe: `שדרג ל${SUBSCRIPTION_TIERS[tier].nameHe} כדי לגשת ל-${AI_MODELS[requestedModel].displayName}`,
      };
    }
  }

  return null;
}
