import Link from "next/link";

/**
 * Hero section CTA buttons and progress indicators
 */
export default function HeroActions() {
  return (
    <div className="flex flex-col gap-5 p-6 pb-10 w-full z-10 bg-white">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-2 flex-row-reverse" aria-label="שלב 1 מתוך 3">
        <div className="w-8 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
        <div className="w-2 h-2 rounded-full bg-gray-200" />
        <div className="w-2 h-2 rounded-full bg-gray-200" />
      </div>

      {/* Primary CTA */}
      <Link
        href="/onboarding"
        className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
      >
        <span className="text-lg font-bold tracking-tight ml-2">התחל תביעה</span>
        <span
          className="material-symbols-outlined transition-transform group-hover:-translate-x-1"
          aria-hidden="true"
        >
          arrow_back
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

      {/* Spacer */}
      <div className="h-2" />
    </div>
  );
}
