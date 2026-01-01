/**
 * Onboarding Step 4: Disabilities
 *
 * Collects disability information with multi-select categories,
 * severity per category, recognized percentage, and recognizing body.
 */

"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";

const DISABILITY_TYPES = [
  { value: "mobility", labelHe: "ניידות", labelEn: "Mobility", icon: "accessible" },
  { value: "vision", labelHe: "ראייה", labelEn: "Vision", icon: "visibility_off" },
  { value: "hearing", labelHe: "שמיעה", labelEn: "Hearing", icon: "hearing_disabled" },
  { value: "cognitive", labelHe: "קוגניטיבי", labelEn: "Cognitive", icon: "psychology" },
  {
    value: "mental",
    labelHe: "בריאות הנפש",
    labelEn: "Mental Health",
    icon: "sentiment_dissatisfied",
  },
  {
    value: "chronic",
    labelHe: "מחלה כרונית",
    labelEn: "Chronic Illness",
    icon: "medical_services",
  },
  { value: "developmental", labelHe: "התפתחותית", labelEn: "Developmental", icon: "child_care" },
  { value: "other", labelHe: "אחר", labelEn: "Other", icon: "more_horiz" },
];

const SEVERITY_OPTIONS = [
  { value: 1, labelHe: "קלה", labelEn: "Mild" },
  { value: 2, labelHe: "בינונית", labelEn: "Moderate" },
  { value: 3, labelHe: "קשה", labelEn: "Severe" },
];

const DISABILITY_PERCENTAGES = [
  { value: -1, labelHe: "לא יודע", labelEn: "Don't know" },
  { value: 0, labelHe: "0%", labelEn: "0%" },
  { value: 10, labelHe: "10%", labelEn: "10%" },
  { value: 20, labelHe: "20%", labelEn: "20%" },
  { value: 30, labelHe: "30%", labelEn: "30%" },
  { value: 40, labelHe: "40%", labelEn: "40%" },
  { value: 50, labelHe: "50%", labelEn: "50%" },
  { value: 60, labelHe: "60%", labelEn: "60%" },
  { value: 70, labelHe: "70%", labelEn: "70%" },
  { value: 80, labelHe: "80%", labelEn: "80%" },
  { value: 90, labelHe: "90%", labelEn: "90%" },
  { value: 100, labelHe: "100%", labelEn: "100%" },
];

const RECOGNIZING_BODIES = [
  { value: "bituach_leumi", labelHe: "ביטוח לאומי", labelEn: "National Insurance" },
  { value: "defense", labelHe: "משרד הביטחון", labelEn: "Ministry of Defense" },
  { value: "health", labelHe: "משרד הבריאות", labelEn: "Ministry of Health" },
  { value: "other", labelHe: "אחר", labelEn: "Other" },
];

// Storage key
const STORAGE_KEY = "onboarding_disabilities";

export default function DisabilitiesPage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateUserProfile);
  const existingProfile = useQuery(api.users.getUserProfile);

  // Form state
  const [hasDisability, setHasDisability] = useState<boolean | null>(null);
  const [disabilities, setDisabilities] = useState<string[]>([]);
  const [severityPerDisability, setSeverityPerDisability] = useState<Record<string, number>>({});
  const [disabilityPercentage, setDisabilityPercentage] = useState<number | null>(null);
  const [disabilityRecognizedBy, setDisabilityRecognizedBy] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.hasDisability !== undefined) setHasDisability(data.hasDisability);
        if (data.disabilities) setDisabilities(data.disabilities);
        if (data.severityPerDisability) setSeverityPerDisability(data.severityPerDisability);
        if (data.disabilityPercentage !== undefined)
          setDisabilityPercentage(data.disabilityPercentage);
        if (data.disabilityRecognizedBy) setDisabilityRecognizedBy(data.disabilityRecognizedBy);
      } catch {
        // Ignore
      }
    }
  }, []);

  // Load from existing profile
  useEffect(() => {
    if (existingProfile) {
      if (existingProfile.disabilities && existingProfile.disabilities.length > 0) {
        setHasDisability(true);
        setDisabilities(existingProfile.disabilities);
      }
      if (existingProfile.disabilityPercentage !== undefined) {
        setDisabilityPercentage(existingProfile.disabilityPercentage);
      }
      if (existingProfile.disabilityRecognizedBy) {
        setDisabilityRecognizedBy(existingProfile.disabilityRecognizedBy);
      }
    }
  }, [existingProfile]);

  // Save to localStorage
  useEffect(() => {
    const data = {
      hasDisability,
      disabilities,
      severityPerDisability,
      disabilityPercentage,
      disabilityRecognizedBy,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    hasDisability,
    disabilities,
    severityPerDisability,
    disabilityPercentage,
    disabilityRecognizedBy,
  ]);

  const toggleDisability = (value: string) => {
    setDisabilities((prev) => {
      if (prev.includes(value)) {
        // Remove from severities too
        const newSeverities = { ...severityPerDisability };
        delete newSeverities[value];
        setSeverityPerDisability(newSeverities);
        return prev.filter((d) => d !== value);
      }
      return [...prev, value];
    });
  };

  const setSeverity = (disability: string, severity: number) => {
    setSeverityPerDisability((prev) => ({
      ...prev,
      [disability]: severity,
    }));
  };

  // Calculate overall severity from individual severities
  const getOverallSeverity = (): string | undefined => {
    const values = Object.values(severityPerDisability);
    if (values.length === 0) return undefined;
    const max = Math.max(...values);
    if (max === 1) return "mild";
    if (max === 2) return "moderate";
    return "severe";
  };

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        disabilities: hasDisability ? disabilities : [],
        disabilitySeverity: hasDisability ? getOverallSeverity() : undefined,
        disabilityPercentage:
          hasDisability && disabilityPercentage !== null && disabilityPercentage !== -1
            ? disabilityPercentage
            : undefined,
        disabilityRecognizedBy: hasDisability ? disabilityRecognizedBy || undefined : undefined,
      });
      localStorage.removeItem(STORAGE_KEY);
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
        <Icon name="lock" className="text-blue-600 dark:text-blue-400 text-xl shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {locale === "he"
            ? "מידע זה שמור באופן מוצפן ולא משותף עם אף גורם"
            : "This information is encrypted and never shared"}
        </p>
      </div>

      {/* Has Disability Question */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          {locale === "he"
            ? "האם יש לך מוגבלות או מצב בריאותי?"
            : "Do you have a disability or health condition?"}
        </label>
        <div className="flex gap-3">
          <button
            type="button"
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
            type="button"
            onClick={() => {
              setHasDisability(false);
              setDisabilities([]);
              setSeverityPerDisability({});
              setDisabilityPercentage(null);
              setDisabilityRecognizedBy("");
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

      {/* Disability Details - Conditional */}
      {hasDisability && (
        <>
          {/* Disability Types Multi-Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-1">
              {locale === "he"
                ? "בחר את סוגי המוגבלות הרלוונטיים"
                : "Select relevant disability types"}
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              {locale === "he" ? "ניתן לבחור יותר מאחד" : "You can select multiple"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DISABILITY_TYPES.map((type) => {
                const isSelected = disabilities.includes(type.value);
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleDisability(type.value)}
                    className={`flex items-center gap-2 py-3 px-4 rounded-xl border text-start font-medium transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    <Icon
                      name={type.icon}
                      className={`text-xl ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm">{locale === "he" ? type.labelHe : type.labelEn}</span>
                    {isSelected && <Icon name="check_circle" className="text-primary ms-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity per disability */}
          {disabilities.length > 0 && (
            <div className="mb-6 space-y-4">
              <label className="block text-sm font-medium text-foreground">
                {locale === "he" ? "דרגת חומרה לכל מוגבלות" : "Severity for each disability"}
              </label>
              {disabilities.map((disValue) => {
                const type = DISABILITY_TYPES.find((d) => d.value === disValue);
                if (!type) return null;
                const currentSeverity = severityPerDisability[disValue] || 0;

                return (
                  <div key={disValue} className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name={type.icon} className="text-primary" />
                      <span className="font-medium text-foreground">
                        {locale === "he" ? type.labelHe : type.labelEn}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {SEVERITY_OPTIONS.map((sev) => (
                        <button
                          key={sev.value}
                          type="button"
                          onClick={() => setSeverity(disValue, sev.value)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            currentSeverity === sev.value
                              ? sev.value === 1
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700"
                                : sev.value === 2
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700"
                              : "bg-background border border-border hover:border-primary/50 text-foreground"
                          }`}
                        >
                          {locale === "he" ? sev.labelHe : sev.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Disability Percentage */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              {locale === "he"
                ? "אחוזי נכות מוכרים (לא חובה)"
                : "Recognized disability percentage (optional)"}
            </label>
            <select
              value={disabilityPercentage ?? ""}
              onChange={(e) =>
                setDisabilityPercentage(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">{locale === "he" ? "בחר אחוזי נכות" : "Select percentage"}</option>
              {DISABILITY_PERCENTAGES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {locale === "he" ? opt.labelHe : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Recognizing Body */}
          {disabilities.length > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">
                {locale === "he"
                  ? "מאיזה גוף מוכרת הנכות? (לא חובה)"
                  : "Which body recognizes the disability? (optional)"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RECOGNIZING_BODIES.map((body) => (
                  <button
                    key={body.value}
                    type="button"
                    onClick={() =>
                      setDisabilityRecognizedBy(
                        disabilityRecognizedBy === body.value ? "" : body.value
                      )
                    }
                    className={`py-3 px-4 rounded-xl border text-center text-sm font-medium transition-all ${
                      disabilityRecognizedBy === body.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {locale === "he" ? body.labelHe : body.labelEn}
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
