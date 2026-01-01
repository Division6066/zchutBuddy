/**
 * Onboarding Layout
 *
 * Provides a consistent layout for the 5-step onboarding flow with
 * progress indicator, skip option, and navigation controls.
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useTranslation } from "@/lib/i18n";

/**
 * Onboarding steps configuration with Hebrew labels
 */
const ONBOARDING_STEPS = [
  {
    id: "welcome",
    path: "/onboarding/welcome",
    titleKey: "onboarding.step1",
    labelHe: "ברוכים הבאים",
    labelEn: "Welcome",
    icon: "waving_hand",
  },
  {
    id: "basic-info",
    path: "/onboarding/basic-info",
    titleKey: "onboarding.step2",
    labelHe: "פרטים בסיסיים",
    labelEn: "Basic Info",
    icon: "person",
  },
  {
    id: "situation",
    path: "/onboarding/situation",
    titleKey: "onboarding.step3",
    labelHe: "מצב חיים",
    labelEn: "Life Situation",
    icon: "work",
  },
  {
    id: "disabilities",
    path: "/onboarding/disabilities",
    titleKey: "onboarding.step4",
    labelHe: "מוגבלויות",
    labelEn: "Disabilities",
    icon: "accessibility",
  },
  {
    id: "review",
    path: "/onboarding/review",
    titleKey: "onboarding.step5",
    labelHe: "סיכום",
    labelEn: "Review",
    icon: "check_circle",
  },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  // Determine current step index
  const currentStepIndex = ONBOARDING_STEPS.findIndex((step) => pathname.includes(step.id));
  const currentStep = currentStepIndex >= 0 ? currentStepIndex : 0;
  const totalSteps = ONBOARDING_STEPS.length;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  // Navigation handlers
  const goToStep = (index: number) => {
    if (index >= 0 && index < totalSteps) {
      router.push(ONBOARDING_STEPS[index].path);
    }
  };

  const canGoBack = currentStep > 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-12">
        {/* Header with Logo and Skip */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="accessibility_new" className="text-2xl" />
            </div>
            <span className="font-black text-lg hidden sm:block">
              {locale === "he" ? "זכויות באדי" : "ZchuyotBuddy"}
            </span>
          </Link>

          {/* Skip link (visible after first step) */}
          {!isFirstStep && !isLastStep && (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {locale === "he" ? "דלג" : "Skip"}
              <Icon name="skip_next" className="text-lg" />
            </button>
          )}
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-4">
            {ONBOARDING_STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isFuture = index > currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  {/* Connector line (before step, except first) */}
                  <div className="flex items-center w-full">
                    {index > 0 && (
                      <div
                        className={`h-0.5 flex-1 transition-colors ${
                          isCompleted || isCurrent ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}

                    {/* Step indicator */}
                    <button
                      onClick={() => isCompleted && goToStep(index)}
                      disabled={isFuture}
                      className={`relative size-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isCompleted
                          ? "bg-primary text-white cursor-pointer hover:bg-primary-dark"
                          : isCurrent
                            ? "bg-primary/10 border-2 border-primary text-primary"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                      } ${isCurrent ? "animate-pulse" : ""}`}
                    >
                      {isCompleted ? (
                        <Icon name="check" className="text-lg" />
                      ) : (
                        <Icon name={step.icon} className="text-lg" />
                      )}
                    </button>

                    {/* Connector line (after step, except last) */}
                    {index < totalSteps - 1 && (
                      <div
                        className={`h-0.5 flex-1 transition-colors ${
                          isCompleted ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={`text-xs font-medium mt-2 text-center hidden md:block ${
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {locale === "he" ? step.labelHe : step.labelEn}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step counter */}
          <p className="text-center text-sm text-muted-foreground mt-3">
            {locale === "he" ? (
              <>
                <span className="font-bold text-primary">
                  {ONBOARDING_STEPS[currentStep]?.labelHe}
                </span>
                {" · "}
                שלב {currentStep + 1} מתוך {totalSteps}
              </>
            ) : (
              <>
                <span className="font-bold text-primary">
                  {ONBOARDING_STEPS[currentStep]?.labelEn}
                </span>
                {" · "}
                Step {currentStep + 1} of {totalSteps}
              </>
            )}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
          {children}
        </div>

        {/* Navigation Buttons (at bottom of layout) */}
        <div className="flex items-center justify-between mt-6">
          {canGoBack ? (
            <button
              onClick={() => goToStep(currentStep - 1)}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted"
            >
              <Icon name="arrow_back" className="text-lg rtl:rotate-180" />
              <span className="font-medium">{locale === "he" ? "חזור" : "Back"}</span>
            </button>
          ) : (
            <div />
          )}

          {/* Skip onboarding entirely (on later steps) */}
          {!isFirstStep && !isLastStep && (
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors md:hidden"
            >
              {locale === "he" ? "דלג על ההרשמה" : "Skip onboarding"}
            </button>
          )}
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          <Icon name="lock" className="text-sm inline-block me-1 align-text-bottom" />
          {locale === "he"
            ? "המידע שלך מאובטח ולא ישותף עם צדדים שלישיים"
            : "Your information is secure and will not be shared with third parties"}
        </p>
      </div>
    </div>
  );
}
