/**
 * Subscription Tier Configuration
 *
 * Pricing Structure (₪/month):
 * - Free Trial: ₪0 (14 days)
 * - Plus: ₪49
 * - Pro: ₪99
 * - Max: ₪199
 *
 * API Budget = 40% of subscription price
 * Soft Cap = 40% of API Budget (user warning)
 * Hard Cap = 60% of API Budget (usage restricted)
 */

export const SUBSCRIPTION_TIERS = {
  free_trial: {
    id: "free_trial",
    name: "Free Trial",
    nameHe: "תקופת ניסיון",
    priceShekels: 0,
    trialDays: 14,

    // Budget caps (in shekels worth of API)
    apiBudget: 10,
    softCapPercent: 0.4,
    hardCapPercent: 0.6,

    // Limits
    limits: {
      chatsPerDay: 5,
      deepResearchPerMonth: 0,
      maxChecklists: 3,
      maxSavedRights: 5,
      alertsEnabled: false,
      exportPdf: false,
      prioritySupport: false,
      apiAccess: false,
    },

    // Model access (tier numbers, 1 = best)
    maxModelTier: 5, // Only Gemma
  },

  plus: {
    id: "plus",
    name: "Plus",
    nameHe: "פלוס",
    priceShekels: 49,
    trialDays: 0,

    apiBudget: 19.6, // 40% of 49
    softCapPercent: 0.4,
    hardCapPercent: 0.6,

    limits: {
      chatsPerDay: 50,
      deepResearchPerMonth: 5,
      maxChecklists: 10,
      maxSavedRights: 25,
      alertsEnabled: true,
      exportPdf: true,
      prioritySupport: false,
      apiAccess: false,
    },

    maxModelTier: 4, // Up to Mistral Small
  },

  pro: {
    id: "pro",
    name: "Pro",
    nameHe: "פרו",
    priceShekels: 99,
    trialDays: 0,

    apiBudget: 39.6, // 40% of 99
    softCapPercent: 0.4,
    hardCapPercent: 0.6,

    limits: {
      chatsPerDay: -1, // unlimited
      deepResearchPerMonth: 20,
      maxChecklists: -1, // unlimited
      maxSavedRights: 100,
      alertsEnabled: true,
      exportPdf: true,
      prioritySupport: true,
      apiAccess: false,
    },

    maxModelTier: 2, // Up to DeepSeek
  },

  max: {
    id: "max",
    name: "Max",
    nameHe: "מקס",
    priceShekels: 199,
    trialDays: 0,

    apiBudget: 79.6, // 40% of 199
    softCapPercent: 0.4,
    hardCapPercent: 0.6,

    limits: {
      chatsPerDay: -1, // unlimited
      deepResearchPerMonth: -1, // unlimited
      maxChecklists: -1, // unlimited
      maxSavedRights: -1, // unlimited
      alertsEnabled: true,
      exportPdf: true,
      prioritySupport: true,
      apiAccess: true,
    },

    maxModelTier: 1, // All models including KimiK2
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
export type TierConfig = (typeof SUBSCRIPTION_TIERS)[SubscriptionTier];
export type TierLimits = TierConfig["limits"];

/**
 * Calculate soft cap, hard cap, and total budget for a tier
 */
export function calculateCaps(tier: SubscriptionTier) {
  const config = SUBSCRIPTION_TIERS[tier];
  return {
    softCap: config.apiBudget * config.softCapPercent,
    hardCap: config.apiBudget * config.hardCapPercent,
    totalBudget: config.apiBudget,
  };
}

/**
 * Get tier configuration by ID
 */
export function getTierConfig(tier: SubscriptionTier): TierConfig {
  return SUBSCRIPTION_TIERS[tier];
}

/**
 * Check if a tier has unlimited access to a specific limit
 * (-1 means unlimited)
 */
export function isUnlimited(tier: SubscriptionTier, limitKey: keyof TierLimits): boolean {
  const config = SUBSCRIPTION_TIERS[tier];
  const value = config.limits[limitKey];
  return typeof value === "number" && value === -1;
}

/**
 * Get the limit value for a tier
 * Returns null if unlimited (-1)
 */
export function getLimit(
  tier: SubscriptionTier,
  limitKey: keyof TierLimits
): number | boolean | null {
  const config = SUBSCRIPTION_TIERS[tier];
  const value = config.limits[limitKey];
  if (typeof value === "number" && value === -1) {
    return null; // unlimited
  }
  return value;
}

/**
 * Check if a tier has access to a feature
 */
export function hasFeature(
  tier: SubscriptionTier,
  feature: "alertsEnabled" | "exportPdf" | "prioritySupport" | "apiAccess"
): boolean {
  return SUBSCRIPTION_TIERS[tier].limits[feature];
}

/**
 * Get all tier IDs
 */
export function getAllTierIds(): SubscriptionTier[] {
  return Object.keys(SUBSCRIPTION_TIERS) as SubscriptionTier[];
}

/**
 * Get pricing display info for all tiers
 */
export function getTierPricingInfo() {
  return Object.values(SUBSCRIPTION_TIERS).map((tier) => ({
    id: tier.id,
    name: tier.name,
    nameHe: tier.nameHe,
    priceShekels: tier.priceShekels,
    apiBudget: tier.apiBudget,
    ...calculateCaps(tier.id as SubscriptionTier),
  }));
}

