"use client";

import type { Metadata } from "next";
import Link from "next/link";

/**
 * Stitch Onboarding Step 6: Review Page Preview
 * Based on Stitch design patterns from welcome_to_zchuyotbuddy screens
 */
export default function StitchOnboardingStep6Page() {
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
          href="/stitch/onboarding-step-4"
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-text-dark hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-subtle">שלב 6 מתוך 6</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="px-6 mb-6">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-full bg-primary rounded-full transition-all" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 relative z-10 w-full overflow-y-auto pb-32">
        {/* Title section */}
        <div className="text-right mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-100 text-green-600 mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">fact_check</span>
          </div>
          <h1 className="text-text-dark text-[28px] font-extrabold leading-tight mb-2">
            סיכום ואישור
          </h1>
          <p className="text-text-subtle text-[15px] font-medium leading-relaxed">
            בדוק את הפרטים שהזנת לפני סיום התהליך
          </p>
        </div>

        {/* Summary cards */}
        <div className="space-y-4">
          {/* Basic info card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">person</span>
                </div>
                <h3 className="font-bold text-text-dark text-lg">פרטים בסיסיים</h3>
              </div>
              <Link
                href="/stitch/onboarding-step-2"
                className="text-primary text-sm font-bold hover:underline"
              >
                עריכה
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-subtle">שם מלא</span>
                <span className="text-text-dark font-medium">ישראל ישראלי</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle">ת.ז.</span>
                <span className="text-text-dark font-medium">123456789</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle">תאריך לידה</span>
                <span className="text-text-dark font-medium">01/01/1980</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle">טלפון</span>
                <span className="text-text-dark font-medium" dir="ltr">
                  050-1234567
                </span>
              </div>
            </div>
          </div>

          {/* Life situation card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">home</span>
                </div>
                <h3 className="font-bold text-text-dark text-lg">מצב חיים</h3>
              </div>
              <Link
                href="/stitch/onboarding-step-3"
                className="text-primary text-sm font-bold hover:underline"
              >
                עריכה
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-subtle">מצב משפחתי</span>
                <span className="text-text-dark font-medium">נשוי/אה</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle">ילדים</span>
                <span className="text-text-dark font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle">מצב תעסוקתי</span>
                <span className="text-text-dark font-medium">לא עובד/ת</span>
              </div>
            </div>
          </div>

          {/* Disabilities card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">accessible</span>
                </div>
                <h3 className="font-bold text-text-dark text-lg">מוגבלויות</h3>
              </div>
              <Link
                href="/stitch/onboarding-step-4"
                className="text-primary text-sm font-bold hover:underline"
              >
                עריכה
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-subtle">סוגי מוגבלות</span>
                <span className="text-text-dark font-medium">מוגבלות פיזית, מחלה כרונית</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle">אחוזי נכות</span>
                <span className="text-text-dark font-medium">60% - 79%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy agreement */}
        <div className="mt-8">
          <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-offset-0 mt-0.5"
            />
            <span className="text-xs text-text-subtle leading-relaxed text-right">
              אני מאשר/ת שהמידע שמסרתי נכון ומדויק, ומסכים/ה ל
              <Link href="/terms" className="text-primary font-medium hover:underline">
                תנאי השימוש
              </Link>{" "}
              ול
              <Link href="/privacy" className="text-primary font-medium hover:underline">
                מדיניות הפרטיות
              </Link>
              . אני מבין/ה שמידע זה ישמש להתאמת זכויות ושירותים עבורי.
            </span>
          </label>
        </div>

        {/* Success preview */}
        <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-green-600 text-[20px] mt-0.5">
              celebration
            </span>
            <div>
              <h4 className="font-bold text-green-800 mb-1">מצאנו עבורך 5 זכויות פוטנציאליות!</h4>
              <p className="text-xs text-green-700 leading-relaxed">
                לאחר אישור הפרטים, תוכל לראות את כל הזכויות שמגיעות לך ולהתחיל בתהליך המימוש.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="fixed bottom-0 left-0 right-0 md:max-w-md md:mx-auto p-6 pb-10 w-full z-10 bg-white border-t border-gray-50">
        <Link
          href="/stitch/rights-map"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-green-600 text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 hover:shadow-green-600/40 active:scale-[0.98]"
        >
          <span className="text-lg font-bold tracking-tight ml-2">סיום והצגת הזכויות</span>
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
        </Link>
      </div>
    </div>
  );
}

