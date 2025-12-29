import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אונבורדינג - שלב 3 | ZchuyotBuddy",
  description: "מצב חיים ותעסוקה",
};

/**
 * Stitch Onboarding Step 3: Life Situation Page Preview
 * Based on Stitch design patterns from welcome_to_zchuyotbuddy screens
 */
export default function StitchOnboardingStep3Page() {
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
            href="/onboarding-step-2"
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-text-dark hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-subtle">שלב 3 מתוך 6</span>
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
          <div className="h-full w-[50%] bg-primary rounded-full transition-all" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 relative z-10 w-full overflow-y-auto pb-32">
        {/* Title section */}
        <div className="text-right mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">home</span>
          </div>
          <h1 className="text-text-dark text-[28px] font-extrabold leading-tight mb-2">
            מצב חיים
          </h1>
          <p className="text-text-subtle text-[15px] font-medium leading-relaxed">
            ספר לנו קצת על מצב החיים שלך כדי שנוכל להתאים את הזכויות הרלוונטיות
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-text-dark mb-3">מצב משפחתי</p>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="family-status" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">person</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">רווק/ה</h3>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="family-status" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">group</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">נשוי/אה</h3>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="family-status" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">diversity_3</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">גרוש/ה</h3>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="family-status" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">elderly</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">אלמן/ה</h3>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>
        </div>

        {/* Children section */}
        <div className="mt-8 space-y-3">
          <p className="text-sm font-bold text-text-dark mb-3">ילדים</p>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-dark font-medium">מספר ילדים</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-dark hover:bg-gray-200 transition-colors"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="text-xl font-bold text-text-dark w-8 text-center">0</span>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-light transition-colors"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employment section */}
        <div className="mt-8 space-y-3">
          <p className="text-sm font-bold text-text-dark mb-3">מצב תעסוקתי</p>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="employment" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">work</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">עובד/ת</h3>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="employment" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">מחפש/ת עבודה</h3>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>

          <label className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="employment" className="peer sr-only" />
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center ml-4 shrink-0 peer-checked:bg-primary peer-checked:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">self_improvement</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-dark text-base">לא עובד/ת</h3>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
              <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>
        </div>
      </div>

      {/* CTA section */}
      <div className="fixed bottom-0 left-0 right-0 md:max-w-md md:mx-auto p-6 pb-10 w-full z-10 bg-white border-t border-gray-50">
        <Link
          href="/onboarding-step-4"
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

