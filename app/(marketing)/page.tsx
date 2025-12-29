import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ברוכים הבאים | ZchuyotBuddy",
  description: "ה-GPS לזכויות שלך - וטייס-משנה לניירת",
};

/**
 * Stitch Home Page (Hebrew) Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_10/
 */
export default function StitchHomePage() {
  return (
    <div
      dir="rtl"
      className="relative flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-white"
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Background decorations */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full mt-[-20px]">
        {/* Hero illustration */}
        <div className="w-full relative mb-10 flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-primary/10 rounded-full blur-2xl" />
          <div className="relative w-full aspect-square max-w-[320px] rounded-full overflow-hidden border-4 border-white shadow-soft bg-gradient-to-b from-primary-bg to-white p-6">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-contain transform scale-105"
              style={{
                backgroundImage: 'url("/stitch/home/hero-illustration.png")',
                borderRadius: "50%",
              }}
            />
          </div>

          {/* Floating badge - Rights Secured (Hebrew) */}
          <div
            className="absolute bottom-6 -left-2 md:left-8 bg-white border border-gray-100 rounded-2xl p-3 pl-5 shadow-lg flex items-center gap-3 animate-bounce"
            style={{ animationDuration: "4s" }}
          >
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-text-subtle font-semibold uppercase tracking-wider">
                סטטוס
              </span>
              <span className="text-xs text-text-dark font-bold">הזכויות הובטחו</span>
            </div>
          </div>

          {/* Floating badge - Paperwork Done (Hebrew) */}
          <div className="absolute top-10 right-0 md:right-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl py-2 px-3 shadow-md flex items-center gap-2 transform rotate-6">
            <span className="material-symbols-outlined text-[18px] text-primary">description</span>
            <span className="text-[10px] text-text-dark font-bold">ניירת: הושלמה</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
          <h1 className="text-text-dark tracking-tight text-[32px] font-extrabold leading-[1.2]">
            ה-GPS לזכויות שלך <br />ו
            <span className="text-primary relative inline-block">
              טייס-משנה לניירת
              <svg
                className="absolute w-full h-2 -bottom-1 left-0 text-primary/20"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </span>
          </h1>
          <p className="text-text-subtle text-base font-medium leading-relaxed px-2">
            נווט בקלות בנבכי הזכויות הרפואיות. אנו מטפלים בניירת כדי שתקבל בדיוק את מה שמגיע לך.
          </p>
        </div>
      </div>

      {/* CTA section */}
      <div className="flex flex-col gap-5 p-6 pb-10 w-full z-10 bg-white">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-2 flex-row-reverse">
          <div className="w-8 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ml-2">התחל תביעה</span>
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
        </button>

        {/* Secondary link */}
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold py-1 hover:text-primary transition-colors flex items-center justify-center gap-1 group"
        >
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
            help
          </span>
          איך זה עובד?
        </button>

        <div className="h-2" />
      </div>
    </div>
  );
}
