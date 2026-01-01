"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type Locale = "en" | "he";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

// Import translation files
import enTranslations from "@/locales/en/common.json";
import heTranslations from "@/locales/he/common.json";

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<string, TranslationValue>;

const translations: Record<Locale, Translations> = {
  en: enTranslations as Translations,
  he: heTranslations as Translations,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("he");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && (saved === "en" || saved === "he")) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "he" ? "rtl" : "ltr";
    }
  }, [locale, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let value: unknown = translations[locale];
      
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key; // Return key if translation not found
        }
      }
      
      return typeof value === "string" ? value : key;
    },
    [locale]
  );

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    dir: locale === "he" ? "rtl" : "ltr",
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return ctx;
}

/**
 * next-intl-style helper to get a namespaced translator.
 * Example: const tNav = useTranslations("nav"); tNav("home") -> t("nav.home")
 */
export function useTranslations(namespace?: string) {
  const { t } = useTranslation();
  return useCallback(
    (key: string) => (namespace ? t(`${namespace}.${key}`) : t(key)),
    [namespace, t]
  );
}

export function useToggleLocale() {
  const { locale, setLocale } = useTranslation();
  return useCallback(() => {
    setLocale(locale === "en" ? "he" : "en");
  }, [locale, setLocale]);
}

export function useLocale() {
  const { locale } = useTranslation();
  return locale;
}

export function useDir() {
  const { dir } = useTranslation();
  return dir;
}

