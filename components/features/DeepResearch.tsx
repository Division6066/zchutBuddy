"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DeepResearch() {
  const [query, setQuery] = useState("");
  const [isResearching, setIsResearching] = useState(false);

  const usageSummary = useQuery(api.usageTracking.getUsageSummary);

  // Check if deep research is available for this tier
  const tier = usageSummary?.tier || "free_trial";
  const isAvailable = tier !== "free_trial";

  // Calculate remaining researches
  const crawlLimit = usageSummary?.crawlCreditsLimit;
  const crawlUsed = usageSummary?.crawlCreditsUsed || 0;
  const remainingResearches =
    crawlLimit === "unlimited" ? -1 : typeof crawlLimit === "number" ? crawlLimit - crawlUsed : 0;

  const handleResearch = async () => {
    if (!isAvailable) {
      alert("שדרג את התוכנית שלך כדי להשתמש במחקר מעמיק");
      return;
    }

    if (remainingResearches === 0) {
      alert("הגעת למגבלת המחקרים החודשית");
      return;
    }

    setIsResearching(true);
    // TODO: Connect to Firecrawl API
    // TODO: Use AI to synthesize findings
    setTimeout(() => {
      setIsResearching(false);
      alert("מחקר מעמיק עדיין בפיתוח");
    }, 2000);
  };

  if (!usageSummary) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-64" />
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          🔬 מחקר מעמיק
        </h2>
        {!isAvailable && (
          <span className="px-3 py-1 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 rounded-full">
            Plus+ בלבד
          </span>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        חפש מידע מקיף על זכויות ספציפיות עם מקורות מאומתים
      </p>

      <div className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="לדוגמה: מה כל הזכויות לנכה 50% משרד הביטחון?"
          className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg resize-none h-24 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder:text-gray-400 dark:placeholder:text-gray-500
                     focus:ring-2 focus:ring-primary focus:border-transparent
                     disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          disabled={!isAvailable || isResearching}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {remainingResearches === -1
              ? "ללא הגבלה"
              : `נותרו ${remainingResearches} מחקרים החודש`}
          </span>

          <button
            onClick={handleResearch}
            disabled={!isAvailable || isResearching || !query.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium
                       hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 
                       disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-400
                       flex items-center gap-2 transition-colors"
          >
            {isResearching ? (
              <>
                <span className="animate-spin">⏳</span>
                מחפש...
              </>
            ) : (
              <>
                🔍 התחל מחקר
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results area - placeholder */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          תוצאות המחקר יופיעו כאן
        </p>
      </div>
    </div>
  );
}

