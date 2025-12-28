"use client";

import Link from "next/link";

/**
 * Stitch Rights Finder Page Preview
 * Based on Stitch design patterns
 */
export default function StitchRightsFinderPage() {
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
            href="/stitch/dashboard"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-dark hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-text-dark">חיפוש זכויות</h1>
            <p className="text-sm text-text-subtle">מצא את הזכויות המתאימות לך</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 relative z-10">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="חפש זכות, קצבה, הטבה..."
            className="w-full px-4 py-4 pr-12 rounded-2xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>

        {/* AI Assistant prompt */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark mb-1">שאל את הבאדי</h3>
              <p className="text-sm text-text-subtle mb-3">
                תאר את המצב שלך ואעזור לך למצוא זכויות רלוונטיות
              </p>
              <textarea
                placeholder="לדוגמה: אני הורה לילד עם צרכים מיוחדים, עובד במשרה חלקית..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-0 transition-all text-right placeholder-gray-400 text-sm resize-none"
                rows={3}
              />
              <button
                type="button"
                className="mt-3 w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-light transition-colors"
              >
                חפש זכויות מתאימות
              </button>
            </div>
          </div>
        </div>

        {/* Popular categories */}
        <section>
          <h2 className="text-lg font-bold text-text-dark mb-4">קטגוריות נפוצות</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">accessible</span>
              </div>
              <span className="font-bold text-text-dark text-sm">נכות</span>
            </button>

            <button
              type="button"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">family_restroom</span>
              </div>
              <span className="font-bold text-text-dark text-sm">משפחה</span>
            </button>

            <button
              type="button"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">work</span>
              </div>
              <span className="font-bold text-text-dark text-sm">תעסוקה</span>
            </button>

            <button
              type="button"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">elderly</span>
              </div>
              <span className="font-bold text-text-dark text-sm">גיל הזהב</span>
            </button>

            <button
              type="button"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">medical_services</span>
              </div>
              <span className="font-bold text-text-dark text-sm">בריאות</span>
            </button>

            <button
              type="button"
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]">school</span>
              </div>
              <span className="font-bold text-text-dark text-sm">חינוך</span>
            </button>
          </div>
        </section>

        {/* Recent searches */}
        <section>
          <h2 className="text-lg font-bold text-text-dark mb-4">חיפושים אחרונים</h2>
          <div className="space-y-2">
            <button
              type="button"
              className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-right"
            >
              <span className="material-symbols-outlined text-text-subtle">history</span>
              <span className="flex-1 text-sm text-text-dark">קצבת נכות כללית</span>
              <span className="material-symbols-outlined text-text-subtle text-[20px]">
                arrow_back
              </span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-right"
            >
              <span className="material-symbols-outlined text-text-subtle">history</span>
              <span className="flex-1 text-sm text-text-dark">הטבות לילד עם צרכים מיוחדים</span>
              <span className="material-symbols-outlined text-text-subtle text-[20px]">
                arrow_back
              </span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-right"
            >
              <span className="material-symbols-outlined text-text-subtle">history</span>
              <span className="flex-1 text-sm text-text-dark">פטור מארנונה</span>
              <span className="material-symbols-outlined text-text-subtle text-[20px]">
                arrow_back
              </span>
            </button>
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
            className="flex flex-col items-center gap-1 text-primary"
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
            <span className="text-xs font-bold">חיפוש</span>
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

