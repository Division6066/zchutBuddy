import type { Metadata } from "next";
import Link from "next/link";
import OnboardingHero from "@/components/stitch/onboarding/OnboardingHero";

export const metadata: Metadata = {
  title: "רדאר עדכונים | ZchuyotBuddy",
  description: "כל העדכונים במקום אחד - סריקה יומית של זכויות חדשות",
};

/**
 * Stitch Onboarding/Radar Page Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_3/
 */
export default function StitchOnboardingPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-white"
      dir="rtl"
      lang="he"
    >
      {/* Background decorations - extended for radar page */}
      <div
        className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="flex items-center justify-between p-6 pt-12 z-10">
        <Link href="/stitch/home" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-[24px] font-bold">radar</span>
          </div>
          <span className="text-text-dark font-black text-xl tracking-tight">רדאר עדכונים</span>
        </Link>
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-primary-bg"
        >
          דלג
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full mt-[-20px]">
        {/* Hero illustration */}
        <OnboardingHero />

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto rtl">
          <h1 className="text-text-dark tracking-tight text-[28px] font-extrabold leading-[1.2]">
            כל העדכונים{" "}
            <span className="text-primary relative inline-block whitespace-nowrap">
              במקום אחד
              <svg
                className="absolute w-full h-2 -bottom-1 left-0 text-primary/20"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
                aria-hidden="true"
              >
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </span>
          </h1>
          <p className="text-text-subtle text-base font-medium leading-relaxed px-4">
            אנו סורקים עבורך מדי יום את אתרי הממשלה, ביטוח לאומי, העיריות והעמותות כדי שלא תפספס אף
            זכות המגיעה לך.
          </p>
        </div>
      </main>

      {/* CTA section */}
      <div className="flex flex-col gap-5 p-6 pb-10 w-full z-10 bg-white">
        {/* Progress dots */}
        <div
          className="flex justify-center gap-2 mb-2"
          dir="ltr"
          role="group"
          aria-label="שלב 2 מתוך 3"
        >
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-8 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>

        {/* Primary CTA */}
        <Link
          href="/stitch/profile-setup"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ml-2">הפעלת רדאר אישי</span>
          <span
            className="material-symbols-outlined transition-transform group-hover:-translate-x-1 rotate-180"
            aria-hidden="true"
          >
            arrow_back
          </span>
        </Link>

        {/* Secondary link */}
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold py-1 hover:text-primary transition-colors flex items-center justify-center gap-1 group"
        >
          <span
            className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform"
            aria-hidden="true"
          >
            tune
          </span>
          התאם הגדרות חיפוש
        </button>

        <div className="h-2" />
      </div>
    </div>
  );
}
