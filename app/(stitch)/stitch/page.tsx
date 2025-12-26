import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stitch Preview | ZchuyotBuddy",
  description: "Preview all Stitch design templates",
};

const pages = [
  {
    title: "דף הבית",
    description: "עמוד הנחיתה הראשי - ברוכים הבאים",
    href: "/stitch/home",
    icon: "home",
    screen: "Screen 10",
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
