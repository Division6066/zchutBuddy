/**
 * Onboarding hero illustration with radar animation
 */
export default function OnboardingHero() {
  return (
    <div className="w-full relative mb-10 flex justify-center">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Main illustration circle with radar effect */}
      <div className="relative w-full aspect-square max-w-[320px] rounded-full overflow-hidden border-[6px] border-white shadow-soft bg-gradient-to-br from-primary-bg to-white p-1">
        <div className="w-full h-full rounded-full overflow-hidden relative">
          {/* Illustration */}
          <div
            className="w-full h-full bg-center bg-no-repeat bg-cover transform scale-110"
            style={{
              backgroundImage: `url("/stitch/onboarding/hero-illustration.png")`,
            }}
            role="img"
            aria-label="איור רדאר לסריקת עדכונים וזכויות"
          />

          {/* Radar circles */}
          <div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-full border border-primary/10 scale-75"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-full border border-primary/5 scale-50"
            aria-hidden="true"
          />

          {/* Radar sweep animation */}
          <div
            className="absolute top-1/2 left-1/2 w-[50%] h-[50%] bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50 origin-top-left animate-spin"
            style={{ animationDuration: "4s" }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Floating badge - New Update */}
      <div
        className="absolute bottom-4 left-0 md:left-4 bg-white border border-gray-100 rounded-2xl p-3 shadow-lg flex items-center gap-3 animate-bounce z-20"
        style={{ animationDuration: "3s" }}
      >
        <div className="bg-red-50 p-2 rounded-full text-red-500 relative">
          <span
            className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"
            aria-hidden="true"
          />
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            notifications_active
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-text-subtle font-semibold uppercase tracking-wider">
            נמצא עדכון
          </span>
          <span className="text-xs text-text-dark font-bold">מענק חדש</span>
        </div>
      </div>

      {/* Floating badge - Daily Scan */}
      <div className="absolute top-8 right-0 md:right-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl py-2 px-3 shadow-md flex items-center gap-2 transform rotate-3 z-20">
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
  );
}
