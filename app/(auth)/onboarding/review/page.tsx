/**
 * Onboarding Step 5: Review & Submit
 *
 * Reviews the collected information and completes onboarding.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";

export default function ReviewPage() {
  const { locale } = useTranslation();
  const router = useRouter();

  const userProfile = useQuery(api.users.getUserProfile);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      // Update anonymous preference
      if (isAnonymous !== userProfile?.isAnonymous) {
        await updateProfile({ isAnonymous });
      }
      // Mark onboarding as complete
      await completeOnboarding();
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
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
    not_served: { he: "לא שירתתי", en: "Did Not Serve" },
  };

  const disabilityLabels: Record<string, { he: string; en: string }> = {
    mobility: { he: "ניידות", en: "Mobility" },
    vision: { he: "ראייה", en: "Vision" },
    hearing: { he: "שמיעה", en: "Hearing" },
    cognitive: { he: "קוגניטיבית", en: "Cognitive" },
    mental: { he: "נפשית", en: "Mental Health" },
    chronic: { he: "מחלה כרונית", en: "Chronic Illness" },
    developmental: { he: "התפתחותית", en: "Developmental" },
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
        {/* Basic Info */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="person" className="text-primary text-xl" />
            <h3 className="font-bold text-foreground">
              {locale === "he" ? "פרטים בסיסיים" : "Basic Info"}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">{locale === "he" ? "גיל: " : "Age: "}</span>
              <span className="text-foreground">
                {getLabel(ageRangeLabels, userProfile.ageRange)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">{locale === "he" ? "עיר: " : "City: "}</span>
              <span className="text-foreground">
                {userProfile.city || (locale === "he" ? "לא צוין" : "Not specified")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">{locale === "he" ? "קופת חולים: " : "HMO: "}</span>
              <span className="text-foreground">{getLabel(hmoLabels, userProfile.hmo)}</span>
            </div>
          </div>
        </div>

        {/* Life Situation */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="work" className="text-primary text-xl" />
            <h3 className="font-bold text-foreground">
              {locale === "he" ? "מצב חיים" : "Life Situation"}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">
                {locale === "he" ? "תעסוקה: " : "Employment: "}
              </span>
              <span className="text-foreground">
                {getLabel(employmentLabels, userProfile.employmentStatus)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">
                {locale === "he" ? "שירות צבאי: " : "Military: "}
              </span>
              <span className="text-foreground">
                {getLabel(idfLabels, userProfile.idfService)}
              </span>
            </div>
            {userProfile.isIdfDisabled && (
              <div className="col-span-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg">
                  <Icon name="military_tech" className="text-sm" />
                  {locale === "he" ? 'נכה צה"ל מוכר' : "Recognized IDF Disability"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Health/Disabilities */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="accessibility" className="text-primary text-xl" />
            <h3 className="font-bold text-foreground">
              {locale === "he" ? "מצב בריאותי" : "Health Status"}
            </h3>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">
              {locale === "he" ? "מוגבלויות: " : "Disabilities: "}
            </span>
            <span className="text-foreground">
              {getDisabilitiesLabel(userProfile.disabilities)}
            </span>
          </div>
        </div>
      </div>

      {/* Anonymous Option */}
      <div className="p-4 bg-muted/50 rounded-xl mb-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="mt-1 size-5 rounded border-border text-primary focus:ring-primary"
          />
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
            {locale === "he" ? "בוא נתחיל!" : "Let's Go!"}
            <Icon name="rocket_launch" className="text-xl" />
          </>
        )}
      </button>

      {/* Edit link */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        {locale === "he" ? "משהו לא נכון? " : "Something wrong? "}
        <button
          onClick={() => router.push("/onboarding/basic-info")}
          className="text-primary hover:underline"
        >
          {locale === "he" ? "חזור לעריכה" : "Go back to edit"}
        </button>
      </p>
    </div>
  );
}

