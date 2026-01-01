/**
 * CapWarning Component
 *
 * Shows usage cap warnings (soft cap at 40%, hard cap at 60%).
 * Yellow banner for soft cap, red blocking banner for hard cap.
 *
 * Features:
 * - Fixed positioning option (bottom of screen or top of chat)
 * - Slide-in animation from bottom
 * - Pulse effect on hard cap banner
 * - Soft cap is dismissible (reappears tomorrow)
 * - Shows days until reset
 */

"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";

interface CapWarningProps {
  onUpgrade?: () => void;
  className?: string;
  position?: "inline" | "fixed-bottom" | "fixed-top";
  showDaysRemaining?: boolean;
}

// Key for localStorage to track dismissed soft cap warnings
const SOFT_CAP_DISMISSED_KEY = "capWarning_softCap_dismissed";

export function CapWarning({
  onUpgrade,
  className = "",
  position = "inline",
  showDaysRemaining = true,
}: CapWarningProps) {
  const { locale } = useTranslation();
  const usageCaps = useQuery(api.usageTracking.checkUsageCaps);
  const capStatus = useQuery(api.usageTracking.getCapStatus);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  // Check if soft cap was dismissed today
  useEffect(() => {
    const dismissed = localStorage.getItem(SOFT_CAP_DISMISSED_KEY);
    if (dismissed) {
      const dismissedDate = new Date(dismissed).toDateString();
      const today = new Date().toDateString();
      // Reshow tomorrow
      if (dismissedDate === today) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem(SOFT_CAP_DISMISSED_KEY);
      }
    }

    // Trigger animation after mount
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Don't render if no data or no caps reached
  if (!usageCaps || (!usageCaps.softCapReached && !usageCaps.hardCapReached)) {
    return null;
  }

  // Don't render soft cap if dismissed
  if (usageCaps.softCapReached && !usageCaps.hardCapReached && isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(SOFT_CAP_DISMISSED_KEY, new Date().toISOString());
  };

  const daysRemaining = capStatus?.daysUntilReset || 0;
  const percentUsed = capStatus?.percentUsed || 0;

  // Position styles
  const positionStyles = {
    inline: "",
    "fixed-bottom":
      "fixed bottom-0 left-0 right-0 z-50 md:bottom-4 md:left-4 md:right-4 md:max-w-lg",
    "fixed-top": "fixed top-0 left-0 right-0 z-50",
  };

  // Animation styles
  const animationStyles =
    position !== "inline" && isAnimated
      ? "translate-y-0 opacity-100"
      : position !== "inline"
        ? "translate-y-full opacity-0"
        : "";

  // Hard cap reached - blocking banner
  if (usageCaps.hardCapReached) {
    return (
      <div
        className={`
          p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
          ${position === "inline" ? "rounded-xl" : "md:rounded-xl"}
          ${positionStyles[position]}
          ${animationStyles}
          transition-all duration-500 ease-out
          ${className}
        `}
      >
        {/* Pulse animation overlay */}
        <div className="absolute inset-0 bg-red-500/10 rounded-xl animate-pulse pointer-events-none" />

        <div className="flex items-start gap-3 relative">
          <div className="size-10 shrink-0 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center animate-bounce">
            <Icon name="error" className="text-red-600 dark:text-red-400 text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-red-800 dark:text-red-200 mb-1">
              {locale === "he" ? "הגעת למגבלת השימוש" : "Usage Limit Reached"}
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              {locale === "he"
                ? `השתמשת ב-${percentUsed}% מתקציב ה-API החודשי. שדרג כדי להמשיך.`
                : `You've used ${percentUsed}% of your monthly API budget. Upgrade to continue.`}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/pricing"
                onClick={onUpgrade}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg"
              >
                <Icon name="upgrade" className="text-base" />
                {locale === "he" ? "שדרג עכשיו" : "Upgrade Now"}
              </Link>
              {showDaysRemaining && daysRemaining > 0 && (
                <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <Icon name="schedule" className="text-sm" />
                  {locale === "he"
                    ? `איפוס בעוד ${daysRemaining} ימים`
                    : `Resets in ${daysRemaining} days`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Soft cap reached - warning banner (dismissible)
  return (
    <div
      className={`
        p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 
        ${position === "inline" ? "rounded-xl" : "md:rounded-xl"}
        ${positionStyles[position]}
        ${animationStyles}
        transition-all duration-500 ease-out
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="size-10 shrink-0 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
          <Icon name="warning" className="text-yellow-600 dark:text-yellow-400 text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-1">
              {locale === "he" ? "אזהרת שימוש" : "Usage Warning"}
            </h4>
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-lg transition-colors"
              aria-label={locale === "he" ? "סגור" : "Dismiss"}
            >
              <Icon name="close" className="text-yellow-600 dark:text-yellow-400 text-lg" />
            </button>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
            {locale === "he"
              ? `השתמשת ב-${percentUsed}% מהתקציב החודשי. שקול לשדרג למניעת הגבלות.`
              : `You've used ${percentUsed}% of your monthly budget. Consider upgrading to avoid limits.`}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Link
              href="/pricing"
              onClick={onUpgrade}
              className="inline-flex items-center gap-1 text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:underline"
            >
              {locale === "he" ? "צפה בתוכניות" : "View Plans"}
              <Icon name="arrow_forward" className="text-base rtl:rotate-180" />
            </Link>
            {showDaysRemaining && daysRemaining > 0 && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                <Icon name="schedule" className="text-sm" />
                {locale === "he"
                  ? `איפוס בעוד ${daysRemaining} ימים`
                  : `Resets in ${daysRemaining} days`}
              </span>
            )}
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
  const capStatus = useQuery(api.usageTracking.getCapStatus);

  if (!usageCaps?.softCapReached) {
    return null;
  }

  const isHardCap = usageCaps.hardCapReached;
  const percentUsed = capStatus?.percentUsed || 0;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
        isHardCap
          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 animate-pulse"
          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
      } ${className}`}
    >
      <Icon name={isHardCap ? "error" : "warning"} className="text-sm" />
      <span>{locale === "he" ? `${percentUsed}% נוצל` : `${percentUsed}% used`}</span>
      <Link href="/pricing" className="underline hover:no-underline">
        {locale === "he" ? "שדרג" : "Upgrade"}
      </Link>
    </div>
  );
}

/**
 * Fixed bottom banner version that slides up
 */
export function CapWarningFixed() {
  return <CapWarning position="fixed-bottom" />;
}

/**
 * Mini version for sidebar or compact spaces
 */
export function CapWarningMini({ className = "" }: { className?: string }) {
  const { locale } = useTranslation();
  const usageCaps = useQuery(api.usageTracking.checkUsageCaps);
  const capStatus = useQuery(api.usageTracking.getCapStatus);

  if (!usageCaps?.softCapReached) {
    return null;
  }

  const isHardCap = usageCaps.hardCapReached;
  const percentUsed = capStatus?.percentUsed || 0;
  const daysRemaining = capStatus?.daysUntilReset || 0;

  return (
    <Link
      href="/pricing"
      className={`
        flex items-center gap-2 p-3 rounded-xl transition-colors
        ${
          isHardCap
            ? "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50"
            : "bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
        }
        ${className}
      `}
    >
      <div
        className={`
          size-8 rounded-full flex items-center justify-center
          ${isHardCap ? "bg-red-200 dark:bg-red-800" : "bg-yellow-200 dark:bg-yellow-800"}
        `}
      >
        <Icon
          name={isHardCap ? "error" : "warning"}
          className={`
            text-lg
            ${isHardCap ? "text-red-600 dark:text-red-300" : "text-yellow-600 dark:text-yellow-300"}
          `}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`
            text-sm font-medium truncate
            ${isHardCap ? "text-red-800 dark:text-red-200" : "text-yellow-800 dark:text-yellow-200"}
          `}
        >
          {percentUsed}% {locale === "he" ? "מהתקציב נוצל" : "budget used"}
        </p>
        <p
          className={`
            text-xs truncate
            ${isHardCap ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}
          `}
        >
          {daysRemaining > 0
            ? locale === "he"
              ? `איפוס בעוד ${daysRemaining} ימים`
              : `Resets in ${daysRemaining} days`
            : locale === "he"
              ? "איפוס היום"
              : "Resets today"}
        </p>
      </div>
      <Icon
        name="chevron_right"
        className={`
          text-lg rtl:rotate-180
          ${isHardCap ? "text-red-500 dark:text-red-400" : "text-yellow-500 dark:text-yellow-400"}
        `}
      />
    </Link>
  );
}

export default CapWarning;
