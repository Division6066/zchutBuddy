import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "פרופיל והגדרות | ZchuyotBuddy",
  description: "ניהול חשבון, העדפות ומינוי",
};

/**
 * Stitch Profile & Settings Page Preview
 * Based on Stitch design patterns
 */
export default function StitchSettingsPage() {
  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden md:max-w-md md:mx-auto md:border-x md:border-gray-100 no-scrollbar bg-gray-50/50"
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

      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-6 pt-12">
        <h1 className="text-xl font-extrabold text-text-dark text-center">פרופיל והגדרות</h1>
      </header>

      {/* Profile card */}
      <div className="bg-white border-b border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <Image
                src="/placeholder.svg"
                alt="תמונת פרופיל"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute bottom-0 left-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-text-dark">ישראל ישראלי</h2>
            <p className="text-sm text-text-subtle">israel@email.com</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                חשבון פרימיום
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 relative z-10">
        {/* Account section */}
        <section>
          <h3 className="text-sm font-bold text-text-subtle mb-3 pr-1">חשבון</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Link
              href="/profile"
              className="flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">person</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">פרטים אישיים</h4>
                <p className="text-xs text-text-subtle">עדכון שם, ת.ז., טלפון</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </Link>

            <Link
              href="/onboarding-step-4"
              className="flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">medical_information</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">מידע רפואי</h4>
                <p className="text-xs text-text-subtle">מוגבלויות ומצב בריאותי</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </Link>

            <Link
              href="/documents"
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">folder</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">המסמכים שלי</h4>
                <p className="text-xs text-text-subtle">ניהול מסמכים וקבצים</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </Link>
          </div>
        </section>

        {/* Preferences section */}
        <section>
          <h3 className="text-sm font-bold text-text-subtle mb-3 pr-1">העדפות</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">התראות</h4>
                <p className="text-xs text-text-subtle">ניהול הודעות ותזכורות</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <div className="flex items-center gap-4 p-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">dark_mode</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">מצב כהה</h4>
                <p className="text-xs text-text-subtle">עיצוב כהה לאפליקציה</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <button
              type="button"
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-right"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">language</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">שפה</h4>
                <p className="text-xs text-text-subtle">עברית</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </button>
          </div>
        </section>

        {/* Subscription section */}
        <section>
          <h3 className="text-sm font-bold text-text-subtle mb-3 pr-1">מינוי</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Link
              href="/pricing"
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">star</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">תוכנית פרימיום</h4>
                <p className="text-xs text-text-subtle">פעיל עד 15/01/2026</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </Link>
          </div>
        </section>

        {/* Support section */}
        <section>
          <h3 className="text-sm font-bold text-text-subtle mb-3 pr-1">תמיכה</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors text-right"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">help</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">מרכז עזרה</h4>
                <p className="text-xs text-text-subtle">שאלות נפוצות ומדריכים</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors text-right"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">chat</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">צור קשר</h4>
                <p className="text-xs text-text-subtle">שלח הודעה לצוות התמיכה</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </button>

            <Link
              href="/about"
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">info</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-text-dark">אודות</h4>
                <p className="text-xs text-text-subtle">גרסה 1.0.0</p>
              </div>
              <span className="material-symbols-outlined text-text-subtle">arrow_back</span>
            </Link>
          </div>
        </section>

        {/* Logout */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          התנתקות
        </button>

        {/* Version */}
        <p className="text-center text-xs text-text-subtle pb-4">
          ZchuyotBuddy v1.0.0 • © 2024
        </p>
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-100 p-4 pb-8 sticky bottom-0 z-20">
        <div className="flex items-center justify-around">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-text-subtle hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-xs font-medium">בית</span>
          </Link>
          <Link
            href="/rights-finder"
            className="flex flex-col items-center gap-1 text-text-subtle hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
            <span className="text-xs font-medium">חיפוש</span>
          </Link>
          <Link
            href="/checklists"
            className="flex flex-col items-center gap-1 text-text-subtle hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">checklist</span>
            <span className="text-xs font-medium">משימות</span>
          </Link>
          <Link
            href="/settings"
            className="flex flex-col items-center gap-1 text-primary"
          >
            <span className="material-symbols-outlined text-[24px]">person</span>
            <span className="text-xs font-bold">פרופיל</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

