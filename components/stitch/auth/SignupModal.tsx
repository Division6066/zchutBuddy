"use client";

import Link from "next/link";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Stitch Signup Modal Component
 * Based on Stitch design patterns from welcome_to_zchuyotbuddy screens
 */
export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal content */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[40%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[22px]">shield</span>
              </div>
              <span className="text-text-dark font-extrabold text-xl tracking-tight">
                זכויותבאדי
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-text-subtle hover:bg-gray-100 hover:text-primary transition-colors"
              aria-label="סגור"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 id="signup-modal-title" className="text-2xl font-extrabold text-text-dark mb-2">
              הרשמה
            </h2>
            <p className="text-text-subtle text-sm">צור חשבון חדש כדי להתחיל</p>
          </div>
        </div>

        {/* Form */}
        <div className="relative z-10 px-6 pb-6">
          <form className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-sm font-bold text-text-dark pr-1">
                אימייל
              </label>
              <input
                id="signup-email"
                type="email"
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
                placeholder="your@email.com"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-sm font-bold text-text-dark pr-1">
                סיסמה
              </label>
              <input
                id="signup-password"
                type="password"
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="signup-password-confirm"
                className="text-sm font-bold text-text-dark pr-1"
              >
                אימות סיסמה
              </label>
              <input
                id="signup-password-confirm"
                type="password"
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white focus:ring-0 transition-all text-right placeholder-gray-400 font-medium"
                placeholder="••••••••"
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-offset-0 mt-0.5"
              />
              <span className="text-xs text-text-subtle leading-relaxed text-right">
                אני מסכים/ה ל
                <Link href="/terms" className="text-primary font-medium hover:underline">
                  תנאי השימוש
                </Link>{" "}
                ול
                <Link href="/privacy" className="text-primary font-medium hover:underline">
                  מדיניות הפרטיות
                </Link>
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
            >
              <span className="text-lg font-bold tracking-tight ml-2">הרשמה</span>
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-text-subtle font-medium">או</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-gray-200 bg-white text-text-dark font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            המשך עם Google
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-text-subtle mt-6">
            כבר יש לך חשבון?{" "}
            <button type="button" className="text-primary font-bold hover:underline">
              התחבר
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
