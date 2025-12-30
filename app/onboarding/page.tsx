"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function OnboardingWelcomePage() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between p-6 relative z-10">
        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">accessibility_new</span>
        </div>
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          {t("common.skip")}
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Hero illustration */}
        <div className="w-full relative mb-10 flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-primary/10 rounded-full blur-2xl" />
          <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-b from-primary/10 to-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[120px] text-primary">
              explore
            </span>
          </div>

          {/* Floating badge - Rights Secured */}
          <div
            className="absolute bottom-6 -left-2 md:left-8 bg-card border border-border rounded-2xl p-3 shadow-lg flex items-center gap-3 animate-bounce"
            style={{ animationDuration: "4s" }}
          >
            <div className="bg-success-bg p-2 rounded-full text-success">
              <span className="material-symbols-outlined text-lg">verified</span>
            </div>
            <div className="flex flex-col text-start">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                סטטוס
              </span>
              <span className="text-xs text-foreground font-bold">הזכויות הובטחו</span>
            </div>
          </div>

          {/* Floating badge - Paperwork Done */}
          <div className="absolute top-10 right-0 md:right-4 bg-card/90 backdrop-blur-sm border border-border rounded-2xl py-2 px-3 shadow-md flex items-center gap-2 rotate-6">
            <span className="material-symbols-outlined text-lg text-primary">description</span>
            <span className="text-[10px] text-foreground font-bold">ניירת: הושלמה</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
          <h1 className="text-foreground tracking-tight text-3xl md:text-4xl font-black leading-tight">
            {t("onboarding.welcome.title")} <br />
            <span className="text-primary relative inline-block">
              {t("onboarding.welcome.subtitle")}
              <svg
                className="absolute w-full h-2 -bottom-1 left-0 text-primary/20"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </span>
          </h1>
          <p className="text-muted-foreground text-base font-medium leading-relaxed px-2">
            {t("onboarding.welcome.description")}
          </p>
        </div>
      </main>

      {/* CTA section */}
      <footer className="flex flex-col gap-5 p-6 pb-10 w-full z-10 bg-gradient-to-t from-background to-transparent">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-8 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>

        {/* Primary CTA */}
        <Link
          href="/onboarding/radar"
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ms-2">{t("onboarding.welcome.cta")}</span>
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
            arrow_back
          </span>
        </Link>

        {/* Secondary link */}
        <button
          type="button"
          className="text-muted-foreground text-sm font-semibold py-1 hover:text-primary transition-colors flex items-center justify-center gap-1 group"
        >
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
            help
          </span>
          איך זה עובד?
        </button>
      </footer>
    </div>
  );
}
