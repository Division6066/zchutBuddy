"use client";

import Link from "next/link";

/**
 * Stitch Checklist Detail View Page Preview
 * Based on Stitch design patterns
 */
export default function StitchChecklistDetailPage() {
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
            <h1 className="text-xl font-extrabold text-text-dark">קצבת נכות כללית</h1>
            <p className="text-sm text-text-subtle">ביטוח לאומי</p>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-subtle hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      {/* Progress header */}
      <div className="bg-primary/5 p-6 border-b border-primary/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-text-dark">התקדמות כללית</span>
          <span className="text-lg font-extrabold text-primary">60%</span>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: "60%" }}
          />
        </div>
        <p className="text-xs text-text-subtle mt-2">3 מתוך 5 שלבים הושלמו</p>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-4 relative z-10">
        {/* Step 1 - Completed */}
        <div className="bg-white rounded-2xl border border-green-200 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">check</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-green-600">שלב 1</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                    הושלם
                  </span>
                </div>
                <h3 className="font-bold text-text-dark mb-1">איסוף מסמכים רפואיים</h3>
                <p className="text-sm text-text-subtle">
                  אישורים רפואיים, תיעוד טיפולים ואבחנות
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 - Completed */}
        <div className="bg-white rounded-2xl border border-green-200 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">check</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-green-600">שלב 2</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                    הושלם
                  </span>
                </div>
                <h3 className="font-bold text-text-dark mb-1">מילוי טופס תביעה</h3>
                <p className="text-sm text-text-subtle">טופס BL/6001 - תביעה לקצבת נכות כללית</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 - Completed */}
        <div className="bg-white rounded-2xl border border-green-200 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">check</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-green-600">שלב 3</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                    הושלם
                  </span>
                </div>
                <h3 className="font-bold text-text-dark mb-1">הגשת התביעה</h3>
                <p className="text-sm text-text-subtle">הגשה דרך האתר / סניף הביטוח הלאומי</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 - Current */}
        <div className="bg-white rounded-2xl border-2 border-primary shadow-lg shadow-primary/10 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <span className="text-lg font-bold">4</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">שלב 4</span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                    נוכחי
                  </span>
                </div>
                <h3 className="font-bold text-text-dark mb-1">ועדה רפואית</h3>
                <p className="text-sm text-text-subtle mb-4">
                  התייצבות לוועדה רפואית לקביעת אחוזי נכות
                </p>

                {/* Task details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-text-subtle text-[20px]">
                      calendar_today
                    </span>
                    <div>
                      <p className="text-xs text-text-subtle">תאריך הוועדה</p>
                      <p className="text-sm font-bold text-text-dark">יום רביעי, 15/01/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-text-subtle text-[20px]">
                      schedule
                    </span>
                    <div>
                      <p className="text-xs text-text-subtle">שעה</p>
                      <p className="text-sm font-bold text-text-dark">10:30</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-text-subtle text-[20px]">
                      location_on
                    </span>
                    <div>
                      <p className="text-xs text-text-subtle">מיקום</p>
                      <p className="text-sm font-bold text-text-dark">
                        סניף ביטוח לאומי, רח&apos; ויצמן 15, תל אביב
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-text-dark">מה להביא לוועדה:</p>
                  <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-text-dark">תעודת זהות</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-text-dark">כל המסמכים הרפואיים</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-text-dark">רשימת תרופות עדכנית</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 - Pending */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden opacity-60">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold">5</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400">שלב 5</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg">
                    ממתין
                  </span>
                </div>
                <h3 className="font-bold text-gray-400 mb-1">קבלת החלטה</h3>
                <p className="text-sm text-gray-400">קבלת תשובה והתחלת תשלום הקצבה</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CTA */}
      <div className="p-6 pb-10 bg-white border-t border-gray-100 sticky bottom-0 z-20">
        <button
          type="button"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ml-2">סימון שלב כהושלם</span>
          <span className="material-symbols-outlined transition-transform group-hover:scale-110">
            check
          </span>
        </button>
      </div>
    </div>
  );
}

