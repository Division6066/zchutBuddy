import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אונבורדינג - שלב 2 | ZchuyotBuddy",
  description: "פרטים בסיסיים",
};

/**
 * Stitch Onboarding Step 2: Basic Info Page Preview
 * Based on Stitch design patterns from welcome_to_zchuyotbuddy screens
 */
export default function StitchOnboardingStep2Page() {
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
            href="/"
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-text-dark hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-subtle">שלב 2 מתוך 6</span>
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
          <div className="h-full w-[33%] bg-primary rounded-full transition-all" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 relative z-10 w-full">
        {/* Title section */}
        <div className="text-right mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">person</span>
          </div>
          <h1 className="text-text-dark text-[28px] font-extrabold leading-tight mb-2">
            פרטים בסיסיים
          </h1>
          <p className="text-text-subtle text-[15px] font-medium leading-relaxed">
            נתחיל עם כמה פרטים בסיסיים כדי שנוכל להתאים את השירות עבורך
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="first-name" className="text-sm font-bold text-text-dark pr-1">
              שם פרטי
            </label>
            <input
              id="first-name"
              type="text"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
              placeholder="השם הפרטי שלך"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="last-name" className="text-sm font-bold text-text-dark pr-1">
              שם משפחה
            </label>
            <input
              id="last-name"
              type="text"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
              placeholder="שם המשפחה שלך"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="id-number" className="text-sm font-bold text-text-dark pr-1">
              תעודת זהות
            </label>
            <input
              id="id-number"
              type="text"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
              placeholder="מספר תעודת זהות"
              inputMode="numeric"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="birth-date" className="text-sm font-bold text-text-dark pr-1">
              תאריך לידה
            </label>
            <input
              id="birth-date"
              type="date"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-bold text-text-dark pr-1">
              טלפון נייד
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
              placeholder="050-0000000"
              dir="ltr"
            />
          </div>
        </div>

        {/* Security note */}
        <div className="flex gap-2 items-start mt-6 p-3 bg-gray-50 rounded-xl">
          <span className="material-symbols-outlined text-text-subtle text-[18px] mt-0.5">lock</span>
          <p className="text-xs text-text-subtle leading-relaxed text-right">
            המידע שלך מוצפן ומאובטח. אנחנו לא משתפים את המידע עם צד שלישי ללא הסכמתך.
          </p>
        </div>
      </div>

      {/* CTA section */}
      <div className="p-6 pb-10 w-full z-10 bg-white mt-auto border-t border-gray-50">
        <Link
          href="/onboarding-step-3"
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

