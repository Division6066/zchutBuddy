import type { Metadata } from "next";

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

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-[24px] font-bold">radar</span>
          </div>
          <span className="text-text-dark font-black text-xl tracking-tight">רדאר עדכונים</span>
        </div>
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-primary-bg"
        >
          דלג
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full mt-[-20px]">
        {/* Hero illustration */}
        <div className="w-full relative mb-12 flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative w-full aspect-square max-w-[320px] rounded-full overflow-hidden border-[6px] border-white shadow-soft bg-gradient-to-br from-primary-bg to-white p-1">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover transform scale-110"
                style={{
                  backgroundImage: 'url("/stitch/onboarding/radar-illustration.png")',
                }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border border-primary/10 scale-75" />
              <div className="absolute inset-0 rounded-full border border-primary/5 scale-50" />
              <div
                className="absolute top-1/2 left-1/2 w-[50%] h-[50%] bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50 origin-top-left animate-spin"
                style={{ animationDuration: "4s" }}
              />
            </div>
          </div>

          {/* Floating badge - Update found */}
          <div
            className="absolute bottom-4 left-0 md:left-4 bg-white border border-gray-100 rounded-2xl p-3 shadow-lg flex items-center gap-3 animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <div className="bg-red-50 p-2 rounded-full text-red-500 relative">
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-text-subtle font-semibold uppercase tracking-wider">
                נמצא עדכון
              </span>
              <span className="text-xs text-text-dark font-bold">מענק חדש</span>
            </div>
          </div>

          {/* Floating badge - Daily scan */}
          <div className="absolute top-8 right-0 md:right-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl py-2 px-3 shadow-md flex items-center gap-2 transform rotate-3">
            <div className="flex -space-x-2 space-x-reverse">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 border border-white">
                B
              </div>
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-700 border border-white">
                M
              </div>
            </div>
            <span className="text-[11px] text-text-dark font-bold pr-1">סריקה יומית</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto rtl">
          <h1 className="text-text-dark tracking-tight text-[28px] font-extrabold leading-[1.2]">
            כל העדכונים{" "}
            <span className="text-primary relative inline-block whitespace-nowrap">
              במקום אחד
              <svg
                className="absolute w-full h-2 -bottom-1 left-0 text-primary/20"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
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
      </div>

      {/* CTA section */}
      <div className="flex flex-col gap-5 p-6 pb-10 w-full z-10 bg-white">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-2 dir-ltr">
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-8 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ml-2">הפעלת רדאר אישי</span>
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1 rotate-180">
            arrow_back
          </span>
        </button>

        {/* Secondary link */}
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold py-1 hover:text-primary transition-colors flex items-center justify-center gap-1 group"
        >
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
            tune
          </span>
          התאם הגדרות חיפוש
        </button>

        <div className="h-2" />
      </div>
    </div>
  );
}

