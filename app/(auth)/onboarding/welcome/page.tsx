/**
 * Onboarding Step 1: Welcome
 *
 * Introduces the user to ZchuyotBuddy, explains what we'll ask,
 * provides language selection and terms acceptance.
 */

"use client";

import { useMutation } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { api } from "@/convex/_generated/api";
import { useToggleLocale, useTranslation } from "@/lib/i18n";

export default function WelcomePage() {
  const { locale } = useTranslation();
  const toggleLocale = useToggleLocale();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"he" | "en">(
    locale === "he" ? "he" : "en"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Sync language selection with current locale
  useEffect(() => {
    setSelectedLanguage(locale === "he" ? "he" : "en");
  }, [locale]);

  // Handle language change
  const handleLanguageChange = (lang: "he" | "en") => {
    setSelectedLanguage(lang);
    if ((lang === "he" && locale !== "he") || (lang === "en" && locale === "he")) {
      toggleLocale();
    }
  };

  // Handle continue
  const handleContinue = async () => {
    if (!termsAccepted) return;

    setIsLoading(true);
    try {
      // Save language preference and terms acceptance
      await updateProfile({
        preferredLanguage: selectedLanguage,
        termsAcceptedAt: Date.now(),
      });
      router.push("/onboarding/basic-info");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      // Still navigate even if save fails
      router.push("/onboarding/basic-info");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: "assignment",
      titleHe: "פרטים בסיסיים",
      titleEn: "Basic Information",
      descHe: "גיל, עיר מגורים, קופת חולים",
      descEn: "Age, city, health insurance",
    },
    {
      icon: "home",
      titleHe: "מצב חיים",
      titleEn: "Life Situation",
      descHe: "תעסוקה, שירות צבאי, מצב משפחתי",
      descEn: "Employment, military service, family status",
    },
    {
      icon: "accessibility",
      titleHe: "מוגבלויות",
      titleEn: "Disabilities",
      descHe: "סוגי מוגבלות ומידת החומרה",
      descEn: "Types and severity of disabilities",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/10 text-primary mb-4">
          <Icon name="waving_hand" className="text-5xl" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
          {locale === "he" ? "ברוכים הבאים לזכויות באדי!" : "Welcome to ZchuyotBuddy!"}
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {locale === "he"
            ? "נעזור לך למצוא את כל הזכויות שמגיעות לך"
            : "We'll help you find all the rights you're entitled to"}
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3 text-center">
          {locale === "he" ? "בחר שפה" : "Select Language"}
        </label>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleLanguageChange("he")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
              selectedLanguage === "he"
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-border hover:border-primary/50 text-foreground"
            }`}
          >
            <span className="text-lg">🇮🇱</span>
            <span>עברית</span>
          </button>
          <button
            onClick={() => handleLanguageChange("en")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
              selectedLanguage === "en"
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-border hover:border-primary/50 text-foreground"
            }`}
          >
            <span className="text-lg">🇺🇸</span>
            <span>English</span>
          </button>
        </div>
      </div>

      {/* What We'll Ask - Feature Cards */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground text-center mb-4">
          {locale === "he" ? "מה נשאל אותך:" : "What we'll ask:"}
        </h3>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
              <div className="size-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon name={feature.icon} className="text-2xl" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">
                  {locale === "he" ? feature.titleHe : feature.titleEn}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {locale === "he" ? feature.descHe : feature.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6">
        <Icon
          name="shield"
          className="text-green-600 dark:text-green-400 text-2xl shrink-0 mt-0.5"
        />
        <div>
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
            {locale === "he" ? "הפרטיות שלך מוגנת" : "Your privacy is protected"}
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            {locale === "he"
              ? "המידע שלך נשמר באופן מאובטח ומשמש רק לחיפוש זכויות רלוונטיות. אתה יכול למחוק את המידע בכל עת."
              : "Your information is stored securely and only used to find relevant rights. You can delete your data at any time."}
          </p>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="mb-8">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="peer sr-only"
            />
            <div
              className={`size-5 rounded border-2 transition-all flex items-center justify-center ${
                termsAccepted
                  ? "bg-primary border-primary"
                  : "border-border group-hover:border-primary/50"
              }`}
            >
              {termsAccepted && <Icon name="check" className="text-white text-sm" />}
            </div>
          </div>
          <span className="text-sm text-foreground">
            {locale === "he" ? (
              <>
                אני מסכים/ה ל
                <Link href="/terms" target="_blank" className="text-primary hover:underline mx-1">
                  תנאי השימוש
                </Link>
                ול
                <Link href="/privacy" target="_blank" className="text-primary hover:underline mx-1">
                  מדיניות הפרטיות
                </Link>
              </>
            ) : (
              <>
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </>
            )}
          </span>
        </label>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleContinue}
        disabled={!termsAccepted || isLoading}
        className="w-full h-14 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-primary"
      >
        {isLoading ? (
          <Icon name="progress_activity" className="text-xl animate-spin" />
        ) : (
          <>
            {locale === "he" ? "בוא נתחיל" : "Let's Get Started"}
            <Icon name="arrow_forward" className="text-xl rtl:rotate-180" />
          </>
        )}
      </button>

      {/* Disabled state hint */}
      {!termsAccepted && (
        <p className="text-center text-xs text-muted-foreground mt-3">
          {locale === "he"
            ? "יש לאשר את תנאי השימוש כדי להמשיך"
            : "Please accept the terms to continue"}
        </p>
      )}
    </div>
  );
}
