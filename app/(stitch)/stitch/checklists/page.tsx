import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "רשימות המשימות שלי | ZchuyotBuddy",
  description: "מעקב אחר התקדמות מימוש הזכויות",
};

/**
 * Stitch My Checklists Page Preview
 * Based on Stitch design patterns
 */
export default function StitchChecklistsPage() {
  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-gray-50/50"
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

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 p-6 pt-12 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-text-dark">המשימות שלי</h1>
            <p className="text-sm text-text-subtle">מעקב אחר התקדמות המימוש</p>
          </div>
          <Link
            href="/stitch/today"
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-light transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">today</span>
            מצב יום
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 relative z-10">
        {/* Progress overview */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-text-dark mb-4">סיכום התקדמות</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold text-green-600">3</p>
              <p className="text-xs text-text-subtle">הושלמו</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-amber-600">2</p>
              <p className="text-xs text-text-subtle">בתהליך</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-400">4</p>
              <p className="text-xs text-text-subtle">ממתינות</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: "33%" }} />
          </div>
          <p className="text-xs text-text-subtle mt-2 text-center">3 מתוך 9 משימות הושלמו</p>
        </section>

        {/* Active checklists */}
        <section>
          <h2 className="text-lg font-bold text-text-dark mb-4">רשימות פעילות</h2>

          <div className="space-y-4">
            {/* Checklist 1 - In progress */}
            <Link
              href="/stitch/checklists/detail"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">pending_actions</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-text-dark">קצבת נכות כללית</h3>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">
                      בתהליך
                    </span>
                  </div>
                  <p className="text-sm text-text-subtle mb-3">ביטוח לאומי</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "60%" }} />
                    </div>
                    <span className="text-xs font-bold text-amber-600">60%</span>
                  </div>
                  <p className="text-xs text-text-subtle mt-2">3 מתוך 5 שלבים הושלמו</p>
                </div>
              </div>
            </Link>

            {/* Checklist 2 - In progress */}
            <Link
              href="/stitch/checklists/detail"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">home</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-text-dark">הנחה בארנונה</h3>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">
                      בתהליך
                    </span>
                  </div>
                  <p className="text-sm text-text-subtle mb-3">עירייה</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "25%" }} />
                    </div>
                    <span className="text-xs font-bold text-blue-600">25%</span>
                  </div>
                  <p className="text-xs text-text-subtle mt-2">1 מתוך 4 שלבים הושלמו</p>
                </div>
              </div>
            </Link>

            {/* Checklist 3 - Completed */}
            <Link
              href="/stitch/checklists/detail"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">check_circle</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-text-dark">תו נכה לרכב</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                      הושלם
                    </span>
                  </div>
                  <p className="text-sm text-text-subtle mb-3">משרד התחבורה</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
                    </div>
                    <span className="text-xs font-bold text-green-600">100%</span>
                  </div>
                  <p className="text-xs text-green-600 mt-2 font-medium">✓ אושר ב-15/12/2024</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Pending checklists */}
        <section>
          <h2 className="text-lg font-bold text-text-dark mb-4">ממתינות להתחלה</h2>

          <div className="space-y-3">
            <Link
              href="/stitch/checklists/detail"
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">local_taxi</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-dark text-sm">גמלת ניידות</h3>
                <p className="text-xs text-text-subtle">טרם התחיל</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </Link>

            <Link
              href="/stitch/checklists/detail"
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">directions_bus</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-dark text-sm">נסיעה חינם בתחבורה ציבורית</h3>
                <p className="text-xs text-text-subtle">טרם התחיל</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-100 p-4 pb-8 sticky bottom-0 z-20">
        <div className="flex items-center justify-around">
          <Link
            href="/stitch/dashboard"
            className="flex flex-col items-center gap-1 text-text-subtle hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-xs font-medium">בית</span>
          </Link>
          <Link
            href="/stitch/rights-finder"
            className="flex flex-col items-center gap-1 text-text-subtle hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
            <span className="text-xs font-medium">חיפוש</span>
          </Link>
          <Link href="/stitch/checklists" className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[24px]">checklist</span>
            <span className="text-xs font-bold">משימות</span>
          </Link>
          <Link
            href="/stitch/settings"
            className="flex flex-col items-center gap-1 text-text-subtle hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">person</span>
            <span className="text-xs font-medium">פרופיל</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
