import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מפת הזכויות שלך | ZchuyotBuddy",
  description: "תוצאות מפת הזכויות - נמצאו זכויות מותאמות עבורך",
};

/**
 * Stitch Rights Map Page Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_6/
 */
export default function StitchRightsMapPage() {
  return (
    <div
      dir="rtl"
      className="relative flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-slate-50"
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .rtl-flip {
          transform: scaleX(-1);
        }
      `}</style>

      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between p-4 pt-12 md:pt-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-text-subtle transition-colors"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <span className="text-text-dark font-bold text-lg">מפת הזכויות שלך</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">map</span>
          </div>
        </div>

        {/* Summary section */}
        <div className="px-5 pb-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-text-subtle font-medium">התאמה אישית</p>
              <h1 className="text-2xl font-extrabold text-primary leading-tight mt-1">
                נמצאו 3 זכויות
              </h1>
            </div>
            <div className="text-right">
              <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                גבוהה
              </div>
            </div>
          </div>
          <p className="text-sm text-text-subtle leading-relaxed">
            בהתבסס על הנתונים שהזנת, אלו ההטבות והקצבאות שאתה עשוי להיות זכאי להן.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-5 gap-4 pb-24">
        {/* Primary right card */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-primary/10 relative overflow-hidden group transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 w-1 h-full bg-primary" />
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-bg flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">accessible</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-dark">קצבת נכות כללית</h3>
                <p className="text-xs text-text-subtle font-medium">ביטוח לאומי</p>
              </div>
            </div>
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              95% התאמה
            </span>
          </div>
          <p className="text-sm text-text-subtle mb-4 leading-relaxed">
            קצבה חודשית המשולמת למי שעקב נכות גופנית, שכלית או נפשית צומצם כושרו להשתכר.
          </p>
          <div className="bg-slate-50 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[16px]">
                check_circle
              </span>
              <span className="text-xs font-bold text-text-dark">דרישות עיקריות:</span>
            </div>
            <ul className="text-xs text-text-subtle space-y-1 list-disc list-inside pr-1">
              <li>תושב/ת ישראל מגיל 18 ועד גיל פרישה</li>
              <li>הכנסה מעבודה נמוכה מ-60% מהשכר הממוצע</li>
              <li>נכות רפואית של 60% לפחות</li>
            </ul>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              className="flex-1 bg-primary text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-light transition-colors"
            >
              התחל תביעה
              <span className="material-symbols-outlined text-[16px] rtl-flip">arrow_back</span>
            </button>
            <Link
              href="/rights"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">info</span>
            </Link>
          </div>
        </div>

        {/* Secondary right card */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-transparent relative overflow-hidden group transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <span className="material-symbols-outlined">directions_car</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-dark">תו נכה לרכב</h3>
                <p className="text-xs text-text-subtle font-medium">משרד התחבורה</p>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg">
              80% התאמה
            </span>
          </div>
          <p className="text-sm text-text-subtle mb-4 leading-relaxed">
            תג חניה לנכה המאפשר חניה במקומות המיועדים לנכים ולעיתים פטור מתשלום חניה.
          </p>
          <div className="bg-slate-50 rounded-xl p-3 mb-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] text-text-subtle uppercase tracking-wider font-bold">
                מסמכים נדרשים
              </span>
              <span className="text-xs font-bold text-text-dark">3 מסמכים (רפואיים + רשיון)</span>
            </div>
            <span className="material-symbols-outlined text-gray-400">description</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              className="flex-1 bg-white border border-primary text-primary text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-bg transition-colors"
            >
              פרטים נוספים
            </button>
          </div>
        </div>

        {/* Tertiary right card */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-transparent relative overflow-hidden group transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                <span className="material-symbols-outlined">home_health</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-dark">הנחה בארנונה</h3>
                <p className="text-xs text-text-subtle font-medium">רשות מקומית</p>
              </div>
            </div>
            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-lg">
              65% התאמה
            </span>
          </div>
          <p className="text-sm text-text-subtle mb-2 leading-relaxed">
            זכאות להנחה בתשלומי הארנונה לבעלי דרגת אי-כושר השתכרות.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              className="flex-1 bg-white border border-gray-200 text-text-dark text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              קרא עוד
            </button>
          </div>
        </div>

        {/* More results link */}
        <div className="text-center mt-4 mb-2">
          <button
            type="button"
            className="text-sm text-primary font-bold flex items-center justify-center gap-1 mx-auto hover:underline"
          >
            ראה עוד תוצאות (אחוזי התאמה נמוכים)
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:max-w-md md:mx-auto bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 pb-8 z-40">
        <button
          type="button"
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[22px] ml-2 bg-white/20 p-1 rounded-full">
            add
          </span>
          <span className="text-lg font-bold tracking-tight">פתח תיק תביעה חדש</span>
        </button>
      </div>
    </div>
  );
}
