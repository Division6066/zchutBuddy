"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function OnboardingRadarPage() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between p-6 relative z-10">
        <Link
          href="/onboarding"
          className="size-10 rounded-xl bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          {t("common.skip")}
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Radar illustration */}
        <div className="w-full relative mb-10 flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-primary/10 rounded-full blur-2xl" />
          
          {/* Radar circles */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="absolute w-72 h-72 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute w-56 h-56 rounded-full border-2 border-primary/20" />
            <div className="absolute w-40 h-40 rounded-full border-2 border-primary/30" />
            <div className="absolute w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">
                radar
              </span>
            </div>

            {/* Radar dots */}
            <div className="absolute top-8 right-16 w-3 h-3 rounded-full bg-success animate-pulse" />
            <div className="absolute bottom-12 left-8 w-3 h-3 rounded-full bg-warning animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-20 left-12 w-2 h-2 rounded-full bg-info animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>

        {/* Content text */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
          <h1 className="text-foreground tracking-tight text-3xl font-black leading-tight">
            {t("onboarding.radar.title")}
          </h1>
          <p className="text-muted-foreground text-base font-medium leading-relaxed px-2">
            {t("onboarding.radar.description")}
          </p>

          {/* Feature list */}
          <div className="w-full space-y-3 mt-4">
            {[
              { icon: "notifications_active", text: "התראות על שינויים בזכויות" },
              { icon: "update", text: "עדכונים בזמן אמת" },
              { icon: "mail", text: "סיכום שבועי לאימייל" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">{feature.icon}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA section */}
      <footer className="flex flex-col gap-5 p-6 pb-10 w-full z-10 bg-gradient-to-t from-background to-transparent">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-8 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>

        {/* Primary CTA */}
        <Link
          href="/onboarding/profile-setup"
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ms-2">{t("common.next")}</span>
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
            arrow_back
          </span>
        </Link>
      </footer>
    </div>
  );
}
