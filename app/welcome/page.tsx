import Image from "next/image";
import Link from "next/link";

/**
 * i18n-ready copy constants
 * Extract to a translation file when internationalizing
 */
const copy = {
  brandName: "זכויותבאדי",
  skip: "דלג",
  heroTitle: "ה-GPS לזכויות שלך",
  heroTitleHighlight: "טייס-משנה לניירת",
  heroDescription:
    "נווט בקלות בנבכי הזכויות הרפואיות. אנו מטפלים בניירת כדי שתקבל בדיוק את מה שמגיע לך.",
  statusLabel: "סטטוס",
  statusValue: "הזכויות הובטחו",
  paperworkBadge: "ניירת: הושלמה",
  startClaimButton: "התחל תביעה",
  howItWorksButton: "איך זה עובד?",
  heroImageAlt:
    "3D illustration of a map with a location pin and a friendly robot helper navigating a path",
} as const;

/**
 * Route constants for navigation
 */
const routes = {
  skip: "/app",
  startClaim: "/onboarding",
  howItWorks: "/about",
} as const;

/**
 * Remote hero illustration URL from Stitch export
 */
const heroImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4zUnviN4IpOlZeDPaJ2J4cG_0vcnhl46zxi6wfLNoVufeO_MWATkihVIxSi1yyPaM84sdW8txXsJghDalHb72nSj2PN1MoXTAzHQY6prVO2MA0vT6qk5glXKUQd0uDyNi0VAA4BoZxIcJ7IOBE29bqVPKuboH49odFb2phRSX0mjLOPhIrUTysvKA8yxPdwwZsEWT98LBZgFbm2yNYYE0b8Mg3m8p-bVvG0SARULvZFqGNCiEkQuXghXHhN53QHYRXdHgffiA-TA";

export default function WelcomePage() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden bg-white font-display text-text-dark antialiased md:mx-auto md:max-w-md md:border-x md:border-gray-100"
    >
      {/* Background blurs */}
      <div
        className="pointer-events-none absolute right-[-20%] top-[-20%] h-[60%] w-[80%] rounded-full bg-primary/5 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[50%] w-[60%] rounded-full bg-primary/10 blur-[100px]"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="z-10 flex items-center justify-between p-6 pt-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
            <span
              className="material-symbols-outlined text-[20px] font-bold"
              aria-hidden="true"
            >
              shield
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-text-dark">
            {copy.brandName}
          </span>
        </div>
        <Link
          href={routes.skip}
          className="rounded-full px-4 py-2 text-sm font-semibold text-text-subtle transition-colors hover:bg-primary-bg hover:text-primary"
        >
          {copy.skip}
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mt-[-20px] flex flex-1 flex-col items-center justify-center px-6">
        {/* Hero illustration container */}
        <div className="relative mb-10 flex w-full justify-center">
          {/* Glow behind illustration */}
          <div
            className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl"
            aria-hidden="true"
          />

          {/* Main illustration circle */}
          <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-full border-4 border-white bg-gradient-to-b from-primary-bg to-white p-6 shadow-soft">
            <div className="relative h-full w-full scale-105 overflow-hidden rounded-full">
              <Image
                src={heroImageUrl}
                alt={copy.heroImageAlt}
                fill
                priority
                sizes="(max-width: 768px) 280px, 320px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Status badge - bottom left */}
          <div
            className="absolute -left-2 bottom-6 flex animate-bounce items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 pl-5 shadow-lg md:left-8 [animation-duration:4s]"
            aria-label={`${copy.statusLabel}: ${copy.statusValue}`}
          >
            <div className="rounded-full bg-green-100 p-2 text-green-600">
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                verified
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
                {copy.statusLabel}
              </span>
              <span className="text-xs font-bold text-text-dark">
                {copy.statusValue}
              </span>
            </div>
          </div>

          {/* Paperwork badge - top right */}
          <div
            className="absolute right-0 top-10 flex rotate-6 items-center gap-2 rounded-2xl border border-white/50 bg-white/80 px-3 py-2 shadow-md backdrop-blur-sm md:right-4"
            aria-label={copy.paperworkBadge}
          >
            <span
              className="material-symbols-outlined text-[18px] text-primary"
              aria-hidden="true"
            >
              description
            </span>
            <span className="text-[10px] font-bold text-text-dark">
              {copy.paperworkBadge}
            </span>
          </div>
        </div>

        {/* Hero text */}
        <div className="mx-auto flex max-w-sm flex-col items-center space-y-4 text-center">
          <h1 className="text-[32px] font-extrabold leading-[1.2] tracking-tight text-text-dark">
            {copy.heroTitle}
            <br />ו
            <span className="relative inline-block text-primary">
              {copy.heroTitleHighlight}
              <svg
                className="absolute -bottom-1 left-0 h-2 w-full text-primary/20"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
                aria-hidden="true"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
            </span>
          </h1>
          <p className="px-2 text-base font-medium leading-relaxed text-text-subtle">
            {copy.heroDescription}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="z-10 flex w-full flex-col gap-5 bg-white p-6 pb-10">
        {/* Progress dots */}
        <div
          className="mb-2 flex flex-row-reverse justify-center gap-2"
          aria-hidden="true"
        >
          <div className="h-2 w-8 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <div className="h-2 w-2 rounded-full bg-gray-200" />
          <div className="h-2 w-2 rounded-full bg-gray-200" />
        </div>

        {/* Primary CTA */}
        <Link
          href={routes.startClaim}
          className="group relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="ml-2 text-lg font-bold tracking-tight">
            {copy.startClaimButton}
          </span>
          <span
            className="material-symbols-outlined transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          >
            arrow_back
          </span>
        </Link>

        {/* Secondary CTA */}
        <Link
          href={routes.howItWorks}
          className="group flex items-center justify-center gap-1 py-1 text-sm font-semibold text-text-subtle transition-colors hover:text-primary"
        >
          <span
            className="material-symbols-outlined text-lg transition-transform group-hover:scale-110"
            aria-hidden="true"
          >
            help
          </span>
          {copy.howItWorksButton}
        </Link>

        {/* Spacer */}
        <div className="h-2" aria-hidden="true" />
      </section>
    </main>
  );
}

