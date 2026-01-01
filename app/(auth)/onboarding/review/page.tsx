/**
 * Onboarding Step 5: Review & Submit
 *
 * Reviews the collected information and completes onboarding.
 * Shows success animation before redirecting to dashboard.
 */

"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";

export default function ReviewPage() {
  const { locale } = useTranslation();
  const router = useRouter();

  const userProfile = useQuery(api.users.getUserProfile);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      // Update anonymous preference if changed
      if (isAnonymous !== userProfile?.isAnonymous) {
        await updateProfile({ isAnonymous });
      }
      // Mark onboarding as complete
      await completeOnboarding();

      // Show success animation
      setShowSuccess(true);

      // Redirect after animation
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsCompleting(false);
    }
  };

  // Label mappings for display
  const ageRangeLabels: Record<string, { he: string; en: string }> = {
    "18-25": { he: "18-25", en: "18-25" },
    "26-35": { he: "26-35", en: "26-35" },
    "36-45": { he: "36-45", en: "36-45" },
    "46-55": { he: "46-55", en: "46-55" },
    "56-65": { he: "56-65", en: "56-65" },
    "65+": { he: "65+", en: "65+" },
  };

  const hmoLabels: Record<string, { he: string; en: string }> = {
    clalit: { he: "כללית", en: "Clalit" },
    maccabi: { he: "מכבי", en: "Maccabi" },
    meuhedet: { he: "מאוחדת", en: "Meuhedet" },
    leumit: { he: "לאומית", en: "Leumit" },
  };

  const employmentLabels: Record<string, { he: string; en: string }> = {
    employed: { he: "עובד/ת", en: "Employed" },
    self_employed: { he: "עצמאי/ת", en: "Self-Employed" },
    unemployed: { he: "לא עובד/ת", en: "Unemployed" },
    student: { he: "סטודנט/ית", en: "Student" },
    retired: { he: "גמלאי/ת", en: "Retired" },
    other: { he: "אחר", en: "Other" },
  };

  const idfLabels: Record<string, { he: string; en: string }> = {
    served: { he: "שירתתי", en: "Served" },
    currently_serving: { he: "משרת/ת כעת", en: "Currently Serving" },
    national_service: { he: "שירות לאומי/אזרחי", en: "National/Civil Service" },
    not_served: { he: "לא שירתתי", en: "Did Not Serve" },
  };

  const disabilityLabels: Record<string, { he: string; en: string }> = {
    mobility: { he: "ניידות", en: "Mobility" },
    vision: { he: "ראייה", en: "Vision" },
    hearing: { he: "שמיעה", en: "Hearing" },
    cognitive: { he: "קוגניטיבי", en: "Cognitive" },
    mental: { he: "בריאות הנפש", en: "Mental Health" },
    chronic: { he: "מחלה כרונית", en: "Chronic Illness" },
    developmental: { he: "התפתחותית", en: "Developmental" },
    other: { he: "אחר", en: "Other" },
  };

  const recognizingBodyLabels: Record<string, { he: string; en: string }> = {
    bituach_leumi: { he: "ביטוח לאומי", en: "National Insurance" },
    defense: { he: "משרד הביטחון", en: "Ministry of Defense" },
    health: { he: "משרד הבריאות", en: "Ministry of Health" },
    other: { he: "אחר", en: "Other" },
  };

  const getLabel = (
    labels: Record<string, { he: string; en: string }>,
    value: string | undefined
  ): string => {
    if (!value) return locale === "he" ? "לא צוין" : "Not specified";
    return labels[value]?.[locale === "he" ? "he" : "en"] || value;
  };

  const getDisabilitiesLabel = (disabilities: string[] | undefined): string => {
    if (!disabilities || disabilities.length === 0) {
      return locale === "he" ? "אין" : "None";
    }
    return disabilities
      .map((d) => disabilityLabels[d]?.[locale === "he" ? "he" : "en"] || d)
      .join(", ");
  };

  // Success animation overlay
  if (showSuccess) {
    return (
      <div className="p-6 md:p-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="relative">
          {/* Success circle animation */}
          <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-bounce">
            <Icon name="check_circle" className="text-6xl text-green-600 dark:text-green-400" />
          </div>
          {/* Confetti-like particles */}
          <div className="absolute -top-4 -left-4 size-3 rounded-full bg-primary animate-ping" />
          <div className="absolute -top-2 -right-6 size-2 rounded-full bg-yellow-400 animate-ping delay-100" />
          <div className="absolute -bottom-4 -left-6 size-2 rounded-full bg-blue-400 animate-ping delay-200" />
          <div className="absolute -bottom-2 -right-4 size-3 rounded-full bg-purple-400 animate-ping delay-150" />
        </div>

        <h2 className="text-2xl font-black text-foreground mt-6 mb-2">
          {locale === "he" ? "מעולה!" : "Awesome!"}
        </h2>
        <p className="text-muted-foreground text-center">
          {locale === "he"
            ? "הפרופיל שלך נשמר בהצלחה. מעבירים אותך לדשבורד..."
            : "Your profile was saved successfully. Redirecting to dashboard..."}
        </p>

        {/* Loading dots */}
        <div className="flex gap-1 mt-4">
          <div
            className="size-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="size-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="size-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[300px]">
        <Icon name="progress_activity" className="text-4xl text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
          <Icon name="check_circle" className="text-3xl" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">
          {locale === "he" ? "סיכום" : "Summary"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "he"
            ? "בדוק שהפרטים נכונים לפני שנמשיך"
            : "Review your information before we continue"}
        </p>
      </div>

      {/* Profile Summary */}
      <div className="space-y-4 mb-8">
        {/* Basic Info Card */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon name="person" className="text-primary text-xl" />
              <h3 className="font-bold text-foreground">
                {locale === "he" ? "פרטים בסיסיים" : "Basic Info"}
              </h3>
            </div>
            <Link
              href="/onboarding/basic-info"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Icon name="edit" className="text-base" />
              {locale === "he" ? "עריכה" : "Edit"}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">{locale === "he" ? "גיל: " : "Age: "}</span>
              <span className="text-foreground font-medium">
                {getLabel(ageRangeLabels, userProfile.ageRange)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">{locale === "he" ? "עיר: " : "City: "}</span>
              <span className="text-foreground font-medium">
                {userProfile.city || (locale === "he" ? "לא צוין" : "Not specified")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">
                {locale === "he" ? "קופת חולים: " : "HMO: "}
              </span>
              <span className="text-foreground font-medium">
                {getLabel(hmoLabels, userProfile.hmo)}
              </span>
            </div>
          </div>
        </div>

        {/* Life Situation Card */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon name="work" className="text-primary text-xl" />
              <h3 className="font-bold text-foreground">
                {locale === "he" ? "מצב חיים" : "Life Situation"}
              </h3>
            </div>
            <Link
              href="/onboarding/situation"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Icon name="edit" className="text-base" />
              {locale === "he" ? "עריכה" : "Edit"}
            </Link>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-muted-foreground">
                {locale === "he" ? "תעסוקה: " : "Employment: "}
              </span>
              <span className="text-foreground font-medium">
                {getLabel(employmentLabels, userProfile.employmentStatus)}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground">
                {locale === "he" ? "שירות צבאי: " : "Military: "}
              </span>
              <span className="text-foreground font-medium">
                {getLabel(idfLabels, userProfile.idfService)}
              </span>
            </div>
            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {userProfile.isIdfDisabled && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg">
                  <Icon name="military_tech" className="text-sm" />
                  {locale === "he" ? "נכות שירות" : "Service Disability"}
                </span>
              )}
              {userProfile.isRecognizedIdfDisabled && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-lg">
                  <Icon name="verified" className="text-sm" />
                  {locale === "he" ? 'נכה צה"ל מוכר' : "Recognized IDF"}
                </span>
              )}
              {userProfile.receivingDisabilityBenefit && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-lg">
                  <Icon name="account_balance" className="text-sm" />
                  {locale === "he" ? "קצבת נכות" : "Disability Benefit"}
                </span>
              )}
              {userProfile.hasChildrenUnder18 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-lg">
                  <Icon name="child_care" className="text-sm" />
                  {locale === "he" ? "ילדים" : "Children"}
                </span>
              )}
              {userProfile.isRenting && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-lg">
                  <Icon name="home" className="text-sm" />
                  {locale === "he" ? "שוכר" : "Renting"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Health/Disabilities Card */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon name="accessibility" className="text-primary text-xl" />
              <h3 className="font-bold text-foreground">
                {locale === "he" ? "מצב בריאותי" : "Health Status"}
              </h3>
            </div>
            <Link
              href="/onboarding/disabilities"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Icon name="edit" className="text-base" />
              {locale === "he" ? "עריכה" : "Edit"}
            </Link>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">
                {locale === "he" ? "מוגבלויות: " : "Disabilities: "}
              </span>
              <span className="text-foreground font-medium">
                {getDisabilitiesLabel(userProfile.disabilities)}
              </span>
            </div>
            {userProfile.disabilities && userProfile.disabilities.length > 0 && (
              <>
                {userProfile.disabilityPercentage !== undefined &&
                  userProfile.disabilityPercentage !== null && (
                    <div>
                      <span className="text-muted-foreground">
                        {locale === "he" ? "אחוזי נכות: " : "Percentage: "}
                      </span>
                      <span className="text-foreground font-medium">
                        {userProfile.disabilityPercentage}%
                      </span>
                    </div>
                  )}
                {userProfile.disabilityRecognizedBy && (
                  <div>
                    <span className="text-muted-foreground">
                      {locale === "he" ? "גוף מכיר: " : "Recognized by: "}
                    </span>
                    <span className="text-foreground font-medium">
                      {getLabel(recognizingBodyLabels, userProfile.disabilityRecognizedBy)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Anonymous Option */}
      <div className="p-4 bg-muted/50 rounded-xl mb-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="peer sr-only"
            />
            <div
              className={`size-6 rounded-md border-2 transition-all flex items-center justify-center ${
                isAnonymous ? "bg-primary border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              {isAnonymous && <Icon name="check" className="text-white text-sm" />}
            </div>
          </div>
          <div>
            <span className="font-medium text-foreground">
              {locale === "he" ? "שמור את המידע שלי באנונימיות" : "Keep my information anonymous"}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "he"
                ? "המידע ישמר לחיפוש זכויות אך לא יקושר לזהות שלך"
                : "Information will be used for rights search but not linked to your identity"}
            </p>
          </div>
        </label>
      </div>

      {/* Complete Button */}
      <button
        onClick={handleComplete}
        disabled={isCompleting}
        className="w-full h-14 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-primary"
      >
        {isCompleting ? (
          <Icon name="progress_activity" className="text-xl animate-spin" />
        ) : (
          <>
            {locale === "he" ? "סיים והתחל לחפש זכויות" : "Finish & Start Finding Rights"}
            <Icon name="rocket_launch" className="text-xl" />
          </>
        )}
      </button>

      {/* Back to edit hint */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        {locale === "he" ? "משהו לא נכון? " : "Something wrong? "}
        <Link href="/onboarding/basic-info" className="text-primary hover:underline">
          {locale === "he" ? "חזור לעריכה" : "Go back to edit"}
        </Link>
      </p>
    </div>
  );
}
