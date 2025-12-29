import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "תוכניות מינוי | ZchuyotBuddy",
  description: "בחר את התוכנית המתאימה לך - שדרג את החוויה שלך",
};

/**
 * Stitch Pricing Page Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_4/
 */
export default function StitchPricingPage() {
  return (
    <div
      dir="rtl"
      className="relative flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-gray-50/50"
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .check-icon {
          font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[30%] rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 pb-24 relative z-10 w-full overflow-y-auto">
        {/* Title section */}
        <div className="text-center mt-4 mb-8">
          <h1 className="text-2xl font-extrabold text-text-dark mb-2">בחר את התוכנית המתאימה לך</h1>
          <p className="text-text-subtle text-sm">
            שדרג את החוויה שלך עם גישה לכלים מתקדמים וליווי אישי.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6 bg-gray-100 p-1 rounded-full w-fit mx-auto">
            <button
              type="button"
              className="px-4 py-1.5 rounded-full text-sm font-bold bg-white text-primary shadow-sm transition-all"
            >
              חודשי
            </button>
            <button
              type="button"
              className="px-4 py-1.5 rounded-full text-sm font-medium text-text-subtle hover:text-text-dark transition-all"
            >
              שנתי{" "}
              <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full mr-1">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="space-y-4">
          {/* Free plan */}
          <div className="bg-white rounded-2xl p-5 border border-card-border shadow-card relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-text-dark">חינם (Free)</h3>
                <p className="text-xs text-text-subtle mt-1">למתחילים את הדרך</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-text-dark">₪0</span>
                <span className="text-xs text-text-subtle block">לחודש</span>
              </div>
            </div>
            <div className="h-px w-full bg-gray-100 my-3" />
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-text-subtle">
                <span className="material-symbols-outlined text-primary text-[18px] check-icon">
                  check_circle
                </span>
                גישה למדריכים בסיסיים
              </li>
              <li className="flex items-center gap-2 text-sm text-text-subtle">
                <span className="material-symbols-outlined text-primary text-[18px] check-icon">
                  check_circle
                </span>
                מחשבון זכויות פשוט
              </li>
            </ul>
          </div>

          {/* Plus plan */}
          <div className="bg-white rounded-2xl p-5 border border-card-border shadow-card relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-text-dark">פלוס (Plus)</h3>
                <p className="text-xs text-text-subtle mt-1">למי שצריך קצת יותר</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-text-dark">₪29</span>
                <span className="text-xs text-text-subtle block">לחודש</span>
              </div>
            </div>
            <div className="h-px w-full bg-gray-100 my-3" />
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-text-subtle">
                <span className="material-symbols-outlined text-primary text-[18px] check-icon">
                  check_circle
                </span>
                כל מה שבחינם
              </li>
              <li className="flex items-center gap-2 text-sm text-text-subtle">
                <span className="material-symbols-outlined text-primary text-[18px] check-icon">
                  check_circle
                </span>
                טפסים דיגיטליים חכמים
              </li>
              <li className="flex items-center gap-2 text-sm text-text-subtle">
                <span className="material-symbols-outlined text-primary text-[18px] check-icon">
                  check_circle
                </span>
                תזכורות לחידוש זכאות
              </li>
            </ul>
          </div>

          {/* Pro plan - Featured */}
          <div className="bg-white rounded-2xl p-1 border-2 border-primary shadow-soft relative overflow-hidden transform scale-[1.02]">
            <div className="absolute top-0 left-0 right-0 bg-primary text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">
              הכי פופולרי
            </div>
            <div className="p-5 pt-8">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-primary">מקצועי (Pro)</h3>
                  <p className="text-xs text-text-subtle mt-1">ליווי צמוד ומקיף</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-primary">₪59</span>
                  <span className="text-xs text-text-subtle block">לחודש</span>
                </div>
              </div>
              <div className="h-px w-full bg-gray-100 my-3" />
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-sm text-text-dark font-medium">
                  <span className="material-symbols-outlined text-primary text-[18px] check-icon">
                    check_circle
                  </span>
                  כל מה שבפלוס
                </li>
                <li className="flex items-center gap-2 text-sm text-text-dark font-medium">
                  <span className="material-symbols-outlined text-primary text-[18px] check-icon">
                    check_circle
                  </span>
                  צ&apos;אט עם מומחה זכויות
                </li>
                <li className="flex items-center gap-2 text-sm text-text-dark font-medium">
                  <span className="material-symbols-outlined text-primary text-[18px] check-icon">
                    check_circle
                  </span>
                  בדיקת מסמכים לפני שלישה
                </li>
                <li className="flex items-center gap-2 text-sm text-text-dark font-medium">
                  <span className="material-symbols-outlined text-primary text-[18px] check-icon">
                    check_circle
                  </span>
                  ליווי בוועדות רפואיות (וירטואלי)
                </li>
              </ul>
            </div>
          </div>

          {/* Max plan */}
          <div className="bg-gradient-to-br from-[#2b1c4e] to-[#4c3575] rounded-2xl p-5 shadow-lg relative overflow-hidden text-white mb-6">
            <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-white/10 rounded-full blur-2xl" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  מקס (Max)
                  <span className="material-symbols-outlined text-amber-400 text-sm">crown</span>
                </h3>
                <p className="text-xs text-gray-300 mt-1">החבילה המלאה להצלחה בטוחה</p>
              </div>
              <div className="text-right relative z-10">
                <span className="text-2xl font-extrabold text-white">₪129</span>
                <span className="text-xs text-gray-300 block">לחודש</span>
              </div>
            </div>
            <div className="h-px w-full bg-white/20 my-3 relative z-10" />
            <ul className="space-y-2.5 relative z-10">
              <li className="flex items-center gap-2 text-sm text-gray-100">
                <span className="material-symbols-outlined text-amber-400 text-[18px] check-icon">
                  check_circle
                </span>
                כל מה שבמקצועי
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-100">
                <span className="material-symbols-outlined text-amber-400 text-[18px] check-icon">
                  check_circle
                </span>
                עורך דין צמוד לתיק
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-100">
                <span className="material-symbols-outlined text-amber-400 text-[18px] check-icon">
                  check_circle
                </span>
                ערעור במידת הצורך ללא עלות נוספת
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center items-center gap-6 mt-2 mb-4 opacity-70">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-gray-400 text-2xl">lock</span>
            <span className="text-[10px] text-text-subtle mt-1">תשלום מאובטח</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-gray-400 text-2xl">cancel</span>
            <span className="text-[10px] text-text-subtle mt-1">ביטול בכל עת</span>
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 w-full md:max-w-md bg-white border-t border-gray-100 p-4 pb-8 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          className="w-full flex items-center justify-center rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight">המשך עם תוכנית Pro</span>
        </button>
        <p className="text-center text-[11px] text-text-subtle mt-3">
          בלחיצה על &quot;המשך&quot; אני מסכים{" "}
          <Link href="/terms" className="underline text-primary">
            לתנאי השימוש
          </Link>{" "}
          ול
          <Link href="/privacy" className="underline text-primary">
            מדיניות הפרטיות
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
