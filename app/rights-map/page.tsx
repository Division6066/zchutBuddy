import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מפת הזכויות שלך | ZchuyotBuddy",
  description: "תוצאות מפת הזכויות - זכויות שנמצאו עבורך",
};

const rights = [
  {
    icon: "accessible",
    title: "קצבת נכות כללית",
    source: "ביטוח לאומי",
    match: 95,
    matchColor: "primary",
    description: "קצבה חודשית המשולמת למי שעקב נכות גופנית, שכלית או נפשית צומצם כושרו להשתכר.",
    requirements: [
      "תושב/ת ישראל מגיל 18 ועד גיל פרישה",
      "הכנסה מעבודה נמוכה מ-60% מהשכר הממוצע",
      "נכות רפואית של 60% לפחות",
    ],
    primary: true,
  },
  {
    icon: "directions_car",
    title: "תו נכה לרכב",
    source: "משרד התחבורה",
    match: 80,
    matchColor: "blue",
    description: "תג חניה לנכה המאפשר חניה במקומות המיועדים לנכים ולעיתים פטור מתשלום חניה.",
    documents: "3 מסמכים (רפואיים + רשיון)",
    primary: false,
  },
  {
    icon: "home_health",
    title: "הנחה בארנונה",
    source: "רשות מקומית",
    match: 65,
    matchColor: "orange",
    description: "זכאות להנחה בתשלומי הארנונה לבעלי דרגת אי-כושר השתכרות.",
    primary: false,
  },
];

/**
 * Rights Map Results Page
 * Based on Stitch design: welcome_to_zchuyotbuddy_6
 */
export default function RightsMapPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden no-scrollbar bg-slate-50"
      dir="rtl"
      lang="he"
    >
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between p-4 pt-12 md:pt-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/app"
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-text-subtle transition-colors"
              aria-label="חזרה"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <span className="text-text-dark font-bold text-lg">מפת הזכויות שלך</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
              map
            </span>
          </div>
        </div>
        <div className="px-5 pb-4 max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-text-subtle font-medium">התאמה אישית</p>
              <h1 className="text-2xl font-extrabold text-primary leading-tight mt-1">
                נמצאו 3 זכויות
              </h1>
            </div>
            <div className="text-right">
              <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                  trending_up
                </span>
                גבוהה
              </div>
            </div>
          </div>
          <p className="text-sm text-text-subtle leading-relaxed">
            בהתבסס על הנתונים שהזנת, אלו ההטבות והקצבאות שאתה עשוי להיות זכאי להן.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-5 gap-4 pb-24 max-w-4xl mx-auto w-full">
        {rights.map((right) => (
          <div
            key={right.title}
            className={`bg-white rounded-2xl p-5 shadow-sm border ${
              right.primary ? "border-primary/10" : "border-transparent"
            } relative overflow-hidden group transition-all hover:shadow-md`}
          >
            {right.primary && <div className="absolute top-0 right-0 w-1 h-full bg-primary" />}
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${
                    right.matchColor === "primary"
                      ? "bg-primary-bg text-primary"
                      : right.matchColor === "blue"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-orange-50 text-orange-500"
                  } flex items-center justify-center shrink-0`}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {right.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-dark">{right.title}</h3>
                  <p className="text-xs text-text-subtle font-medium">{right.source}</p>
                </div>
              </div>
              <span
                className={`${
                  right.matchColor === "primary"
                    ? "bg-primary text-white"
                    : right.matchColor === "blue"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                } text-[10px] font-bold px-2 py-1 rounded-lg`}
              >
                {right.match}% התאמה
              </span>
            </div>
            <p className="text-sm text-text-subtle mb-4 leading-relaxed">{right.description}</p>

            {right.requirements && (
              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="material-symbols-outlined text-primary text-[16px]"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  <span className="text-xs font-bold text-text-dark">דרישות עיקריות:</span>
                </div>
                <ul className="text-xs text-text-subtle space-y-1 list-disc list-inside pr-1">
                  {right.requirements.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {right.documents && (
              <div className="bg-slate-50 rounded-xl p-3 mb-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-subtle uppercase tracking-wider font-bold">
                    מסמכים נדרשים
                  </span>
                  <span className="text-xs font-bold text-text-dark">{right.documents}</span>
                </div>
                <span className="material-symbols-outlined text-gray-400" aria-hidden="true">
                  description
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              {right.primary ? (
                <>
                  <button
                    type="button"
                    className="flex-1 bg-primary text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-light transition-colors"
                  >
                    התחל תביעה
                    <span
                      className="material-symbols-outlined text-[16px] rtl-flip"
                      aria-hidden="true"
                    >
                      arrow_back
                    </span>
                  </button>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
                    aria-label="מידע נוסף"
                  >
                    <span className="material-symbols-outlined">info</span>
                  </a>
                </>
              ) : (
                <button
                  type="button"
                  className={`flex-1 ${
                    right.matchColor === "blue"
                      ? "bg-white border border-primary text-primary hover:bg-primary-bg"
                      : "bg-white border border-gray-200 text-text-dark hover:bg-gray-50"
                  } text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors`}
                >
                  {right.matchColor === "blue" ? "פרטים נוספים" : "קרא עוד"}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* More results link */}
        <div className="text-center mt-4 mb-2">
          <button
            type="button"
            className="text-sm text-primary font-bold flex items-center justify-center gap-1 mx-auto hover:underline"
          >
            ראה עוד תוצאות (אחוזי התאמה נמוכים)
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              expand_more
            </span>
          </button>
        </div>
      </main>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 pb-8 z-40">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/app"
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
          >
            <span
              className="material-symbols-outlined text-[22px] ml-2 bg-white/20 p-1 rounded-full"
              aria-hidden="true"
            >
              add
            </span>
            <span className="text-lg font-bold tracking-tight">פתח תיק תביעה חדש</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
