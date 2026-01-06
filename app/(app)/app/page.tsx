import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מרחב עבודה | ZchuyotBuddy",
  description: "ניהול תיקים חכם - לוח בקרה אישי",
};

/**
 * Stitch Dashboard/App Page Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_1/
 */
export default function StitchAppPage() {
  return (
    <div
      dir="rtl"
      className="relative flex h-screen w-full flex-col overflow-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-gray-50/50"
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

      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-20%] w-[60%] h-[40%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col pt-12 px-6 pb-4 bg-white sticky top-0 z-20 shadow-sm/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[22px]">shield_person</span>
            </div>
            <div>
              <h1 className="text-text-dark font-bold text-xl leading-tight">מרחב עבודה</h1>
              <p className="text-text-subtle text-xs font-medium">ניהול תיקים חכם</p>
            </div>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-text-subtle hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>

        {/* Progress cards slider */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
          <div className="min-w-[280px] bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 relative overflow-hidden flex flex-col justify-between h-[140px]">
            <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="flex justify-between items-start relative z-10">
              <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold">
                תביעת נכות כללית
              </div>
              <span className="material-symbols-outlined text-white/80">more_horiz</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-english font-bold mb-1">84%</div>
              <div className="text-sm font-medium text-white/90">השלמת מסמכים רפואיים</div>
              <div className="w-full bg-black/20 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-white h-full w-[84%] rounded-full" />
              </div>
            </div>
          </div>

          <div className="min-w-[280px] bg-white border border-gray-100 p-4 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[140px]">
            <div className="flex justify-between items-start">
              <div className="bg-gray-100 text-text-subtle px-2.5 py-1 rounded-lg text-[11px] font-bold">
                ניידות
              </div>
            </div>
            <div>
              <div className="text-3xl font-english font-bold text-text-dark mb-1">12%</div>
              <div className="text-sm font-medium text-text-subtle">איסוף ראשוני</div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-accent h-full w-[12%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-24">
        {/* Next steps section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">timeline</span>
              הצעדים הבאים
            </h2>
            <span className="text-xs font-bold text-primary cursor-pointer">הצג הכל</span>
          </div>
          <div className="relative pl-2">
            <div className="absolute right-[27px] top-4 bottom-4 w-[2px] bg-gray-100" />

            <div className="relative flex items-start gap-4 mb-6">
              <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-white border-2 border-primary flex items-center justify-center shadow-soft">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  upload_file
                </span>
              </div>
              <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-card">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-text-dark text-sm">העלאת סיכום ביקור</h3>
                  <span className="bg-status-blue-bg text-status-blue-text text-[10px] font-bold px-2 py-0.5 rounded-full">
                    לביצוע
                  </span>
                </div>
                <p className="text-xs text-text-subtle mb-3 leading-relaxed">
                  יש להעלות את סיכום הביקור האחרון אצל הנוירולוג מבית החולים איכילוב.
                </p>
                <button
                  type="button"
                  className="w-full py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                  העלה מסמך
                </button>
              </div>
            </div>

            <div className="relative flex items-start gap-4">
              <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-[24px]">gavel</span>
              </div>
              <div className="flex-1 py-2">
                <h3 className="font-bold text-text-subtle text-sm mb-1">וועדה רפואית</h3>
                <p className="text-xs text-gray-400">ממתין לזימון תור</p>
              </div>
            </div>
          </div>
        </section>

        {/* Documents section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">folder_open</span>
              מסמכים ועזרים
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-card hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="font-bold text-text-dark text-sm mb-1">תיקייה רפואית</div>
              <div className="text-xs text-text-subtle">12 מסמכים</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-card hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-accent mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">edit_note</span>
              </div>
              <div className="font-bold text-text-dark text-sm mb-1">הערות אישיות</div>
              <div className="text-xs text-text-subtle">3 פתקים</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-card hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">calculate</span>
              </div>
              <div className="font-bold text-text-dark text-sm mb-1">מחשבון זכויות</div>
              <div className="text-xs text-text-subtle">בדוק זכאות</div>
            </div>

            <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-gray-400 mb-2">add</span>
              <span className="text-xs font-bold text-gray-400">הוסף קיצור דרך</span>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 w-full md:max-w-md md:left-auto bg-white border-t border-gray-100 px-6 py-3 pb-6 z-30 flex justify-between items-center text-xs font-medium text-gray-400">
        <button type="button" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span>ראשי</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center gap-1 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">assignment</span>
          <span>משימות</span>
        </button>
        <div className="w-12" />
        <button
          type="button"
          className="flex flex-col items-center gap-1 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
          <span>צ&apos;אט</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center gap-1 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span>פרופיל</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <button
            type="button"
            className="w-14 h-14 rounded-full bg-surface-purple text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
