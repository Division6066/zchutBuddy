import type { Metadata } from "next";
import Link from "next/link";
import StitchBackground from "@/components/stitch/StitchBackground";

export const metadata: Metadata = {
  title: "הגדרת פרופיל | ZchuyotBuddy",
  description: "הגדרת פרופיל אישי למימוש הזכויות שלך",
};

/**
 * Stitch Profile Setup Page Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_8/
 */
export default function StitchProfileSetupPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-white"
      dir="rtl"
      lang="he"
    >
      {/* Background decorations */}
      <StitchBackground />

      {/* Header */}
      <header className="flex items-center justify-between p-6 pt-12 z-20">
        <Link
          href="/stitch/onboarding"
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-text-dark hover:bg-gray-100 transition-colors"
          aria-label="חזרה"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </Link>
        <div className="w-10 h-10" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-6 relative z-10 w-full -mt-2">
        {/* Title section */}
        <div className="text-right mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[26px]" aria-hidden="true">
              person_edit
            </span>
          </div>
          <h1 className="text-text-dark text-[28px] font-extrabold leading-tight mb-2">
            הגדרת פרופיל
          </h1>
          <p className="text-text-subtle text-[15px] font-medium leading-relaxed">
            כדי שנוכל לעזור לך לממש את הזכויות שלך, נצטרך להכיר אותך קצת יותר. המידע נשמר באופן
            מאובטח.
          </p>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-5">
          {/* Anonymous mode toggle */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined" aria-hidden="true">
                  visibility_off
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-text-dark">מצב אנונימי</span>
                <span className="text-xs text-text-subtle">ללא שמירת שם או פרטים מזהים</span>
              </div>
            </div>
            <label className="flex items-center cursor-pointer relative" htmlFor="anonymous-toggle">
              <input type="checkbox" id="anonymous-toggle" className="sr-only peer" />
              <div
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                dir="ltr"
              />
            </label>
          </div>

          {/* Form inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-bold text-text-dark pr-1">
                שם מלא
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
                placeholder="השם שלך"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="birthYear" className="text-sm font-bold text-text-dark pr-1">
                שנת לידה
              </label>
              <div className="relative">
                <select
                  id="birthYear"
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right appearance-none font-medium text-text-dark"
                  defaultValue=""
                >
                  <option value="" disabled={true}>
                    בחירת שנה
                  </option>
                  {Array.from({ length: 80 }, (_, i) => 2006 - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Family helper checkbox */}
            <div className="pt-2">
              <label className="flex items-center p-3 border border-primary/20 bg-primary/5 rounded-xl cursor-pointer transition-colors hover:bg-primary/10">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-offset-0 ml-3"
                />
                <div className="flex-1 text-right">
                  <span className="block text-sm font-bold text-text-dark">
                    אני מסייע/ת לבן משפחה
                  </span>
                  <span className="block text-xs text-text-subtle mt-0.5">
                    הזכויות הן עבור מישהו אחר
                  </span>
                </div>
                <span className="material-symbols-outlined text-primary/60" aria-hidden="true">
                  family_restroom
                </span>
              </label>
            </div>
          </div>

          {/* Security notice */}
          <div className="flex gap-2 items-start mt-2 p-3 bg-gray-50 rounded-xl">
            <span
              className="material-symbols-outlined text-text-subtle text-[18px] mt-0.5"
              aria-hidden="true"
            >
              lock
            </span>
            <p className="text-xs text-text-subtle leading-relaxed text-right">
              המידע שלך מוצפן ומאובטח. אנחנו לא משתפים את המידע עם צד שלישי ללא הסכמתך המפורשת.
            </p>
          </div>
        </div>
      </main>

      {/* CTA section */}
      <div className="p-6 pb-10 w-full z-10 bg-white mt-auto border-t border-gray-50">
        <Link
          href="/stitch/app"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ml-2">המשך</span>
          <span
            className="material-symbols-outlined transition-transform group-hover:-translate-x-1 rotate-180"
            aria-hidden="true"
          >
            arrow_forward
          </span>
        </Link>

        {/* Progress dots */}
        <div
          className="mt-4 flex justify-center gap-2"
          dir="ltr"
          role="group"
          aria-label="שלב 1 מתוך 3"
        >
          <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
