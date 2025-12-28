import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "תוצאות חיפוש זכויות | ZchuyotBuddy",
  description: "הזכויות שמצאנו עבורך",
};

/**
 * Stitch Rights Answer Display Page Preview
 * Based on Stitch design patterns
 */
export default function StitchRightsAnswerPage() {
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
        <div className="flex items-center gap-4">
          <Link
            href="/stitch/rights-finder"
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-dark hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-text-dark">תוצאות החיפוש</h1>
            <p className="text-sm text-text-subtle">מצאנו 5 זכויות רלוונטיות</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 relative z-10">
        {/* AI Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark mb-2">סיכום הבאדי</h3>
              <p className="text-sm text-text-subtle leading-relaxed">
                על סמך המידע שסיפקת, מצאתי עבורך 5 זכויות שכנראה מגיעות לך. הזכות הכי משמעותית היא
                <strong className="text-text-dark"> קצבת נכות כללית </strong>
                שיכולה להגיע לסכום של עד 4,000 ₪ בחודש.
              </p>
            </div>
          </div>
        </div>

        {/* Results list */}
        <section>
          <h2 className="text-lg font-bold text-text-dark mb-4">זכויות שנמצאו</h2>

          <div className="space-y-4">
            {/* High match */}
            <Link
              href="/stitch/checklists/detail"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">verified</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-dark">קצבת נכות כללית</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                      התאמה גבוהה
                    </span>
                  </div>
                  <p className="text-sm text-text-subtle mb-3">
                    קצבה חודשית לאנשים עם מוגבלות שמשפיעה על יכולת ההשתכרות
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-primary">עד 4,000 ₪/חודש</span>
                    <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Medium match */}
            <Link
              href="/stitch/checklists/detail"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">local_taxi</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-dark">גמלת ניידות</h3>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">
                      התאמה בינונית
                    </span>
                  </div>
                  <p className="text-sm text-text-subtle mb-3">
                    סיוע במימון רכב או הסעות לאנשים עם מוגבלות בניידות
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-primary">עד 2,500 ₪/חודש</span>
                    <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Another result */}
            <Link
              href="/stitch/checklists/detail"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">home</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-dark">הנחה בארנונה</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                      התאמה גבוהה
                    </span>
                  </div>
                  <p className="text-sm text-text-subtle mb-3">
                    הנחה של עד 90% בתשלומי ארנונה לבעלי נכות
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-primary">עד 90% הנחה</span>
                    <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* More results */}
            <Link
              href="/stitch/checklists/detail"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">medication</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-dark">סל תרופות מיוחד</h3>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">
                      התאמה בינונית
                    </span>
                  </div>
                  <p className="text-sm text-text-subtle mb-3">
                    מימון תרופות יקרות שאינן בסל הבריאות
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-primary">מימון מלא</span>
                    <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/stitch/checklists/detail"
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">directions_bus</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-dark">נסיעה חינם בתחבורה ציבורית</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                      התאמה גבוהה
                    </span>
                  </div>
                  <p className="text-sm text-text-subtle mb-3">
                    פטור מלא מתשלום בתחבורה ציבורית למקבלי קצבת נכות
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-primary">פטור מלא</span>
                    <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* CTA */}
      <div className="p-6 pb-10 bg-white border-t border-gray-100 sticky bottom-0 z-20">
        <Link
          href="/stitch/checklists"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ml-2">התחל תהליך מימוש</span>
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
        </Link>
      </div>
    </div>
  );
}

