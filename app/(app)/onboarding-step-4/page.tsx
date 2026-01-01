import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אונבורדינג - שלב 4 | ZchuyotBuddy",
  description: "מוגבלויות ומצב רפואי",
};

/**
 * Stitch Onboarding Step 4: Disabilities Page Preview
 * Based on Stitch design patterns from welcome_to_zchuyotbuddy screens
 */
export default function StitchOnboardingStep4Page() {
  return (
    <div
      dir="rtl"
      className="relative flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-white"
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
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 z-20">
        <Link
          href="/onboarding-step-3"
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-text-dark hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-subtle">שלב 4 מתוך 6</span>
        </div>
        <button
          type="button"
          className="text-text-subtle text-sm font-semibold hover:text-primary transition-colors"
        >
          דלג
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-6 mb-6">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-[67%] bg-primary rounded-full transition-all" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 relative z-10 w-full overflow-y-auto pb-32">
        {/* Title section */}
        <div className="text-right mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">accessible</span>
          </div>
          <h1 className="text-text-dark text-[28px] font-extrabold leading-tight mb-2">
            מוגבלויות ומצב רפואי
          </h1>
          <p className="text-text-subtle text-[15px] font-medium leading-relaxed">
            סמן את התחומים הרלוונטיים עבורך. מידע זה יעזור לנו למצוא את כל הזכויות שמגיעות לך
          </p>
        </div>

        {/* Sensitive info notice */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600 text-[20px] mt-0.5">
              privacy_tip
            </span>
            <p className="text-xs text-amber-800 leading-relaxed text-right">
              מידע זה רגיש ומאובטח. הוא נשמר בהצפנה מלאה ומשמש רק להתאמת הזכויות עבורך.
            </p>
          </div>
        </div>

        {/* Disability checkboxes */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-text-dark mb-3">
            סוגי מוגבלות (ניתן לבחור יותר מאחד)
          </p>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">directions_walk</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">מוגבלות פיזית/תנועתית</h3>
              <p className="text-xs text-text-subtle mt-0.5">קושי בניידות, שיתוק, קטיעת איבר</p>
            </div>
            <div className="w-6 h-6 rounded-lg border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100">
                check
              </span>
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">visibility</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">לקות ראייה</h3>
              <p className="text-xs text-text-subtle mt-0.5">עיוורון, ראייה חלקית</p>
            </div>
            <div className="w-6 h-6 rounded-lg border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100">
                check
              </span>
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">hearing</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">לקות שמיעה</h3>
              <p className="text-xs text-text-subtle mt-0.5">חירשות, שמיעה חלקית</p>
            </div>
            <div className="w-6 h-6 rounded-lg border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100">
                check
              </span>
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">psychology</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">מוגבלות נפשית</h3>
              <p className="text-xs text-text-subtle mt-0.5">דיכאון, חרדה, PTSD, סכיזופרניה</p>
            </div>
            <div className="w-6 h-6 rounded-lg border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100">
                check
              </span>
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">neurology</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">מוגבלות התפתחותית/שכלית</h3>
              <p className="text-xs text-text-subtle mt-0.5">אוטיזם, פיגור שכלי, לקויות למידה</p>
            </div>
            <div className="w-6 h-6 rounded-lg border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100">
                check
              </span>
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">medical_services</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">מחלה כרונית</h3>
              <p className="text-xs text-text-subtle mt-0.5">סוכרת, לב, סרטן, מחלות אוטואימוניות</p>
            </div>
            <div className="w-6 h-6 rounded-lg border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100">
                check
              </span>
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">more_horiz</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">אחר</h3>
              <p className="text-xs text-text-subtle mt-0.5">מוגבלות או מצב רפואי אחר</p>
            </div>
            <div className="w-6 h-6 rounded-lg border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-white text-[16px] opacity-0 peer-checked:opacity-100">
                check
              </span>
            </div>
          </label>
        </div>

        {/* Disability percentage */}
        <div className="mt-8 space-y-3">
          <p className="text-sm font-bold text-text-dark mb-3">אחוזי נכות מוכרים</p>

          <div className="space-y-1.5">
            <label
              htmlFor="disability-percent"
              className="text-sm font-medium text-text-subtle pr-1"
            >
              אחוז נכות (אם יש)
            </label>
            <div className="relative">
              <select
                id="disability-percent"
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right appearance-none font-medium text-text-dark"
                defaultValue=""
              >
                <option disabled={true} value="">
                  בחר אחוז נכות
                </option>
                <option value="0">אין נכות מוכרת</option>
                <option value="10-39">10% - 39%</option>
                <option value="40-59">40% - 59%</option>
                <option value="60-79">60% - 79%</option>
                <option value="80-99">80% - 99%</option>
                <option value="100">100%</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="fixed bottom-0 left-0 right-0 md:max-w-md md:mx-auto p-6 pb-10 w-full z-10 bg-white border-t border-gray-50">
        <Link
          href="/onboarding-step-6"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ml-2">המשך</span>
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1 rotate-180">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
