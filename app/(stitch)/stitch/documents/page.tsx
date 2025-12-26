import type { Metadata } from "next";
import Link from "next/link";
import StitchBackground from "@/components/stitch/StitchBackground";

export const metadata: Metadata = {
  title: "יצירת ערכות מסמכים | ZchuyotBuddy",
  description: "בחרו את התבניות שברצונכם להפיק",
};

const documentTypes = [
  {
    icon: "article",
    title: "מכתב מקדים",
    description: "פנייה רשמית לוועדה",
    color: "indigo",
    checked: true,
  },
  {
    icon: "accessibility_new",
    title: "בקשה להתאמות",
    description: "נגישות מיוחדת בוועדה",
    color: "orange",
    checked: false,
  },
  {
    icon: "gavel",
    title: "תבנית ערעור",
    description: "טיוטה להגשת ערעור",
    color: "rose",
    checked: false,
  },
  {
    icon: "clinical_notes",
    title: "בקשה למכתב רופא",
    description: "הנחיות לחוות דעת",
    color: "emerald",
    checked: false,
  },
];

/**
 * Stitch Documents Generator Page Preview
 * Based on: design/stitch-export/stitch_welcome_to_zchuyotbuddy/welcome_to_zchuyotbuddy_7/
 */
export default function StitchDocumentsPage() {
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
        <Link href="/stitch/app" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
              shield
            </span>
          </div>
          <span className="text-text-dark font-extrabold text-xl tracking-tight">ZchuyotBuddy</span>
        </Link>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm text-text-subtle hover:bg-gray-50 transition-colors"
          aria-label="תפריט"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 z-10 no-scrollbar">
        {/* Title */}
        <div className="mt-2 mb-8">
          <h1 className="text-3xl font-extrabold text-surface-purple leading-tight mb-3">
            יצירת ערכות מסמכים
          </h1>
          <p className="text-text-subtle text-lg leading-relaxed font-medium">
            בחרו את התבניות שברצונכם להפיק. אנו נמלא אותן אוטומטית עבורכם.
          </p>
        </div>

        {/* Document selection */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-subtle uppercase tracking-wider">
              מסמכים זמינים
            </span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
              נבחרו 1
            </span>
          </div>

          {documentTypes.map((doc) => (
            <label
              key={doc.icon}
              className="group relative flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-soft"
            >
              <input type="checkbox" defaultChecked={doc.checked} className="peer sr-only" />
              <div
                className={`w-12 h-12 rounded-xl ${
                  doc.color === "indigo"
                    ? "bg-indigo-50 text-indigo-600"
                    : doc.color === "orange"
                      ? "bg-orange-50 text-orange-600"
                      : doc.color === "rose"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-emerald-50 text-emerald-600"
                } flex items-center justify-center ml-4 shrink-0 group-hover:scale-105 transition-transform`}
              >
                <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
                  {doc.icon}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-dark text-base">{doc.title}</h3>
                <p className="text-sm text-text-subtle mt-0.5">{doc.description}</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-white peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-all scale-95 peer-checked:scale-100">
                <span
                  className="material-symbols-outlined text-white text-[14px] font-bold opacity-0 peer-checked:opacity-100"
                  aria-hidden="true"
                >
                  check
                </span>
              </div>
            </label>
          ))}
        </div>

        {/* Export format */}
        <div className="mb-4">
          <div className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-3">
            פורמט ייצוא
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="cursor-pointer group">
              <input type="radio" name="format" defaultChecked={true} className="peer sr-only" />
              <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white text-text-subtle hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all shadow-sm peer-checked:shadow-inner">
                <span
                  className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                >
                  picture_as_pdf
                </span>
                <span className="font-bold text-sm">PDF</span>
              </div>
            </label>
            <label className="cursor-pointer group">
              <input type="radio" name="format" className="peer sr-only" />
              <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white text-text-subtle hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all shadow-sm peer-checked:shadow-inner">
                <span
                  className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                >
                  description
                </span>
                <span className="font-bold text-sm">Word</span>
              </div>
            </label>
          </div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-20">
        <button
          type="button"
          className="w-full h-14 bg-primary rounded-2xl text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <span className="text-lg font-bold tracking-tight">הפק מסמכים</span>
          <span className="material-symbols-outlined" aria-hidden="true">
            wand_shine
          </span>
        </button>
      </div>
    </div>
  );
}
