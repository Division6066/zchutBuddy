import type { Metadata } from "next";
import HeroActions from "@/components/stitch/home/HeroActions";
import HeroContent from "@/components/stitch/home/HeroContent";
import HeroIllustration from "@/components/stitch/home/HeroIllustration";
import StitchBackground from "@/components/stitch/StitchBackground";

export const metadata: Metadata = {
  title: "ZchuyotBuddy | ה-GPS לזכויות שלך",
  description: "ה-GPS לזכויות שלך - וטייס-משנה לניירת. נווט בקלות בנבכי הזכויות הרפואיות.",
};

/**
 * Homepage - Stitch Design
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_10/
 */
export default function HomePage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden no-scrollbar bg-white"
      dir="rtl"
      lang="he"
    >
      {/* Background decorations */}
      <StitchBackground />

      {/* Main hero section */}
      <main
        id="main-content"
        className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full max-w-2xl mx-auto py-12"
      >
        {/* Hero illustration with floating badges */}
        <HeroIllustration />

        {/* Hero text content */}
        <HeroContent />
      </main>

      {/* CTA section */}
      <div className="max-w-2xl mx-auto w-full">
        <HeroActions />
      </div>
    </div>
  );
}
