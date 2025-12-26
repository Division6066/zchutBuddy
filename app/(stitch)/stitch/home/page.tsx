import type { Metadata } from "next";
import HeroActions from "@/components/stitch/home/HeroActions";
import HeroContent from "@/components/stitch/home/HeroContent";
import HeroIllustration from "@/components/stitch/home/HeroIllustration";
import StitchBackground from "@/components/stitch/StitchBackground";
import StitchHeader from "@/components/stitch/StitchHeader";

export const metadata: Metadata = {
  title: "ברוכים הבאים | ZchuyotBuddy",
  description: "ה-GPS לזכויות שלך - וטייס-משנה לניירת",
};

/**
 * Stitch Homepage Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_10/
 */
export default function StitchHomePage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-white"
      dir="rtl"
      lang="he"
    >
      {/* Background decorations */}
      <StitchBackground />

      {/* Header */}
      <StitchHeader showSkip={true} skipText="דלג" brandName="זכויותבאדי" iconName="shield" />

      {/* Main hero section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full mt-[-20px]">
        {/* Hero illustration with floating badges */}
        <HeroIllustration />

        {/* Hero text content */}
        <HeroContent />
      </main>

      {/* CTA section */}
      <HeroActions />
    </div>
  );
}
