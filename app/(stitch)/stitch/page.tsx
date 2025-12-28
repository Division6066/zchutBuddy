import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stitch Preview | ZchuyotBuddy",
  description: "Preview all Stitch design templates",
};

const pages = [
  {
    title: "דף הבית (עברית)",
    description: "עמוד הנחיתה הראשי - ברוכים הבאים",
    href: "/stitch/home",
    icon: "home",
    screen: "Screen 10",
  },
  {
    title: "Home (English)",
    description: "Welcome landing page - English version",
    href: "/stitch/home-en",
    icon: "home",
    screen: "Screen 9",
  },
  {
    title: "Welcome (English)",
    description: "Onboarding welcome - English variant",
    href: "/stitch/welcome-en",
    icon: "waving_hand",
    screen: "Screen 2",
  },
  {
    title: "אונבורדינג - רדאר",
    description: "הכרת תכונת הרדאר לסריקת עדכונים",
    href: "/stitch/onboarding",
    icon: "radar",
    screen: "Screen 3",
  },
  {
    title: "הגדרת פרופיל",
    description: "מילוי פרטים אישיים",
    href: "/stitch/profile-setup",
    icon: "person_edit",
    screen: "Screen 8",
  },
  {
    title: "לוח בקרה",
    description: "מרחב עבודה - ניהול תיקים",
    href: "/stitch/app",
    icon: "dashboard",
    screen: "Screen 1",
  },
  {
    title: "מפת זכויות",
    description: "תוצאות חיפוש זכויות",
    href: "/stitch/rights-map",
    icon: "map",
    screen: "Screen 6",
  },
  {
    title: "יצירת מסמכים",
    description: "בחירת והפקת מסמכים",
    href: "/stitch/documents",
    icon: "description",
    screen: "Screen 7",
  },
  {
    title: "תוכניות מינוי",
    description: "עמוד התמחור",
    href: "/stitch/pricing",
    icon: "payments",
    screen: "Screen 4",
  },
  {
    title: "אודות",
    description: "מידע על האפליקציה",
    href: "/stitch/about",
    icon: "info",
    screen: "Screen 5",
  },
  // Additional auth & onboarding pages (scaffolded)
  {
    title: "שכחתי סיסמה",
    description: "איפוס סיסמה",
    href: "/stitch/forgot-password",
    icon: "lock_reset",
    screen: "Auth",
  },
  {
    title: "אונבורדינג - שלב 2",
    description: "פרטים בסיסיים",
    href: "/stitch/onboarding-step-2",
    icon: "person",
    screen: "Onboarding",
  },
  {
    title: "אונבורדינג - שלב 3",
    description: "מצב חיים",
    href: "/stitch/onboarding-step-3",
    icon: "home",
    screen: "Onboarding",
  },
  {
    title: "אונבורדינג - שלב 4",
    description: "מוגבלויות ומצב רפואי",
    href: "/stitch/onboarding-step-4",
    icon: "accessible",
    screen: "Onboarding",
  },
  {
    title: "אונבורדינג - שלב 6",
    description: "סיכום ואישור",
    href: "/stitch/onboarding-step-6",
    icon: "fact_check",
    screen: "Onboarding",
  },
  // App screens (scaffolded)
  {
    title: "לוח בקרה ראשי",
    description: "מרכז הפעילות - סטטוס זכויות ומשימות",
    href: "/stitch/dashboard",
    icon: "dashboard",
    screen: "App",
  },
  {
    title: "חיפוש זכויות",
    description: "מצא את הזכויות המתאימות לך",
    href: "/stitch/rights-finder",
    icon: "search",
    screen: "App",
  },
  {
    title: "תוצאות חיפוש",
    description: "הזכויות שנמצאו עבורך",
    href: "/stitch/rights-answer",
    icon: "list_alt",
    screen: "App",
  },
  {
    title: "רשימות משימות",
    description: "מעקב אחר התקדמות מימוש הזכויות",
    href: "/stitch/checklists",
    icon: "checklist",
    screen: "App",
  },
  {
    title: "פירוט משימה",
    description: "צפייה מפורטת בשלבי משימה",
    href: "/stitch/checklists/detail",
    icon: "task",
    screen: "App",
  },
  {
    title: "מצב יום",
    description: "המשימות והתורים של היום",
    href: "/stitch/today",
    icon: "today",
    screen: "App",
  },
  {
    title: "פרופיל והגדרות",
    description: "ניהול חשבון והעדפות",
    href: "/stitch/settings",
    icon: "settings",
    screen: "App",
  },
];

/**
 * Stitch Preview Index Page
 * Lists all available Stitch template previews
 */
export default function StitchIndexPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-2xl md:mx-auto no-scrollbar bg-gray-50"
      dir="rtl"
      lang="he"
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-6 pt-12 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[28px]" aria-hidden="true">
              palette
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-dark">Stitch Preview</h1>
            <p className="text-text-subtle text-sm">תצוגה מקדימה של עיצובי Stitch</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="grid gap-4">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
                    {page.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-text-dark text-lg">{page.title}</h3>
                    <span className="text-[10px] font-bold text-text-subtle bg-gray-100 px-2 py-1 rounded">
                      {page.screen}
                    </span>
                  </div>
                  <p className="text-text-subtle text-sm">{page.description}</p>
                </div>
                <span
                  className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors rotate-180 self-center"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Info box */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600" aria-hidden="true">
              info
            </span>
            <div>
              <h4 className="font-bold text-amber-900 mb-1">מצב תצוגה מקדימה</h4>
              <p className="text-sm text-amber-800">
                עמודים אלו הם תצוגה מקדימה של עיצובי Stitch. הם מופרדים מהאפליקציה הראשית עד לאישור
                סופי.
              </p>
            </div>
          </div>
        </div>

        {/* Back to main app */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_forward
            </span>
            חזרה לאפליקציה הראשית
          </Link>
        </div>
      </main>
    </div>
  );
}
