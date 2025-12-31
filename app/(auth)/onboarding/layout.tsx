/**
 * Onboarding Layout
 *
 * Provides a consistent layout for the 5-step onboarding flow with
 * progress indicator and navigation controls.
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";

/**
 * Onboarding steps configuration
 */
const ONBOARDING_STEPS = [
  { id: "welcome", path: "/onboarding/welcome", titleKey: "onboarding.step1", icon: "waving_hand" },
  { id: "basic-info", path: "/onboarding/basic-info", titleKey: "onboarding.step2", icon: "person" },
  { id: "situation", path: "/onboarding/situation", titleKey: "onboarding.step3", icon: "work" },
  { id: "disabilities", path: "/onboarding/disabilities", titleKey: "onboarding.step4", icon: "accessibility" },
  { id: "review", path: "/onboarding/review", titleKey: "onboarding.step5", icon: "check_circle" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  // Determine current step index
  const currentStepIndex = ONBOARDING_STEPS.findIndex((step) =>
    pathname.includes(step.id)
  );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <Icon name="accessibility_new" className="text-4xl" />
          </div>
          <h1 className="text-2xl font-black text-foreground">
            {locale === "he" ? "זכויות באדי" : "ZchuyotBuddy"}
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-3">
            {ONBOARDING_STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index <= currentStep && goToStep(index)}
                disabled={index > currentStep}
                className={`flex flex-col items-center gap-1 ${
                  index <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center transition-all ${
                    index < currentStep
                      ? "bg-primary text-white"
                      : index === currentStep
                        ? "bg-primary/10 border-2 border-primary text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <Icon name="check" className="text-lg" />
                  ) : (
                    <Icon name={step.icon} className="text-lg" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden md:block ${
                    index === currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {t(step.titleKey)}
                </span>
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step counter */}
          <p className="text-center text-sm text-muted-foreground mt-2">
            {locale === "he"
              ? `שלב ${currentStep + 1} מתוך ${totalSteps}`
              : `Step ${currentStep + 1} of ${totalSteps}`}
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
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="arrow_back" className="text-lg rtl:rotate-180" />
              <span className="font-medium">{locale === "he" ? "חזור" : "Back"}</span>
            </button>
          ) : (
            <div />
          )}

          {/* Skip button (except for last step) */}
          {!isLastStep && currentStep > 0 && (
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {locale === "he" ? "דלג על ההרשמה" : "Skip onboarding"}
            </button>
          )}
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          {locale === "he"
            ? "המידע שלך מאובטח ולא ישותף עם צדדים שלישיים"
            : "Your information is secure and will not be shared with third parties"}
        </p>
      </div>
    </div>
  );
}

