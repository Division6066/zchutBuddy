/**
 * CapWarning Component
 *
 * Shows usage cap warnings (soft cap at 40%, hard cap at 60%).
 * Yellow banner for soft cap, red blocking banner for hard cap.
 */

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";

interface CapWarningProps {
  onUpgrade?: () => void;
  className?: string;
}

export function CapWarning({ onUpgrade, className = "" }: CapWarningProps) {
  const { locale } = useTranslation();
  const usageCaps = useQuery(api.usageTracking.checkUsageCaps);

  // Don't render if no data or no caps reached
  if (!usageCaps || (!usageCaps.softCapReached && !usageCaps.hardCapReached)) {
    return null;
  }

  // Hard cap reached - blocking banner
  if (usageCaps.hardCapReached) {
    return (
      <div className={`p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl ${className}`}>
        <div className="flex items-start gap-3">
          <div className="size-10 shrink-0 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <Icon name="error" className="text-red-600 dark:text-red-400 text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-red-800 dark:text-red-200 mb-1">
              {locale === "he" ? "הגעת למגבלת השימוש" : "Usage Limit Reached"}
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              {locale === "he"
                ? "השתמשת ב-60% מתקציב ה-API החודשי שלך. שדרג את התוכנית כדי להמשיך להשתמש בשירות."
                : "You've used 60% of your monthly API budget. Upgrade your plan to continue using the service."}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="/pricing"
                onClick={onUpgrade}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
              >
                <Icon name="upgrade" className="text-base" />
                {locale === "he" ? "שדרג עכשיו" : "Upgrade Now"}
              </a>
              <span className="text-xs text-red-600 dark:text-red-400">
                {locale === "he"
                  ? `${usageCaps.currentUsage?.toFixed(2) || 0} מתוך ₪${usageCaps.totalBudget?.toFixed(2) || 0}`
                  : `₪${usageCaps.currentUsage?.toFixed(2) || 0} of ₪${usageCaps.totalBudget?.toFixed(2) || 0}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Soft cap reached - warning banner
  return (
    <div className={`p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl ${className}`}>
      <div className="flex items-start gap-3">
        <div className="size-10 shrink-0 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
          <Icon name="warning" className="text-yellow-600 dark:text-yellow-400 text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-1">
            {locale === "he" ? "אזהרת שימוש" : "Usage Warning"}
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
            {locale === "he"
              ? "השתמשת ב-40% מתקציב ה-API החודשי שלך. שקול לשדרג את התוכנית להמשך שימוש ללא הפרעות."
              : "You've used 40% of your monthly API budget. Consider upgrading for uninterrupted service."}
          </p>
          <div className="flex items-center justify-between">
            <a
              href="/pricing"
              onClick={onUpgrade}
              className="inline-flex items-center gap-1 text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:underline"
            >
              {locale === "he" ? "צפה בתוכניות" : "View Plans"}
              <Icon name="arrow_forward" className="text-base rtl:rotate-180" />
            </a>
            <span className="text-xs text-yellow-600 dark:text-yellow-400">
              {locale === "he"
                ? `${usageCaps.currentUsage?.toFixed(2) || 0} מתוך ₪${usageCaps.totalBudget?.toFixed(2) || 0}`
                : `₪${usageCaps.currentUsage?.toFixed(2) || 0} of ₪${usageCaps.totalBudget?.toFixed(2) || 0}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline version for use in chat interfaces
 */
export function CapWarningInline({ className = "" }: { className?: string }) {
  const { locale } = useTranslation();
  const usageCaps = useQuery(api.usageTracking.checkUsageCaps);

  if (!usageCaps?.softCapReached) {
    return null;
  }

  const isHardCap = usageCaps.hardCapReached;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
        isHardCap
          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
      } ${className}`}
    >
      <Icon name={isHardCap ? "error" : "warning"} className="text-sm" />
      <span>
        {isHardCap
          ? locale === "he"
            ? "מגבלת שימוש"
            : "Usage limit"
          : locale === "he"
            ? "40% נוצל"
            : "40% used"}
      </span>
      <a
        href="/pricing"
        className="underline hover:no-underline"
      >
        {locale === "he" ? "שדרג" : "Upgrade"}
      </a>
    </div>
  );
}

export default CapWarning;

