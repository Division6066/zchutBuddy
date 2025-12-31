/**
 * ModelSelector Component
 *
 * Dropdown for selecting AI models based on subscription tier.
 * Shows available models with tier badges and lock icons.
 */

"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";

/**
 * Model configuration
 */
interface ModelInfo {
  id: string;
  displayName: string;
  description: string;
  descriptionHe: string;
  tier: number;
  hasAccess: boolean;
  isDefault: boolean;
  isFree: boolean;
}

/**
 * All available models with their info
 */
const ALL_MODELS: ModelInfo[] = [
  {
    id: "gemma-2-9b",
    displayName: "Gemma 2",
    description: "Free model for basic queries",
    descriptionHe: "מודל חינמי לשאילתות בסיסיות",
    tier: 5,
    hasAccess: true, // All tiers
    isDefault: false,
    isFree: true,
  },
  {
    id: "mistral-small",
    displayName: "Mistral Small",
    description: "Fast and efficient for most tasks",
    descriptionHe: "מהיר ויעיל לרוב המשימות",
    tier: 4,
    hasAccess: false, // Plus+
    isDefault: false,
    isFree: false,
  },
  {
    id: "mistral-medium",
    displayName: "Mistral Medium",
    description: "Balanced performance and cost",
    descriptionHe: "איזון בין ביצועים ועלות",
    tier: 3,
    hasAccess: false, // Pro+
    isDefault: false,
    isFree: false,
  },
  {
    id: "deepseek-v3",
    displayName: "DeepSeek V3",
    description: "Excellent for deep analysis and research",
    descriptionHe: "מצוין לניתוח מעמיק ומחקר",
    tier: 2,
    hasAccess: false, // Pro+
    isDefault: false,
    isFree: false,
  },
  {
    id: "kimi-k2",
    displayName: "Kimi K2",
    description: "Most powerful model for complex reasoning",
    descriptionHe: "המודל החזק ביותר לחשיבה מורכבת",
    tier: 1,
    hasAccess: false, // Max only
    isDefault: false,
    isFree: false,
  },
];

/**
 * Model access by tier
 */
const TIER_ACCESS: Record<string, string[]> = {
  free_trial: ["gemma-2-9b"],
  plus: ["gemma-2-9b", "mistral-small"],
  pro: ["gemma-2-9b", "mistral-small", "mistral-medium", "deepseek-v3"],
  max: ["gemma-2-9b", "mistral-small", "mistral-medium", "deepseek-v3", "kimi-k2"],
};

/**
 * Default models per tier
 */
const DEFAULT_MODELS: Record<string, string> = {
  free_trial: "gemma-2-9b",
  plus: "mistral-small",
  pro: "deepseek-v3",
  max: "kimi-k2",
};

/**
 * Props for ModelSelector
 */
interface ModelSelectorProps {
  selectedModel: string | null;
  onSelectModel: (modelId: string) => void;
  userTier?: string;
  disabled?: boolean;
}

/**
 * Get models with access info for a tier
 */
function getModelsForTier(tier: string): ModelInfo[] {
  const accessList = TIER_ACCESS[tier] || TIER_ACCESS.free_trial;
  const defaultModel = DEFAULT_MODELS[tier] || DEFAULT_MODELS.free_trial;

  return ALL_MODELS.map((model) => ({
    ...model,
    hasAccess: accessList.includes(model.id),
    isDefault: model.id === defaultModel,
  }));
}

/**
 * Tier badge colors
 */
const TIER_BADGES: Record<number, { label: string; labelHe: string; className: string }> = {
  1: { label: "Max", labelHe: "מקס", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" },
  2: { label: "Pro", labelHe: "פרו", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  3: { label: "Pro", labelHe: "פרו", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  4: { label: "Plus", labelHe: "פלוס", className: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" },
  5: { label: "Free", labelHe: "חינם", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

export function ModelSelector({
  selectedModel,
  onSelectModel,
  userTier = "free_trial",
  disabled = false,
}: ModelSelectorProps) {
  const { t, locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const models = getModelsForTier(userTier);
  const defaultModel = DEFAULT_MODELS[userTier] || "gemma-2-9b";
  const currentModel = selectedModel
    ? models.find((m) => m.id === selectedModel)
    : models.find((m) => m.id === defaultModel);

  const handleSelect = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    if (model?.hasAccess) {
      onSelectModel(modelId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <Icon name="smart_toy" className="text-primary text-lg" />
        <span className="text-sm font-medium text-foreground">
          {currentModel?.displayName || "Select Model"}
        </span>
        <Icon
          name="expand_more"
          className={`text-muted-foreground text-lg transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full mt-2 end-0 z-50 w-72 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                {locale === "he" ? "בחר מודל AI" : "Select AI Model"}
              </div>

              {/* Model List */}
              <div className="space-y-1">
                {models.map((model) => {
                  const badge = TIER_BADGES[model.tier];
                  const isSelected = (selectedModel || defaultModel) === model.id;

                  return (
                    <button
                      key={model.id}
                      onClick={() => handleSelect(model.id)}
                      disabled={!model.hasAccess}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-primary/10 border border-primary/30"
                          : model.hasAccess
                            ? "hover:bg-accent"
                            : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Lock icon for inaccessible models */}
                        {!model.hasAccess ? (
                          <Icon name="lock" className="text-muted-foreground text-lg shrink-0" />
                        ) : isSelected ? (
                          <Icon name="check_circle" className="text-primary text-lg shrink-0" />
                        ) : (
                          <div className="w-[18px]" />
                        )}

                        <div className="text-start min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate">
                              {model.displayName}
                            </span>
                            {model.isDefault && (
                              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                {locale === "he" ? "ברירת מחדל" : "Default"}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {locale === "he" ? model.descriptionHe : model.description}
                          </span>
                        </div>
                      </div>

                      {/* Tier badge */}
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.className}`}
                      >
                        {locale === "he" ? badge.labelHe : badge.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upgrade prompt for free tier */}
            {userTier === "free_trial" && (
              <div className="border-t border-border p-3 bg-muted/30">
                <div className="text-xs text-muted-foreground mb-2">
                  {locale === "he"
                    ? "שדרג לגישה למודלים מתקדמים יותר"
                    : "Upgrade for access to more powerful models"}
                </div>
                <a
                  href="/pricing"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
                >
                  <Icon name="upgrade" className="text-base" />
                  {locale === "he" ? "צפה בתוכניות" : "View Plans"}
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ModelSelector;

