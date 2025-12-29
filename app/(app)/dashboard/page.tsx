import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "לוח בקרה ראשי | ZchuyotBuddy",
  description: "מרכז הפעילות שלך - סטטוס זכויות, משימות ועדכונים",
};

/**
 * Stitch Main Dashboard Page Preview
 * Based on Stitch design patterns
 */
export default function StitchDashboardPage() {
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[26px]">shield</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-text-dark">שלום, ישראל</h1>
              <p className="text-sm text-text-subtle">בוא נראה מה חדש היום</p>
            </div>
          </div>
          <Link
            href="/settings"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-subtle hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 relative z-10">
        {/* Quick stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-text-dark">5</p>
            <p className="text-xs text-text-subtle">זכויות פעילות</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">pending</span>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-text-dark">3</p>
            <p className="text-xs text-text-subtle">ממתינות לטיפול</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">description</span>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-text-dark">12</p>
            <p className="text-xs text-text-subtle">מסמכים</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">task_alt</span>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-text-dark">8</p>
            <p className="text-xs text-text-subtle">משימות שהושלמו</p>
          </div>
        </section>

        {/* Today's tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark">המשימות של היום</h2>
            <Link
              href="/today"
              className="text-primary text-sm font-bold hover:underline"
            >
              הצג הכל
            </Link>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">priority_high</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-dark mb-1">הגשת טופס 106</h3>
                  <p className="text-xs text-text-subtle mb-2">דחוף - מועד אחרון מחר</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg">
                      דחוף
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">schedule</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-dark mb-1">תור לביטוח לאומי</h3>
                  <p className="text-xs text-text-subtle mb-2">יום רביעי, 10:30</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg">
                      תזכורת
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-lg font-bold text-text-dark mb-4">פעולות מהירות</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/rights-finder"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">search</span>
              </div>
              <span className="font-bold text-text-dark text-sm">חיפוש זכויות</span>
            </Link>

            <Link
              href="/checklists"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">checklist</span>
              </div>
              <span className="font-bold text-text-dark text-sm">רשימות משימות</span>
            </Link>

            <Link
              href="/documents"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">folder</span>
              </div>
              <span className="font-bold text-text-dark text-sm">המסמכים שלי</span>
            </Link>

            <Link
              href="/rights"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">map</span>
              </div>
              <span className="font-bold text-text-dark text-sm">מפת זכויות</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-100 p-4 pb-8 sticky bottom-0 z-20">
        <div className="flex items-center justify-around">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-primary"
          >
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-xs font-bold">בית</span>
          </Link>
          <Link
            href="/rights-finder"
            className="flex flex-col items-center gap-1 text-text-subtle hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
            <span className="text-xs font-medium">חיפוש</span>
          </Link>
          <Link
            href="/checklists"
            className="flex flex-col items-center gap-1 text-text-subtle hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">checklist</span>
            <span className="text-xs font-medium">משימות</span>
          </Link>
          <Link
            href="/settings"
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

