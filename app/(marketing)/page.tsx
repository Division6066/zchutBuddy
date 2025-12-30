"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { useTranslation } from "@/lib/i18n";
import { useState } from "react";
import { SignUpModal } from "@/components/SignUpModal";

export default function HomePage() {
  const { isAuthenticated } = useConvexAuth();
  const { t } = useTranslation();
  const [showSignUp, setShowSignUp] = useState(false);

  const steps = [
    {
      icon: "person_search",
      title: t("home.howItWorks.step1.title"),
      description: t("home.howItWorks.step1.description"),
    },
    {
      icon: "fact_check",
      title: t("home.howItWorks.step2.title"),
      description: t("home.howItWorks.step2.description"),
    },
    {
      icon: "emoji_events",
      title: t("home.howItWorks.step3.title"),
      description: t("home.howItWorks.step3.description"),
    },
  ];

  const features = [
    {
      icon: "search",
      title: t("home.features.rightsFinder.title"),
      description: t("home.features.rightsFinder.description"),
    },
    {
      icon: "checklist",
      title: t("home.features.checklists.title"),
      description: t("home.features.checklists.description"),
    },
    {
      icon: "notifications_active",
      title: t("home.features.updates.title"),
      description: t("home.features.updates.description"),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary/10 via-background to-background py-16 lg:py-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="material-symbols-outlined text-base">verified</span>
                {t("home.hero.badge")}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight leading-tight">
                {t("home.hero.title")}
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                {t("home.hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all shadow-lg shadow-primary/30"
                  >
                    {t("nav.dashboard")}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all shadow-lg shadow-primary/30"
                  >
                    {t("common.getStarted")}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                )}
                <Link
                  href="/features"
                  className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl border-2 border-border hover:bg-accent text-foreground font-bold text-lg transition-all"
                >
                  {t("common.learnMore")}
                </Link>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-80 h-80">
                {/* Animated circles */}
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-primary/20" />
                <div className="absolute inset-8 rounded-full bg-card border-4 border-white shadow-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-8xl text-primary">
                    accessibility_new
                  </span>
                </div>

                {/* Floating badges */}
                <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-3 shadow-lg flex items-center gap-3 animate-bounce" style={{ animationDuration: "3s" }}>
                  <div className="bg-success-bg p-2 rounded-full text-success">
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </div>
                  <div className="text-start">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                      סטטוס
                    </span>
                    <span className="text-xs text-foreground font-bold">הזכויות הובטחו</span>
                  </div>
                </div>

                <div className="absolute top-4 -right-4 bg-card/90 backdrop-blur-sm border border-border rounded-2xl py-2 px-3 shadow-md flex items-center gap-2 rotate-6">
                  <span className="material-symbols-outlined text-lg text-primary">description</span>
                  <span className="text-[10px] text-foreground font-bold">ניירת: הושלמה</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-card py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4 text-center">
            {t("home.howItWorks.title")}
          </h2>
          <p className="text-muted-foreground text-lg text-center mb-12 max-w-2xl mx-auto">
            שלושה שלבים פשוטים להשגת הזכויות שמגיעות לך
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center p-6 relative">
                {/* Step number */}
                <div className="absolute top-0 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                  {index + 1}
                </div>

                <div className="size-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4 text-center">
            {t("home.features.title")}
          </h2>
          <p className="text-muted-foreground text-lg text-center mb-12 max-w-2xl mx-auto">
            הכלים שלנו מסייעים לך לנווט במערכת הביטחון הסוציאלי
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-6">
            מוכן לגלות את הזכויות שלך?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            הצטרף לאלפי ישראלים שכבר מנצלים את הפלטפורמה שלנו למיצוי זכויות
          </p>
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-white hover:bg-gray-100 text-primary font-bold text-lg transition-all shadow-lg"
            >
              {t("nav.dashboard")}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowSignUp(true)}
              className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-white hover:bg-gray-100 text-primary font-bold text-lg transition-all shadow-lg"
            >
              {t("common.getStarted")}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
        </div>
      </section>

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
      />
    </>
  );
}
