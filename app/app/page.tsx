import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מרחב עבודה | ZchuyotBuddy",
  description: "ניהול תיקים חכם - לוח בקרה אישי",
};

const progressCards = [
  {
    title: "תביעת נכות כללית",
    progress: 84,
    status: "השלמת מסמכים רפואיים",
    primary: true,
  },
  {
    title: "ניידות",
    progress: 12,
    status: "איסוף ראשוני",
    primary: false,
  },
];

const nextSteps = [
  {
    icon: "upload_file",
    title: "העלאת סיכום ביקור",
    description: "יש להעלות את סיכום הביקור האחרון אצל הנוירולוג מבית החולים איכילוב.",
    status: "לביצוע",
    action: "העלה מסמך",
    actionIcon: "add_a_photo",
    active: true,
  },
  {
    icon: "gavel",
    title: "וועדה רפואית",
    description: "ממתין לזימון תור",
    active: false,
  },
];

const documents = [
  { icon: "description", title: "תיקייה רפואית", subtitle: "12 מסמכים", color: "purple" },
  { icon: "edit_note", title: "הערות אישיות", subtitle: "3 פתקים", color: "orange" },
  { icon: "calculate", title: "מחשבון זכויות", subtitle: "בדוק זכאות", color: "green" },
];

const navItems = [
  { icon: "dashboard", label: "ראשי", href: "/app", active: true },
  { icon: "assignment", label: "משימות", href: "/app", active: false },
  { icon: "chat_bubble", label: "צ'אט", href: "/chat", active: false },
  { icon: "person", label: "פרופיל", href: "/settings", active: false },
];

/**
 * Dashboard/Workspace Page
 * Based on Stitch design: welcome_to_zchuyotbuddy_1
 */
export default function AppPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-hidden no-scrollbar bg-gray-50/50"
      dir="rtl"
      lang="he"
    >
      {/* Background decoration */}
      <div
        className="absolute top-[-10%] right-[-20%] w-[60%] h-[40%] rounded-full bg-primary/5 blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="flex flex-col pt-12 px-6 pb-4 bg-white sticky top-0 z-20 shadow-sm/50">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                shield_person
              </span>
            </div>
            <div>
              <h1 className="text-text-dark font-bold text-xl leading-tight">מרחב עבודה</h1>
              <p className="text-text-subtle text-xs font-medium">ניהול תיקים חכם</p>
            </div>
          </Link>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-text-subtle hover:bg-gray-100 hover:text-primary transition-colors"
            aria-label="התראות"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>

        {/* Progress cards slider */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
          {progressCards.map((card) => (
            <div
              key={card.title}
              className={`min-w-[280px] ${
                card.primary ? "bg-primary text-white" : "bg-white border border-gray-100"
              } p-4 rounded-2xl ${
                card.primary ? "shadow-lg shadow-primary/20" : "shadow-sm"
              } relative overflow-hidden flex flex-col justify-between h-[140px]`}
            >
              {card.primary && (
                <div
                  className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-white/10 rounded-full blur-xl"
                  aria-hidden="true"
                />
              )}
              <div className="flex justify-between items-start relative z-10">
                <div
                  className={`${
                    card.primary ? "bg-white/20 backdrop-blur-md" : "bg-gray-100 text-text-subtle"
                  } px-2.5 py-1 rounded-lg text-[11px] font-bold`}
                >
                  {card.title}
                </div>
                {card.primary && (
                  <span className="material-symbols-outlined text-white/80" aria-hidden="true">
                    more_horiz
                  </span>
                )}
              </div>
              <div className="relative z-10">
                <div
                  className={`text-3xl font-bold mb-1 ${card.primary ? "text-white" : "text-text-dark"}`}
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {card.progress}%
                </div>
                <div
                  className={`text-sm font-medium ${card.primary ? "text-white/90" : "text-text-subtle"}`}
                >
                  {card.status}
                </div>
                <div
                  className={`w-full ${card.primary ? "bg-black/20" : "bg-gray-100"} h-1.5 rounded-full mt-3 overflow-hidden`}
                >
                  <div
                    className={`${card.primary ? "bg-white" : "bg-accent"} h-full rounded-full`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-24">
        {/* Next steps section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">
                timeline
              </span>
              הצעדים הבאים
            </h2>
            <button type="button" className="text-xs font-bold text-primary cursor-pointer">
              הצג הכל
            </button>
          </div>
          <div className="relative pl-2">
            <div
              className="absolute right-[27px] top-4 bottom-4 w-[2px] bg-gray-100"
              aria-hidden="true"
            />
            {nextSteps.map((step) => (
              <div key={step.title} className="relative flex items-start gap-4 mb-6">
                <div
                  className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl ${
                    step.active
                      ? "bg-white border-2 border-primary shadow-soft"
                      : "bg-gray-50 border border-gray-100"
                  } flex items-center justify-center`}
                >
                  <span
                    className={`material-symbols-outlined ${step.active ? "text-primary" : "text-gray-400"} text-[24px]`}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </span>
                </div>
                {step.active ? (
                  <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-text-dark text-sm">{step.title}</h3>
                      <span className="bg-[#e0f2fe] text-[#0369a1] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {step.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-subtle mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    <button
                      type="button"
                      className="w-full py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                        {step.actionIcon}
                      </span>
                      {step.action}
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 py-2">
                    <h3 className="font-bold text-text-subtle text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Documents section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <span className="material-symbols-outlined text-accent" aria-hidden="true">
                folder_open
              </span>
              מסמכים ועזרים
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {documents.map((doc) => (
              <Link
                key={doc.title}
                href="/documents"
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group text-right"
              >
                <div
                  className={`w-10 h-10 rounded-full ${
                    doc.color === "purple"
                      ? "bg-purple-50 text-primary"
                      : doc.color === "orange"
                        ? "bg-orange-50 text-accent"
                        : "bg-green-50 text-green-600"
                  } flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {doc.icon}
                  </span>
                </div>
                <div className="font-bold text-text-dark text-sm mb-1">{doc.title}</div>
                <div className="text-xs text-text-subtle">{doc.subtitle}</div>
              </Link>
            ))}
            <button
              type="button"
              className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400 mb-2" aria-hidden="true">
                add
              </span>
              <span className="text-xs font-bold text-gray-400">הוסף קיצור דרך</span>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 pb-6 z-30 flex justify-between items-center text-xs font-medium text-gray-400">
        {navItems.slice(0, 2).map((item) => (
          <Link
            key={item.icon}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${item.active ? "text-primary" : "hover:text-primary"} transition-colors`}
          >
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="w-12" />
        {navItems.slice(2).map((item) => (
          <Link
            key={item.icon}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${item.active ? "text-primary" : "hover:text-primary"} transition-colors`}
          >
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Center AI button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <Link
            href="/chat"
            className="w-14 h-14 rounded-full bg-surface-purple text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
            aria-label="עוזר AI"
          >
            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
