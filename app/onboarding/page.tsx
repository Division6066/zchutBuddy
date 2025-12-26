import type { Metadata } from "next";
import Link from "next/link";
import HeroContent from "@/components/stitch/home/HeroContent";
import HeroIllustration from "@/components/stitch/home/HeroIllustration";
import StitchBackground from "@/components/stitch/StitchBackground";
import StitchHeader from "@/components/stitch/StitchHeader";

export const metadata: Metadata = {
  title: "ברוכים הבאים | ZchuyotBuddy",
  description: "ה-GPS לזכויות שלך - וטייס-משנה לניירת",
};

/**
 * Onboarding Step 1: Welcome
 * Flow: Welcome → Radar → Profile Setup
 */
export default function OnboardingWelcomePage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden no-scrollbar bg-white"
      dir="rtl"
      lang="he"
    >
      {/* Background decorations */}
      <StitchBackground />

      {/* Header */}
      <StitchHeader showSkip={true} skipText="דלג" brandName="זכויותבאדי" iconName="shield" />

      {/* Main hero section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full max-w-2xl mx-auto mt-[-20px]">
        {/* Hero illustration with floating badges */}
        <HeroIllustration />

        {/* Hero text content */}
        <HeroContent />
      </main>

      {/* CTA section */}
      <div className="flex flex-col gap-5 p-6 pb-10 w-full z-10 bg-white max-w-2xl mx-auto">
        {/* Progress dots */}
        <div
          className="flex justify-center gap-2 mb-2"
          dir="ltr"
          role="group"
          aria-label="שלב 1 מתוך 3"
        >
          <div className="w-8 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>

        {/* Primary CTA */}
        <Link
          href="/onboarding/radar"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ml-2">המשך</span>
          <span
            className="material-symbols-outlined transition-transform group-hover:-translate-x-1 rotate-180"
            aria-hidden="true"
          >
            arrow_forward
          </span>
        </Link>

        {/* Secondary link */}
        <Link
          href="/about"
          className="text-text-subtle text-sm font-semibold py-1 hover:text-primary transition-colors flex items-center justify-center gap-1 group"
        >
          <span
            className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform"
            aria-hidden="true"
          >
            help
          </span>
          איך זה עובד?
        </Link>

        <div className="h-2" />
      </div>
    </div>
  );
}
