"use client";

import Link from "next/link";

/**
 * Stitch Today Mode View Page Preview
 * Based on Stitch design patterns
 */
export default function StitchTodayPage() {
  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-white"
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
        <div className="flex items-center gap-4">
          <Link
            href="/stitch/checklists"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-dark hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-text-dark">מצב יום</h1>
            <p className="text-sm text-text-subtle">יום רביעי, 28 בדצמבר</p>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-subtle hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">calendar_today</span>
          </button>
        </div>
      </header>

      {/* Daily summary */}
      <div className="bg-primary/5 p-6 border-b border-primary/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[32px]">wb_sunny</span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-text-dark">בוקר טוב, ישראל!</h2>
            <p className="text-sm text-text-subtle">יש לך 3 משימות להיום</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-xl font-extrabold text-red-600">1</p>
            <p className="text-xs text-text-subtle">דחוף</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-xl font-extrabold text-amber-600">1</p>
            <p className="text-xs text-text-subtle">תור/פגישה</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-xl font-extrabold text-blue-600">1</p>
            <p className="text-xs text-text-subtle">משימה</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 relative z-10">
        {/* Urgent section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-red-600">priority_high</span>
            <h2 className="text-lg font-bold text-text-dark">דורש טיפול מיידי</h2>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">description</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-dark mb-1">הגשת טופס 106</h3>
                <p className="text-xs text-red-600 mb-3 font-medium">
                  ⚠️ מועד אחרון: מחר, 29/12
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors"
                  >
                    התחל עכשיו
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
                  >
                    דחה
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Appointments section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-amber-600">event</span>
            <h2 className="text-lg font-bold text-text-dark">תורים ופגישות</h2>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">medical_services</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-dark mb-1">תור לביטוח לאומי</h3>
                <div className="flex items-center gap-2 text-sm text-text-subtle mb-2">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>10:30</span>
                  <span className="mx-1">•</span>
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>סניף תל אביב</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    className="flex-1 py-2 rounded-xl bg-gray-100 text-text-dark font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">navigation</span>
                    ניווט
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 rounded-xl bg-gray-100 text-text-dark font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    התקשר
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tasks section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-blue-600">task_alt</span>
            <h2 className="text-lg font-bold text-text-dark">משימות להיום</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                className="w-6 h-6 text-primary border-gray-300 rounded-lg focus:ring-primary"
              />
              <div className="flex-1">
                <h3 className="font-bold text-text-dark">להכין מסמכים לוועדה</h3>
                <p className="text-xs text-text-subtle">קצבת נכות כללית</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">
                בינוני
              </span>
            </label>

            <label className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors opacity-60">
              <input
                type="checkbox"
                defaultChecked
                className="w-6 h-6 text-primary border-gray-300 rounded-lg focus:ring-primary"
              />
              <div className="flex-1">
                <h3 className="font-bold text-text-dark line-through">לצלם תעודת זהות</h3>
                <p className="text-xs text-text-subtle">הנחה בארנונה</p>
              </div>
              <span className="material-symbols-outlined text-green-600">check_circle</span>
            </label>
          </div>
        </section>

        {/* Reminders section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-purple-600">notifications</span>
            <h2 className="text-lg font-bold text-text-dark">תזכורות</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-purple-50 border border-purple-100 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">alarm</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-dark text-sm">תזכורת לקחת תרופות</h3>
                <p className="text-xs text-purple-600">בעוד שעה</p>
              </div>
              <button type="button" className="text-purple-600 hover:text-purple-800">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Add task FAB */}
      <button
        type="button"
        className="fixed bottom-24 left-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-light transition-colors z-30"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

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
          <Link
            href="/stitch/checklists"
            className="flex flex-col items-center gap-1 text-text-subtle hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">checklist</span>
            <span className="text-xs font-medium">משימות</span>
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

