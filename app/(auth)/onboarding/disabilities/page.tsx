/**
 * Onboarding Step 4: Disabilities
 *
 * Collects disability information for benefits matching.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";

const DISABILITY_TYPES = [
  { value: "mobility", labelHe: "ניידות", labelEn: "Mobility", icon: "accessible" },
  { value: "vision", labelHe: "ראייה", labelEn: "Vision", icon: "visibility_off" },
  { value: "hearing", labelHe: "שמיעה", labelEn: "Hearing", icon: "hearing_disabled" },
  { value: "cognitive", labelHe: "קוגניטיבית", labelEn: "Cognitive", icon: "psychology" },
  { value: "mental", labelHe: "נפשית", labelEn: "Mental Health", icon: "sentiment_dissatisfied" },
  { value: "chronic", labelHe: "מחלה כרונית", labelEn: "Chronic Illness", icon: "medical_services" },
  { value: "developmental", labelHe: "התפתחותית", labelEn: "Developmental", icon: "child_care" },
  { value: "other", labelHe: "אחר", labelEn: "Other", icon: "more_horiz" },
];

const SEVERITY_OPTIONS = [
  { value: "mild", labelHe: "קל", labelEn: "Mild", color: "text-green-600 dark:text-green-400" },
  { value: "moderate", labelHe: "בינוני", labelEn: "Moderate", color: "text-yellow-600 dark:text-yellow-400" },
  { value: "severe", labelHe: "קשה", labelEn: "Severe", color: "text-red-600 dark:text-red-400" },
];

export default function DisabilitiesPage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [hasDisability, setHasDisability] = useState<boolean | null>(null);
  const [disabilities, setDisabilities] = useState<string[]>([]);
  const [severity, setSeverity] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleDisability = (value: string) => {
    setDisabilities((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        disabilities: hasDisability ? disabilities : [],
        disabilitySeverity: hasDisability && severity ? severity : undefined,
      });
      router.push("/onboarding/review");
    } catch (error) {
      console.error("Failed to save disabilities:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = hasDisability === false || (hasDisability === true && disabilities.length > 0);

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
          <Icon name="accessibility" className="text-3xl" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">
          {locale === "he" ? "מצב בריאותי" : "Health Situation"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "he"
            ? "מידע זה עוזר לנו למצוא זכויות ייחודיות עבורך"
            : "This information helps us find unique benefits for you"}
        </p>
      </div>

      {/* Privacy Note */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-6">
        <Icon name="lock" className="text-blue-600 dark:text-blue-400 text-xl" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {locale === "he"
            ? "מידע זה שמור באופן מוצפן ולא משותף עם אף גורם"
            : "This information is encrypted and never shared"}
        </p>
      </div>

      {/* Has Disability Question */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          {locale === "he" ? "האם יש לך מוגבלות או מצב בריאותי?" : "Do you have a disability or health condition?"}
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setHasDisability(true)}
            className={`flex-1 py-4 rounded-xl border font-medium transition-all ${
              hasDisability === true
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50 text-foreground"
            }`}
          >
            {locale === "he" ? "כן" : "Yes"}
          </button>
          <button
            onClick={() => {
              setHasDisability(false);
              setDisabilities([]);
              setSeverity("");
            }}
            className={`flex-1 py-4 rounded-xl border font-medium transition-all ${
              hasDisability === false
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50 text-foreground"
            }`}
          >
            {locale === "he" ? "לא" : "No"}
          </button>
        </div>
      </div>

      {/* Disability Types (only if hasDisability) */}
      {hasDisability && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              {locale === "he" ? "סוג המוגבלות (ניתן לבחור מספר)" : "Type of disability (select multiple)"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DISABILITY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => toggleDisability(type.value)}
                  className={`flex items-center gap-2 py-3 px-4 rounded-xl border text-start font-medium transition-all ${
                    disabilities.includes(type.value)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  <Icon
                    name={type.icon}
                    className={`text-xl ${
                      disabilities.includes(type.value) ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-sm">{locale === "he" ? type.labelHe : type.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          {disabilities.length > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">
                {locale === "he" ? "דרגת חומרה (לא חובה)" : "Severity (optional)"}
              </label>
              <div className="flex gap-2">
                {SEVERITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSeverity(option.value)}
                    className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                      severity === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {locale === "he" ? option.labelHe : option.labelEn}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={hasDisability === null || !isValid || isSaving}
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

      {/* Skip option */}
      <button
        onClick={() => router.push("/onboarding/review")}
        className="w-full mt-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {locale === "he" ? "אעדיף לא לענות" : "I prefer not to answer"}
      </button>
    </div>
  );
}

