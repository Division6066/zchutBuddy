import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אודות | ZchuyotBuddy",
  description: "ה-GPS למימוש הזכויות שלך - אנחנו כאן לעזור לך לנווט בנבכי הבירוקרטיה",
};

/**
 * i18n-ready copy constants
 * Extract to a translation file when internationalizing
 */
const copy = {
  pageTitle: "אודות",
  backLabel: "חזרה",
  brandName: "זכויותבאדי",
  tagline: "ה-GPS למימוש הזכויות שלך",
  description:
    'אנחנו כאן כדי לעזור לך לנווט בנבכי הבירוקרטיה ולממש את מלוא הזכויות המגיעות לך. האפליקציה משמשת כ"טייס משנה" למילוי טפסים והגשת תביעות בצורה פשוטה וברורה.',
  version: "גרסה 1.0.2",
  copyright: "© 2024 ZchuyotBuddy",
} as const;

/**
 * Feature card type definition
 */
interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "explore",
    title: "ניווט חכם",
    description: "מפת דרכים מותאמת אישית למימוש הזכויות הרפואיות שלך, צעד אחר צעד.",
  },
  {
    icon: "description",
    title: "עזרה בניירת",
    description: "אנחנו דואגים לבירוקרטיה ולטפסים, כדי שאתם תוכלו להתמקד במה שחשוב.",
  },
  {
    icon: "diversity_1",
    title: "אנחנו איתך",
    description: "צוות המומחים שלנו פיתח את המערכת מתוך הבנה עמוקה של הצרכים שלך.",
  },
];

/**
 * Navigation link type definition
 */
interface NavLink {
  icon: string;
  text: string;
  href: string;
}

const links: NavLink[] = [
  { icon: "gavel", text: "תנאי שימוש", href: "/terms" },
  { icon: "policy", text: "מדיניות פרטיות", href: "/privacy" },
  { icon: "mail", text: "צור קשר", href: "#contact" },
];

/**
 * About Page
 * Based on Stitch design: welcome_to_zchuyotbuddy_5
 */
export default function AboutPage() {
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
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full text-text-dark transition-colors hover:bg-gray-100"
          aria-label={copy.backLabel}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </Link>
        <span className="text-lg font-bold text-text-dark">{copy.pageTitle}</span>
        <div className="w-10" aria-hidden="true" />
      </header>

      {/* Hero Section - Logo and title */}
      <section className="z-10 mt-4 mb-10 flex flex-col items-center px-6 text-center">
        <div className="relative mb-6 h-24 w-24">
          <div className="absolute inset-0 flex rotate-3 transform items-center justify-center rounded-[2rem] bg-primary shadow-glow transition-transform hover:rotate-0">
            <span
              className="material-symbols-outlined text-[48px] text-white"
              aria-hidden="true"
            >
              medical_services
            </span>
          </div>
          <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-1.5 shadow-md">
            <span
              className="material-symbols-outlined text-[20px] text-accent"
              aria-hidden="true"
            >
              verified
            </span>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-text-dark">
          {copy.brandName}
        </h1>
        <p className="rounded-full bg-primary-bg px-3 py-1 text-sm font-semibold text-primary">
          {copy.tagline}
        </p>
      </section>

      {/* Content Section */}
      <section className="z-10 flex flex-1 flex-col space-y-6 overflow-y-auto px-6 pb-10">
        {/* Description */}
        <div className="px-2 text-center">
          <p className="text-base leading-relaxed text-text-subtle">{copy.description}</p>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid gap-4">
          {features.map((feature) => (
            <article
              key={feature.icon}
              className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-soft"
            >
              <div className="shrink-0 rounded-xl bg-primary-bg p-3 text-primary">
                <span className="material-symbols-outlined" aria-hidden="true">
                  {feature.icon}
                </span>
              </div>
              <div>
                <h2 className="mb-1 text-lg font-bold text-text-dark">{feature.title}</h2>
                <p className="text-sm leading-relaxed text-text-subtle">{feature.description}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 space-y-1 border-t border-gray-100 pt-6" aria-label="דפים נוספים">
          {links.map((link) => (
            <Link
              key={link.icon}
              href={link.href}
              className="group flex w-full items-center justify-between rounded-xl p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-text-subtle"
                  aria-hidden="true"
                >
                  {link.icon}
                </span>
                <span className="font-medium text-text-dark">{link.text}</span>
              </div>
              <span
                className="material-symbols-outlined rotate-180 text-gray-300 transition-colors group-hover:text-primary"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <footer className="pb-4 pt-8 text-center">
          <p className="text-xs text-text-subtle">{copy.version}</p>
          <p className="mt-1 text-xs text-gray-400">{copy.copyright}</p>
        </footer>
      </section>
    </main>
  );
}
