/**
 * Onboarding Step 2: Basic Info
 *
 * Collects age range, city, and HMO information.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";

const AGE_RANGES = [
  { value: "18-25", labelHe: "18-25", labelEn: "18-25" },
  { value: "26-35", labelHe: "26-35", labelEn: "26-35" },
  { value: "36-45", labelHe: "36-45", labelEn: "36-45" },
  { value: "46-55", labelHe: "46-55", labelEn: "46-55" },
  { value: "56-65", labelHe: "56-65", labelEn: "56-65" },
  { value: "65+", labelHe: "65+", labelEn: "65+" },
];

const HMOS = [
  { value: "clalit", labelHe: "כללית", labelEn: "Clalit" },
  { value: "maccabi", labelHe: "מכבי", labelEn: "Maccabi" },
  { value: "meuhedet", labelHe: "מאוחדת", labelEn: "Meuhedet" },
  { value: "leumit", labelHe: "לאומית", labelEn: "Leumit" },
];

export default function BasicInfoPage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [ageRange, setAgeRange] = useState<string>("");
  const [city, setCity] = useState("");
  const [hmo, setHmo] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        ageRange: ageRange || undefined,
        city: city || undefined,
        hmo: hmo || undefined,
      });
      router.push("/onboarding/situation");
    } catch (error) {
      console.error("Failed to save basic info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = ageRange && hmo; // City is optional

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
          <Icon name="person" className="text-3xl" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">
          {locale === "he" ? "פרטים בסיסיים" : "Basic Information"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "he"
            ? "כדי להתאים את הזכויות המתאימות לך"
            : "To match you with the right benefits"}
        </p>
      </div>

      {/* Age Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          {locale === "he" ? "טווח גילאים *" : "Age Range *"}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {AGE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setAgeRange(range.value)}
              className={`py-3 px-4 rounded-xl border text-center font-medium transition-all ${
                ageRange === range.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-foreground"
              }`}
            >
              {locale === "he" ? range.labelHe : range.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          {locale === "he" ? "עיר מגורים (לא חובה)" : "City (optional)"}
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={locale === "he" ? "הקלד את שם העיר" : "Enter your city"}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {locale === "he"
            ? "עוזר לנו למצוא הטבות מקומיות מהרשות המקומית שלך"
            : "Helps us find local benefits from your municipality"}
        </p>
      </div>

      {/* HMO */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-3">
          {locale === "he" ? "קופת חולים *" : "Health Insurance (HMO) *"}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {HMOS.map((option) => (
            <button
              key={option.value}
              onClick={() => setHmo(option.value)}
              className={`py-3 px-4 rounded-xl border text-center font-medium transition-all ${
                hmo === option.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-foreground"
              }`}
            >
              {locale === "he" ? option.labelHe : option.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!isValid || isSaving}
        className="w-full h-14 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-primary"
      >
        {isSaving ? (
          <Icon name="progress_activity" className="text-xl animate-spin" />
        ) : (
          <>
            {locale === "he" ? "המשך" : "Continue"}
            <Icon name="arrow_forward" className="text-xl rtl:rotate-180" />
          </>
        )}
      </button>
    </div>
  );
}

