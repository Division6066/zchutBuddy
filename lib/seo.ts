/**
 * SEO Utilities for ZchuyotBuddy
 *
 * Provides page-specific metadata registry and helper functions
 * for generating SEO metadata in both Hebrew and English.
 */

import type { Metadata } from "next";

type Locale = "he" | "en";

/**
 * SEO configuration for a single page
 */
interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * SEO configuration for both locales
 */
type PageSEOByLocale = {
  he: PageSEO;
  en: PageSEO;
};

/**
 * Registry of page-specific SEO metadata
 */
export const PAGE_SEO: Record<string, PageSEOByLocale> = {
  home: {
    he: {
      title: "זכויות באדי | מצא את הזכויות שמגיעות לך",
      description:
        "פלטפורמת AI לניווט זכויות נכים בישראל. גלה הטבות מביטוח לאומי, משרד הביטחון ועוד.",
      keywords: ["זכויות נכים", "ביטוח לאומי", "קצבת נכות", "הטבות לנכים"],
      ogImage: "/og-home-he.png",
    },
    en: {
      title: "ZchuyotBuddy | Find Your Israeli Benefits",
      description:
        "AI-powered platform for navigating disability rights in Israel. Discover benefits from Bituach Leumi, Ministry of Defense, and more.",
      keywords: ["Israeli disability benefits", "Bituach Leumi", "disability rights"],
      ogImage: "/og-home-en.png",
    },
  },
  rights: {
    he: {
      title: "מצא זכויות",
      description: "חפש וגלה את כל הזכויות וההטבות שמגיעות לך מהמדינה",
      keywords: ["חיפוש זכויות", "הטבות ממשלתיות", "זכויות נכים", "ביטוח לאומי"],
      ogImage: "/og-rights-he.png",
    },
    en: {
      title: "Find Rights",
      description: "Search and discover all government benefits you are entitled to",
      keywords: ["find benefits", "government rights", "disability benefits", "Israeli benefits"],
      ogImage: "/og-rights-en.png",
    },
  },
  chat: {
    he: {
      title: "צ'אט AI",
      description: "שוחח עם AI חכם שעוזר לך למצוא את הזכויות שלך",
      keywords: ["צ'אט AI", "עזרה בזכויות", "שאלות ותשובות"],
    },
    en: {
      title: "AI Chat",
      description: "Chat with an AI assistant to help find your benefits",
      keywords: ["AI chat", "benefits help", "questions answers"],
    },
  },
  pricing: {
    he: {
      title: "מחירים",
      description: "בחר את התוכנית המתאימה לך - התחל בחינם",
      keywords: ["מחירים", "תוכניות", "מנוי", "חינם"],
      ogImage: "/og-pricing-he.png",
    },
    en: {
      title: "Pricing",
      description: "Choose the plan that fits you - Start for free",
      keywords: ["pricing", "plans", "subscription", "free trial"],
      ogImage: "/og-pricing-en.png",
    },
  },
  about: {
    he: {
      title: "אודות",
      description: "למד עוד על זכויות באדי והמשימה שלנו לעזור לאזרחי ישראל",
      keywords: ["אודות", "מי אנחנו", "המשימה שלנו"],
    },
    en: {
      title: "About",
      description: "Learn more about ZchuyotBuddy and our mission to help Israeli citizens",
      keywords: ["about", "who we are", "our mission"],
    },
  },
  contact: {
    he: {
      title: "צור קשר",
      description: "יש לך שאלות? צור איתנו קשר - אנחנו כאן לעזור",
      keywords: ["צור קשר", "שאלות", "תמיכה"],
    },
    en: {
      title: "Contact",
      description: "Have questions? Contact us - we're here to help",
      keywords: ["contact", "questions", "support"],
    },
  },
  faq: {
    he: {
      title: "שאלות נפוצות",
      description: "תשובות לשאלות הנפוצות ביותר על זכויות ושירותים בישראל",
      keywords: ["שאלות נפוצות", "FAQ", "עזרה", "תשובות"],
    },
    en: {
      title: "FAQ",
      description:
        "Answers to the most frequently asked questions about rights and services in Israel",
      keywords: ["FAQ", "frequently asked questions", "help", "answers"],
    },
  },
  onboarding: {
    he: {
      title: "יצירת פרופיל",
      description: "ספר לנו על עצמך כדי שנוכל למצוא את הזכויות המתאימות לך",
      noIndex: true, // Don't index onboarding pages
    },
    en: {
      title: "Create Profile",
      description: "Tell us about yourself so we can find the right benefits for you",
      noIndex: true,
    },
  },
  dashboard: {
    he: {
      title: "לוח בקרה",
      description: "נהל את הזכויות שלך במקום אחד",
      noIndex: true,
    },
    en: {
      title: "Dashboard",
      description: "Manage your benefits in one place",
      noIndex: true,
    },
  },
  profile: {
    he: {
      title: "פרופיל",
      description: "הגדרות הפרופיל שלך",
      noIndex: true,
    },
    en: {
      title: "Profile",
      description: "Your profile settings",
      noIndex: true,
    },
  },
  settings: {
    he: {
      title: "הגדרות",
      description: "הגדרות החשבון שלך",
      noIndex: true,
    },
    en: {
      title: "Settings",
      description: "Your account settings",
      noIndex: true,
    },
  },
  alerts: {
    he: {
      title: "התראות",
      description: "התראות ועדכונים על הזכויות שלך",
      noIndex: true,
    },
    en: {
      title: "Alerts",
      description: "Alerts and updates about your benefits",
      noIndex: true,
    },
  },
  terms: {
    he: {
      title: "תנאי שימוש",
      description: "תנאי השימוש באתר זכויות באדי",
    },
    en: {
      title: "Terms of Service",
      description: "Terms of service for ZchuyotBuddy website",
    },
  },
  privacy: {
    he: {
      title: "מדיניות פרטיות",
      description: "מדיניות הפרטיות של זכויות באדי",
    },
    en: {
      title: "Privacy Policy",
      description: "Privacy policy for ZchuyotBuddy",
    },
  },
  accessibility: {
    he: {
      title: "הצהרת נגישות",
      description: "מחויבותנו לנגישות דיגיטלית",
    },
    en: {
      title: "Accessibility Statement",
      description: "Our commitment to digital accessibility",
    },
  },
};

/**
 * Get page-specific metadata for Next.js
 *
 * @param page - Page key from PAGE_SEO
 * @param locale - Target locale ('he' or 'en')
 * @returns Metadata object for Next.js
 *
 * @example
 * // In app/(marketing)/pricing/page.tsx
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const locale = params.locale || 'he';
 *   return getPageMetadata('pricing', locale);
 * }
 */
export function getPageMetadata(page: keyof typeof PAGE_SEO, locale: Locale): Metadata {
  const seo = PAGE_SEO[page]?.[locale] || PAGE_SEO[page]?.he;

  if (!seo) {
    return {
      title: locale === "he" ? "זכויות באדי" : "ZchuyotBuddy",
    };
  }

  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
      locale: locale === "he" ? "he_IL" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };

  if (seo.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

/**
 * Generate alternate links for language switching
 *
 * @param path - Current page path (without locale prefix)
 * @param baseUrl - Base URL of the site
 * @returns Alternates object for Next.js metadata
 */
export function getAlternateLinks(path: string, baseUrl = "https://zchuyotbuddy.com") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return {
    canonical: `${baseUrl}/he${cleanPath}`,
    languages: {
      "he-IL": `${baseUrl}/he${cleanPath}`,
      "en-US": `${baseUrl}/en${cleanPath}`,
    },
  };
}

/**
 * Merge page metadata with defaults
 *
 * @param pageMetadata - Page-specific metadata
 * @param defaults - Default metadata to merge with
 * @returns Merged metadata object
 */
export function mergeMetadata(pageMetadata: Metadata, defaults: Metadata): Metadata {
  return {
    ...defaults,
    ...pageMetadata,
    openGraph: {
      ...defaults.openGraph,
      ...pageMetadata.openGraph,
    },
    twitter: {
      ...defaults.twitter,
      ...pageMetadata.twitter,
    },
  };
}

export type { PageSEO, PageSEOByLocale, Locale };
