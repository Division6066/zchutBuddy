"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export function UsageDashboard() {
  const usageSummary = useQuery(api.usageTracking.getUsageSummary);

  if (!usageSummary) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-48" />
    );
  }

  const percentUsed = usageSummary.apiUsagePercent || 0;
  const isNearLimit = percentUsed >= 40;
  const isAtLimit = percentUsed >= 60;

  // Calculate cap percentages for markers
  const softCapPercent = 40;
  const hardCapPercent = 60;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          📊 שימוש חודשי
        </h2>
        <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full font-medium">
          {usageSummary.tierNameHe || usageSummary.tierName}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-300">
            קרדיטים בשימוש
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            ₪{usageSummary.apiCreditsUsed?.toFixed(2)} / ₪{usageSummary.apiCreditsLimit?.toFixed(2)}
          </span>
        </div>

        <div className="relative">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-primary"
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>

          {/* Cap markers */}
          <div className="absolute top-0 left-0 right-0 h-4 pointer-events-none">
            <div
              className="absolute top-0 w-0.5 h-full bg-amber-500/70"
              style={{ right: `${100 - softCapPercent}%` }}
              title="מגבלה רכה (40%)"
            />
            <div
              className="absolute top-0 w-0.5 h-full bg-red-500/70"
              style={{ right: `${100 - hardCapPercent}%` }}
              title="מגבלה קשיחה (60%)"
            />
          </div>
        </div>

        {/* Cap labels */}
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>0%</span>
          <span className="text-amber-500">40%</span>
          <span className="text-red-500">60%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Warnings */}
      {usageSummary.softCapReached && !usageSummary.hardCapReached && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ הגעת ל-40% מתקציב ה-API. שקול לשדרג.
          </p>
        </div>
      )}

      {usageSummary.hardCapReached && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            🛑 הגעת למגבלת השימוש. שדרג כדי להמשיך.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">טוקנים בשימוש</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {usageSummary.totalTokensUsed?.toLocaleString() || 0}
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">נותר</p>
          <p className="text-lg font-bold text-primary">
            ₪{((usageSummary.apiCreditsLimit || 0) - (usageSummary.apiCreditsUsed || 0)).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Deep Research Usage */}
      {usageSummary.crawlCreditsLimit !== "unlimited" && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">מחקרים מעמיקים</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {usageSummary.crawlCreditsUsed} / {usageSummary.crawlCreditsLimit}
            </p>
          </div>
        </div>
      )}

      {/* Period info */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        {usageSummary.daysRemaining !== undefined && (
          <span>נותרו {usageSummary.daysRemaining} ימים בתקופה הנוכחית</span>
        )}
      </div>

      {/* Upgrade CTA */}
      {usageSummary.tier !== "max" && (
        <Link
          href="/pricing"
          className="block mt-4 text-center py-2 bg-primary text-white rounded-lg font-medium 
                     hover:bg-primary/90 transition-colors"
        >
          שדרג את התוכנית
        </Link>
      )}
    </div>
  );
}

