/**
 * Onboarding Step 1: Welcome
 *
 * Introduces the user to ZchuyotBuddy and explains what they'll get.
 */

"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";

export default function WelcomePage() {
  const { locale } = useTranslation();
  const router = useRouter();

  const features = [
    {
      icon: "search",
      titleHe: "גלה את הזכויות שלך",
      titleEn: "Discover Your Rights",
      descHe: "נעזור לך למצוא את כל ההטבות והזכויות שמגיעות לך",
      descEn: "We'll help you find all the benefits and rights you're entitled to",
    },
    {
      icon: "checklist",
      titleHe: "רשימות משימות מותאמות",
      titleEn: "Personalized Checklists",
      descHe: "קבל הנחיות צעד אחר צעד לממש את הזכויות שלך",
      descEn: "Get step-by-step guidance to claim your rights",
    },
    {
      icon: "notifications",
      titleHe: "התראות ועדכונים",
      titleEn: "Alerts & Updates",
      descHe: "נודיע לך על שינויים בחוק וזכויות חדשות",
      descEn: "We'll notify you about law changes and new rights",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/10 text-primary mb-4">
          <Icon name="waving_hand" className="text-5xl" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
          {locale === "he" ? "ברוכים הבאים!" : "Welcome!"}
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {locale === "he"
            ? "בוא נכיר אותך כדי שנוכל למצוא את כל הזכויות שמגיעות לך"
            : "Let's get to know you so we can find all the rights you're entitled to"}
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl"
          >
            <div className="size-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Icon name={feature.icon} className="text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">
                {locale === "he" ? feature.titleHe : feature.titleEn}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === "he" ? feature.descHe : feature.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy note */}
      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-8">
        <Icon name="shield" className="text-green-600 dark:text-green-400 text-2xl" />
        <div>
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            {locale === "he" ? "הפרטיות שלך מוגנת" : "Your privacy is protected"}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">
            {locale === "he"
              ? "המידע שלך מוצפן ולא משותף עם גורמים חיצוניים"
              : "Your data is encrypted and never shared with third parties"}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => router.push("/onboarding/basic-info")}
        className="w-full h-14 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-primary"
      >
        {locale === "he" ? "בוא נתחיל" : "Let's Get Started"}
        <Icon name="arrow_forward" className="text-xl rtl:rotate-180" />
      </button>
    </div>
  );
}

