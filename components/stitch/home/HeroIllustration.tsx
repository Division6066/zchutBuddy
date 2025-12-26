import Image from "next/image";

/**
 * Hero illustration with floating status badges
 */
export default function HeroIllustration() {
  return (
    <div className="w-full relative mb-10 flex justify-center">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-primary/10 rounded-full blur-2xl"
        aria-hidden="true"
      />

      {/* Main illustration circle */}
      <div className="relative w-full aspect-square max-w-[320px] rounded-full overflow-hidden border-4 border-white shadow-soft bg-gradient-to-b from-primary-bg to-white p-6">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-contain transform scale-105 rounded-full"
          style={{
            backgroundImage: `url("/stitch/home/hero-illustration.png")`,
          }}
          role="img"
          aria-label="איור תלת מימדי של מפה עם סיכת מיקום ורובוט עוזר ידידותי המנווט בנתיב"
        />
      </div>

      {/* Floating badge - Rights Secured */}
      <div
        className="absolute bottom-6 -left-2 md:left-8 bg-white border border-gray-100 rounded-2xl p-3 pl-5 shadow-lg flex items-center gap-3 animate-bounce z-20"
        style={{ animationDuration: "4s" }}
      >
        <div className="bg-green-100 p-2 rounded-full text-green-600">
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            verified
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-text-subtle font-semibold uppercase tracking-wider">
            סטטוס
          </span>
          <span className="text-xs text-text-dark font-bold">הזכויות הובטחו</span>
        </div>
      </div>

      {/* Floating badge - Paperwork Done */}
      <div className="absolute top-10 right-0 md:right-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl py-2 px-3 shadow-md flex items-center gap-2 transform rotate-6 z-20">
        <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">
          description
        </span>
        <span className="text-[10px] text-text-dark font-bold">ניירת: הושלמה</span>
      </div>
    </div>
  );
}
