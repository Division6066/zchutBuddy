import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome | ZchuyotBuddy",
  description: "Your Rights GPS & Paperwork Co-pilot",
};

/**
 * Stitch Welcome Page (English) Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_2/
 */
export default function StitchWelcomeEnPage() {
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
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-20%] w-[70%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[24px]">shield_with_heart</span>
          </div>
          <span className="text-text-dark font-extrabold text-xl tracking-tight">ZchuyotBuddy</span>
        </div>
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-primary-bg/50"
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full mt-[-20px]">
        {/* Hero illustration */}
        <div className="w-full relative mb-12 flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-primary/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-primary/20 rounded-full border-dashed" />
          <div className="relative w-full aspect-square max-w-[280px] rounded-full overflow-hidden shadow-soft bg-white p-2 z-10">
            <div className="w-full h-full bg-primary-bg rounded-full overflow-hidden relative">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-contain transform scale-110 mt-4"
                style={{
                  backgroundImage:
                    'url("/stitch/home/hero-illustration.png")',
                }}
              />
            </div>
          </div>

          {/* Floating badge - Rights Secured */}
          <div
            className="absolute -bottom-4 right-0 md:right-8 bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 animate-bounce z-20 border border-gray-50"
            style={{ animationDuration: "3s" }}
          >
            <div className="bg-green-50 p-2.5 rounded-xl text-green-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px] filled">verified</span>
            </div>
            <div className="flex flex-col pr-2">
              <span className="text-[10px] text-text-subtle font-bold uppercase tracking-wider mb-0.5">
                Status
              </span>
              <span className="text-sm text-text-dark font-bold leading-none">Rights Secured</span>
            </div>
          </div>

          {/* Floating badge - Paperwork Done */}
          <div className="absolute top-4 left-0 md:left-6 bg-white rounded-full py-2.5 px-4 shadow-card flex items-center gap-2.5 transform -rotate-3 border border-gray-50 z-20">
            <div className="bg-primary/10 p-1.5 rounded-full text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">description</span>
            </div>
            <span className="text-xs text-text-dark font-bold pr-1">Paperwork: Done</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex flex-col items-center text-center space-y-5 max-w-sm mx-auto">
          <h1 className="text-text-dark tracking-tight text-[32px] font-extrabold leading-[1.15]">
            Your Rights GPS &amp; <br />
            <span className="text-primary relative inline-block pb-1">
              Paperwork Co-pilot
              <svg
                className="absolute w-full h-2.5 bottom-0 left-0 text-primary/30"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
            </span>
          </h1>
          <p className="text-text-subtle text-[17px] font-medium leading-relaxed px-1">
            Navigate disability benefits easily. We handle the paperwork so you get exactly what you
            deserve.
          </p>
        </div>
      </div>

      {/* CTA section */}
      <div className="flex flex-col gap-6 p-6 pb-10 w-full z-10 bg-white">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-1">
          <div className="w-8 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98]"
        >
          <span className="text-[17px] font-bold tracking-tight mr-2">Start My Claim</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-[20px]">
            arrow_forward
          </span>
        </button>

        {/* Secondary link */}
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors flex items-center justify-center gap-1.5 group -mt-2"
        >
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-text-subtle group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[14px]">question_mark</span>
          </div>
          How does it work?
        </button>

        <div className="h-2" />
      </div>
    </div>
  );
}

