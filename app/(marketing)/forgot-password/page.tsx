import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "שכחתי סיסמה | ZchuyotBuddy",
  description: "איפוס סיסמה לחשבון",
};

/**
 * Stitch Forgot Password Page Preview
 * Based on Stitch design patterns from welcome_to_zchuyotbuddy screens
 */
export default function StitchForgotPasswordPage() {
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
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 z-10">
        <Link
          href="/"
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-text-dark transition-colors"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        <span className="text-text-dark font-bold text-lg">שכחתי סיסמה</span>
        <div className="w-10" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 relative z-10 w-full">
        {/* Icon */}
        <div className="flex justify-center mt-8 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[40px]">lock_reset</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-text-dark mb-3">איפוס סיסמה</h1>
          <p className="text-text-subtle text-base leading-relaxed px-4">
            הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="reset-email" className="text-sm font-bold text-text-dark pr-1">
              כתובת אימייל
            </label>
            <input
              id="reset-email"
              type="email"
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
              placeholder="your@email.com"
              dir="ltr"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
          >
            <span className="text-lg font-bold tracking-tight ml-2">שלח קישור לאיפוס</span>
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
              send
            </span>
          </button>
        </form>

        {/* Info box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 text-[20px] mt-0.5">info</span>
            <p className="text-xs text-blue-800 leading-relaxed text-right">
              אם האימייל קיים במערכת, תקבל הודעה עם קישור לאיפוס הסיסמה תוך מספר דקות. בדוק גם את
              תיקיית הספאם.
            </p>
          </div>
        </div>

        {/* Back to login */}
        <div className="mt-auto pb-10 pt-8 text-center">
          <Link
            href="/sign-in"
            className="text-primary font-bold text-sm hover:underline inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            חזרה להתחברות
          </Link>
        </div>
      </div>
    </div>
  );
}
