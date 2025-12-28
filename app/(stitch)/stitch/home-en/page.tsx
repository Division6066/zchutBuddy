import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome | ZchuyotBuddy",
  description: "Your Rights GPS & Paperwork Co-pilot - Navigate disability benefits easily",
};

/**
 * Stitch Home Page (English) Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_9/
 */
export default function StitchHomeEnPage() {
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
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <span className="text-text-dark font-extrabold text-xl tracking-tight">ZchuyotBuddy</span>
        </div>
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-primary-bg"
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full mt-[-20px]">
        {/* Hero illustration */}
        <div className="w-full relative mb-10 flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative w-full aspect-square max-w-[320px] rounded-full overflow-hidden border-4 border-white shadow-soft bg-gradient-to-b from-primary-bg to-white p-6">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-contain transform scale-105"
              style={{
                backgroundImage: 'url("/stitch/home/hero-illustration.png")',
                borderRadius: "50%",
              }}
            />
          </div>

          {/* Floating badge - Rights Secured */}
          <div
            className="absolute bottom-6 -right-2 md:right-8 bg-white border border-gray-100 rounded-2xl p-3 pr-5 shadow-lg flex items-center gap-3 animate-bounce"
            style={{ animationDuration: "4s" }}
          >
            <div className="bg-green-50 p-2 rounded-full text-green-500">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-subtle font-semibold uppercase tracking-wider">
                Status
              </span>
              <span className="text-xs text-text-dark font-bold">Rights Secured</span>
            </div>
          </div>

          {/* Floating badge - Paperwork Done */}
          <div className="absolute top-10 left-0 md:left-4 bg-white/90 backdrop-blur-md border border-gray-100 rounded-xl py-2 px-4 shadow-md flex items-center gap-3 transform -rotate-3">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-primary">description</span>
            </div>
            <span className="text-[11px] text-text-dark font-bold">Paperwork: Done</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
          <h1 className="text-text-dark tracking-tight text-[32px] font-extrabold leading-[1.2]">
            Your Rights GPS &amp;{" "}
            <span className="text-primary relative inline-block whitespace-nowrap">
              Paperwork Co-pilot
              <svg
                className="absolute w-full h-2 -bottom-1 left-0 text-primary/30"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </span>
          </h1>
          <p className="text-text-subtle text-base font-medium leading-relaxed px-2 text-center">
            Navigate disability benefits easily. We handle the paperwork so you get exactly what you
            deserve.
          </p>
        </div>
      </div>

      {/* CTA section */}
      <div className="flex flex-col gap-6 p-6 pb-10 w-full z-10 bg-white">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-8 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight mr-2">Start My Claim</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>

        {/* Secondary link */}
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold py-1 hover:text-primary transition-colors flex items-center justify-center gap-2 group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform text-text-subtle group-hover:text-primary">
            help
          </span>
          How does it work?
        </button>

        <div className="h-2" />
      </div>
    </div>
  );
}

