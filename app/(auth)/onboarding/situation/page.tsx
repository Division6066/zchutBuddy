/**
 * Onboarding Step 3: Life Situation
 *
 * Collects employment status and IDF service information.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";

const EMPLOYMENT_OPTIONS = [
  { value: "employed", labelHe: "עובד/ת", labelEn: "Employed", icon: "work" },
  { value: "self_employed", labelHe: "עצמאי/ת", labelEn: "Self-Employed", icon: "business" },
  { value: "unemployed", labelHe: "לא עובד/ת", labelEn: "Unemployed", icon: "work_off" },
  { value: "student", labelHe: "סטודנט/ית", labelEn: "Student", icon: "school" },
  { value: "retired", labelHe: "גמלאי/ת", labelEn: "Retired", icon: "elderly" },
  { value: "other", labelHe: "אחר", labelEn: "Other", icon: "more_horiz" },
];

const IDF_OPTIONS = [
  { value: "served", labelHe: "שירתתי", labelEn: "Served", icon: "military_tech" },
  { value: "currently_serving", labelHe: "משרת/ת כעת", labelEn: "Currently Serving", icon: "security" },
  { value: "not_served", labelHe: "לא שירתתי", labelEn: "Did Not Serve", icon: "close" },
];

export default function SituationPage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [employmentStatus, setEmploymentStatus] = useState<string>("");
  const [idfService, setIdfService] = useState<string>("");
  const [isIdfDisabled, setIsIdfDisabled] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        employmentStatus: employmentStatus || undefined,
        idfService: idfService || undefined,
        isIdfDisabled: idfService === "served" ? isIdfDisabled : undefined,
      });
      router.push("/onboarding/disabilities");
    } catch (error) {
      console.error("Failed to save situation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = employmentStatus && idfService;

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
          <Icon name="work" className="text-3xl" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">
          {locale === "he" ? "מצב חיים" : "Life Situation"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "he"
            ? "עוזר לנו להתאים זכויות ייחודיות למצבך"
            : "Helps us match unique benefits to your situation"}
        </p>
      </div>

      {/* Employment Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          {locale === "he" ? "סטטוס תעסוקה *" : "Employment Status *"}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {EMPLOYMENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setEmploymentStatus(option.value)}
              className={`flex items-center gap-2 py-3 px-4 rounded-xl border text-start font-medium transition-all ${
                employmentStatus === option.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-foreground"
              }`}
            >
              <Icon
                name={option.icon}
                className={`text-xl ${
                  employmentStatus === option.value ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span>{locale === "he" ? option.labelHe : option.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* IDF Service */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          {locale === "he" ? 'שירות צבאי/לאומי *' : "Military/National Service *"}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {IDF_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setIdfService(option.value)}
              className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border text-center font-medium transition-all ${
                idfService === option.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-foreground"
              }`}
            >
              <Icon
                name={option.icon}
                className={`text-2xl ${
                  idfService === option.value ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span className="text-sm">{locale === "he" ? option.labelHe : option.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* IDF Disability (only if served) */}
      {idfService === "served" && (
        <div className="mb-8 p-4 bg-muted/50 rounded-xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isIdfDisabled}
              onChange={(e) => setIsIdfDisabled(e.target.checked)}
              className="size-5 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <span className="font-medium text-foreground">
                {locale === "he" ? 'יש לי נכות מוכרת צה"ל' : "I have recognized IDF disability"}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === "he"
                  ? "פותח גישה לזכויות נכי צה״ל ממשרד הביטחון"
                  : "Unlocks access to IDF disability benefits from Ministry of Defense"}
              </p>
            </div>
          </label>
        </div>
      )}

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

