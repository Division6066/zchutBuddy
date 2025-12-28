import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אודות | ZchuyotBuddy",
  description: "מידע על האפליקציה - ה-GPS למימוש הזכויות שלך",
};

/**
 * Stitch About Page Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_5/
 */
export default function StitchAboutPage() {
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
        <button
          type="button"
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-text-dark transition-colors"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <span className="text-text-dark font-bold text-lg">אודות</span>
        <div className="w-10" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 relative z-10 w-full overflow-y-auto pb-10">
        {/* Logo section */}
        <div className="flex flex-col items-center text-center mt-4 mb-10">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-primary rounded-[2rem] shadow-glow flex items-center justify-center rotate-3 transform transition-transform hover:rotate-0">
              <span className="material-symbols-outlined text-white text-[48px]">
                medical_services
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
              <span className="material-symbols-outlined text-accent text-[20px]">verified</span>
            </div>
          </div>
          <h1 className="text-text-dark tracking-tight text-2xl font-extrabold mb-2">זכויותבאדי</h1>
          <p className="text-primary font-semibold text-sm bg-primary-bg px-3 py-1 rounded-full">
            ה-GPS למימוש הזכויות שלך
          </p>
        </div>

        {/* Description and features */}
        <div className="space-y-6">
          <div className="text-center px-2">
            <p className="text-text-subtle text-base leading-relaxed">
              אנחנו כאן כדי לעזור לך לנווט בנבכי הבירוקרטיה ולממש את מלוא הזכויות המגיעות לך.
              האפליקציה משמשת כ&quot;טייס משנה&quot; למילוי טפסים והגשת תביעות בצורה פשוטה וברורה.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4 mt-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-soft transition-shadow flex items-start gap-4">
              <div className="bg-primary-bg p-3 rounded-xl text-primary shrink-0">
                <span className="material-symbols-outlined">explore</span>
              </div>
              <div>
                <h3 className="font-bold text-text-dark text-lg mb-1">ניווט חכם</h3>
                <p className="text-text-subtle text-sm leading-relaxed">
                  מפת דרכים מותאמת אישית למימוש הזכויות הרפואיות שלך, צעד אחר צעד.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-soft transition-shadow flex items-start gap-4">
              <div className="bg-primary-bg p-3 rounded-xl text-primary shrink-0">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div>
                <h3 className="font-bold text-text-dark text-lg mb-1">עזרה בניירת</h3>
                <p className="text-text-subtle text-sm leading-relaxed">
                  אנחנו דואגים לבירוקרטיה ולטפסים, כדי שאתם תוכלו להתמקד במה שחשוב.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-soft transition-shadow flex items-start gap-4">
              <div className="bg-primary-bg p-3 rounded-xl text-primary shrink-0">
                <span className="material-symbols-outlined">diversity_1</span>
              </div>
              <div>
                <h3 className="font-bold text-text-dark text-lg mb-1">אנחנו איתך</h3>
                <p className="text-text-subtle text-sm leading-relaxed">
                  צוות המומחים שלנו פיתח את המערכת מתוך הבנה עמוקה של הצרכים שלך.
                </p>
              </div>
            </div>
          </div>

          {/* Links section */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-1">
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-text-subtle">gavel</span>
                <span className="text-text-dark font-medium">תנאי שימוש</span>
              </div>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors rotate-180">
                arrow_forward
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-text-subtle">policy</span>
                <span className="text-text-dark font-medium">מדיניות פרטיות</span>
              </div>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors rotate-180">
                arrow_forward
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-text-subtle">mail</span>
                <span className="text-text-dark font-medium">צור קשר</span>
              </div>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors rotate-180">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Version info */}
          <div className="text-center pt-8 pb-4">
            <p className="text-xs text-text-subtle">גרסה 1.0.2</p>
            <p className="text-xs text-gray-400 mt-1">© 2024 ZchuyotBuddy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
