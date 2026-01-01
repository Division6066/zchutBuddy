/**
 * Token Cost Calculator
 *
 * Handles token estimation and cost calculation for API usage tracking.
 * Supports Hebrew text optimization.
 */

// USD to ILS conversion rate
export const USD_TO_ILS = 3.7;

/**
 * Model pricing per 1M tokens (in USD)
 */
export const MODEL_PRICING: Record<
  string,
  { inputPricePerMillion: number; outputPricePerMillion: number }
> = {
  "gemma-2-9b": { inputPricePerMillion: 0, outputPricePerMillion: 0 },
  "mistral-small": { inputPricePerMillion: 0.2, outputPricePerMillion: 0.6 },
  "mistral-medium": { inputPricePerMillion: 2.0, outputPricePerMillion: 6.0 },
  "deepseek-v3": { inputPricePerMillion: 0.27, outputPricePerMillion: 1.1 },
  "kimi-k2": { inputPricePerMillion: 0.6, outputPricePerMillion: 2.4 },
};

/**
 * Estimate tokens for text (supports Hebrew)
 *
 * Hebrew text: characters / 2.5 (Hebrew is denser in tokens)
 * English text: words * 1.3
 * Mixed: weighted average based on character count
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;

  // Count Hebrew characters (Unicode range for Hebrew)
  const hebrewChars = (text.match(/[\u0590-\u05FF]/g) || []).length;
  const totalChars = text.length;

  if (totalChars === 0) return 0;

  // Hebrew estimation (characters / 2.5)
  const hebrewTokens = hebrewChars / 2.5;

  // Non-Hebrew text - word-based estimation
  const nonHebrewText = text.replace(/[\u0590-\u05FF]/g, "");
  const words = nonHebrewText.split(/\s+/).filter((w) => w.length > 0).length;
  const englishTokens = words * 1.3;

  // Add some buffer for special characters and formatting
  const baseTokens = hebrewTokens + englishTokens;
  const buffer = Math.ceil(baseTokens * 0.1); // 10% buffer

  return Math.ceil(baseTokens + buffer);
}

/**
 * Estimate tokens for a chat conversation
 */
export function estimateConversationTokens(
  messages: Array<{ role: string; content: string }>
): number {
  let totalTokens = 0;

  for (const message of messages) {
    // Add tokens for content
    totalTokens += estimateTokens(message.content);
    // Add overhead for message formatting (~4 tokens per message)
    totalTokens += 4;
  }

  // Add overhead for conversation structure (~10 tokens)
  totalTokens += 10;

  return totalTokens;
}

/**
 * Calculate token cost in USD
 */
export function calculateTokenCostUSD(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[modelId] || MODEL_PRICING["gemma-2-9b"];

  const inputCost = (inputTokens / 1_000_000) * pricing.inputPricePerMillion;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPricePerMillion;

  return inputCost + outputCost;
}

/**
 * Calculate token cost in Shekels (ILS)
 */
export function calculateTokenCostShekels(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costUSD = calculateTokenCostUSD(modelId, inputTokens, outputTokens);
  return costUSD * USD_TO_ILS;
}

/**
 * Estimate request cost before making the request
 */
export function estimateRequestCost(
  modelId: string,
  inputText: string,
  estimatedOutputTokens: number = 500
): {
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCostUSD: number;
  estimatedCostShekels: number;
} {
  const estimatedInputTokens = estimateTokens(inputText);
  const costUSD = calculateTokenCostUSD(modelId, estimatedInputTokens, estimatedOutputTokens);
  const costShekels = costUSD * USD_TO_ILS;

  return {
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedCostUSD: Math.round(costUSD * 1000000) / 1000000, // 6 decimal places
    estimatedCostShekels: Math.round(costShekels * 10000) / 10000, // 4 decimal places
  };
}

/**
 * Calculate actual cost after request completion
 */
export function calculateActualCost(
  modelId: string,
  usage: { promptTokens: number; completionTokens: number }
): {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUSD: number;
  costShekels: number;
} {
  const { promptTokens, completionTokens } = usage;
  const costUSD = calculateTokenCostUSD(modelId, promptTokens, completionTokens);
  const costShekels = costUSD * USD_TO_ILS;

  return {
    inputTokens: promptTokens,
    outputTokens: completionTokens,
    totalTokens: promptTokens + completionTokens,
    costUSD: Math.round(costUSD * 1000000) / 1000000,
    costShekels: Math.round(costShekels * 10000) / 10000,
  };
}

/**
 * Check if user has enough budget for a request
 */
export function checkBudget(
  modelId: string,
  inputText: string,
  currentUsage: number,
  limit: number,
  estimatedOutputTokens: number = 500
): {
  hasEnoughBudget: boolean;
  estimatedCost: number;
  remainingBudget: number;
  wouldExceedBy: number;
} {
  const { estimatedCostShekels } = estimateRequestCost(modelId, inputText, estimatedOutputTokens);
  const remainingBudget = limit - currentUsage;
  const wouldExceedBy = Math.max(0, estimatedCostShekels - remainingBudget);

  return {
    hasEnoughBudget: estimatedCostShekels <= remainingBudget,
    estimatedCost: estimatedCostShekels,
    remainingBudget,
    wouldExceedBy,
  };
}

/**
 * Format cost for display
 */
export function formatCost(costShekels: number): string {
  if (costShekels === 0) {
    return "חינם";
  }

  if (costShekels < 0.01) {
    return "< ₪0.01";
  }

  return `₪${costShekels.toFixed(2)}`;
}

/**
 * Format token count for display
 */
export function formatTokens(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`;
  }
  return tokens.toString();
}

/**
 * Get model pricing info for display
 */
export function getModelPricingDisplay(modelId: string): {
  inputPrice: string;
  outputPrice: string;
  isFree: boolean;
} {
  const pricing = MODEL_PRICING[modelId] || MODEL_PRICING["gemma-2-9b"];

  const isFree = pricing.inputPricePerMillion === 0 && pricing.outputPricePerMillion === 0;

  if (isFree) {
    return {
      inputPrice: "חינם",
      outputPrice: "חינם",
      isFree: true,
    };
  }

  const inputPriceILS = pricing.inputPricePerMillion * USD_TO_ILS;
  const outputPriceILS = pricing.outputPricePerMillion * USD_TO_ILS;

  return {
    inputPrice: `₪${inputPriceILS.toFixed(2)}/1M`,
    outputPrice: `₪${outputPriceILS.toFixed(2)}/1M`,
    isFree: false,
  };
}
