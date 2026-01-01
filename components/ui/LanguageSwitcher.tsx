"use client";

/**
 * LanguageSwitcher Component
 *
 * A flexible language toggle component supporting multiple variants:
 * - toggle: Two buttons side by side (עב | EN)
 * - dropdown: Dropdown menu with flag and language name
 * - flags: Just flag icons with tooltips
 *
 * Features:
 * - Integrates with custom i18n context (lib/i18n.tsx)
 * - Persists preference to localStorage
 * - Saves to Convex user profile when signed in
 * - Supports controlled mode via value/onChange props
 * - Accessible with proper ARIA attributes
 * - Animated with Framer Motion
 */

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslation, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Globe } from "lucide-react";

type Locale = "he" | "en";

export interface LanguageSwitcherProps {
  /** Visual style variant */
  variant?: "toggle" | "dropdown" | "flags";
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Show text label alongside icon/flag */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Controlled value (if provided, component is controlled) */
  value?: Locale;
  /** Callback when language changes (required for controlled mode) */
  onChange?: (locale: Locale) => void;
}

const LANGUAGES = [
  { code: "he" as const, flag: "🇮🇱", label: "עברית", shortLabel: "עב" },
  { code: "en" as const, flag: "🇺🇸", label: "English", shortLabel: "EN" },
];

const sizeClasses = {
  sm: {
    toggle: "h-7 text-xs px-2",
    dropdown: "h-8 text-sm px-2",
    flags: "h-7 w-7 text-base",
    icon: "h-3 w-3",
  },
  md: {
    toggle: "h-9 text-sm px-3",
    dropdown: "h-10 text-sm px-3",
    flags: "h-9 w-9 text-lg",
    icon: "h-4 w-4",
  },
  lg: {
    toggle: "h-11 text-base px-4",
    dropdown: "h-12 text-base px-4",
    flags: "h-11 w-11 text-xl",
    icon: "h-5 w-5",
  },
};

export function LanguageSwitcher({
  variant = "toggle",
  size = "md",
  showLabel = true,
  className,
  value,
  onChange,
}: LanguageSwitcherProps) {
  const { isSignedIn } = useAuth();
  const { setLocale: setContextLocale } = useTranslation();
  const contextLocale = useLocale();
  const { t } = useTranslation();

  // Use controlled value if provided, otherwise use context
  const currentLocale = value ?? contextLocale;

  // Convex mutation for saving preference
  const updateProfile = useMutation(api.users.updateUserProfile);

  // Switch language handler
  const switchLanguage = useCallback(
    async (newLocale: Locale) => {
      // If controlled, just call onChange
      if (onChange) {
        onChange(newLocale);
        return;
      }

      // Update context (which also updates localStorage under "locale")
      setContextLocale(newLocale);

      // Also save under "preferred-language" for compatibility
      localStorage.setItem("preferred-language", newLocale);

      // Save to Convex if signed in (best-effort, swallow errors)
      if (isSignedIn) {
        try {
          await updateProfile({ preferredLanguage: newLocale });
        } catch {
          // Silently fail - localStorage is the source of truth for guests
        }
      }
    },
    [onChange, setContextLocale, isSignedIn, updateProfile]
  );

  const sizes = sizeClasses[size];

  // Toggle variant: Two buttons side by side
  if (variant === "toggle") {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-lg border border-border bg-muted/50 p-0.5",
          className
        )}
        role="radiogroup"
        aria-label={t("languageSwitcher.switchLanguage")}
      >
        {LANGUAGES.map((lang) => {
          const isActive = currentLocale === lang.code;
          return (
            <motion.button
              key={lang.code}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-current={isActive ? "true" : undefined}
              onClick={() => switchLanguage(lang.code)}
              className={cn(
                "relative rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                sizes.toggle,
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background for active state */}
              {isActive && (
                <motion.div
                  layoutId="language-toggle-bg"
                  className="absolute inset-0 rounded-md bg-primary"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {showLabel ? lang.shortLabel : lang.flag}
              </span>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant: Button showing current language with dropdown
  if (variant === "dropdown") {
    const currentLang = LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-border bg-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              sizes.dropdown,
              className
            )}
            aria-label={t("languageSwitcher.switchLanguage")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-base">{currentLang.flag}</span>
            {showLabel && <span className="font-medium">{currentLang.label}</span>}
            <ChevronDown className={cn(sizes.icon, "opacity-60")} />
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {LANGUAGES.map((lang) => {
            const isActive = currentLocale === lang.code;
            return (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className="flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Flags variant: Just flag icons
  if (variant === "flags") {
    return (
      <div
        className={cn("inline-flex items-center gap-1", className)}
        role="radiogroup"
        aria-label={t("languageSwitcher.switchLanguage")}
      >
        {LANGUAGES.map((lang) => {
          const isActive = currentLocale === lang.code;
          return (
            <motion.button
              key={lang.code}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-current={isActive ? "true" : undefined}
              aria-label={lang.label}
              title={lang.label}
              onClick={() => switchLanguage(lang.code)}
              className={cn(
                "relative flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                sizes.flags,
                isActive
                  ? "bg-primary/10 ring-2 ring-primary ring-offset-1"
                  : "hover:bg-accent opacity-60 hover:opacity-100"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={lang.code}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {lang.flag}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    );
  }

  return null;
}

/**
 * Compact globe icon that toggles between languages
 * Useful for headers/navbars with limited space
 */
export function LanguageToggleIcon({
  size = "md",
  className,
}: Pick<LanguageSwitcherProps, "size" | "className">) {
  const { setLocale } = useTranslation();
  const locale = useLocale();
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const updateProfile = useMutation(api.users.updateUserProfile);

  const toggleLanguage = useCallback(async () => {
    const newLocale = locale === "he" ? "en" : "he";
    setLocale(newLocale);
    localStorage.setItem("preferred-language", newLocale);

    if (isSignedIn) {
      try {
        await updateProfile({ preferredLanguage: newLocale });
      } catch {
        // Silently fail
      }
    }
  }, [locale, setLocale, isSignedIn, updateProfile]);

  const sizes = sizeClasses[size];
  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <motion.button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        sizes.flags,
        className
      )}
      aria-label={`${t("languageSwitcher.switchLanguage")} - ${t("languageSwitcher.currentLanguage")}: ${currentLang.label}`}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.95 }}
    >
      <Globe className={sizes.icon} />
    </motion.button>
  );
}

export default LanguageSwitcher;

