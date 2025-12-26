import type { Metadata } from "next";
import Link from "next/link";
import PricingCard from "@/components/stitch/pricing/PricingCard";

export const metadata: Metadata = {
  title: "תוכניות מינוי | ZchuyotBuddy",
  description: "בחר את התוכנית המתאימה לך - גישה לכלים מתקדמים וליווי אישי",
};

const pricingPlans = [
  {
    name: "Free",
    hebrewName: "חינם",
    description: "למתחילים את הדרך",
    price: 0,
    features: [{ text: "גישה למדריכים בסיסיים" }, { text: "מחשבון זכויות פשוט" }],
  },
  {
    name: "Plus",
    hebrewName: "פלוס",
    description: "למי שצריך קצת יותר",
    price: 29,
    features: [
      { text: "כל מה שבחינם" },
      { text: "טפסים דיגיטליים חכמים" },
      { text: "תזכורות לחידוש זכאות" },
    ],
  },
  {
    name: "Pro",
    hebrewName: "מקצועי",
    description: "ליווי צמוד ומקיף",
    price: 59,
    featured: true,
    features: [
      { text: "כל מה שבפלוס" },
      { text: "צ'אט עם מומחה זכויות" },
      { text: "בדיקת מסמכים לפני שליחה" },
      { text: "ליווי בוועדות רפואיות (וירטואלי)" },
    ],
  },
  {
    name: "Max",
    hebrewName: "מקס",
    description: "החבילה המלאה להצלחה בטוחה",
    price: 129,
    premium: true,
    features: [
      { text: "כל מה שבמקצועי" },
      { text: "עורך דין צמוד לתיק" },
      { text: "ערעור במידת הצורך ללא עלות נוספת" },
    ],
  },
];

/**
 * Pricing Page
 * Based on Stitch design: welcome_to_zchuyotbuddy_4
 */
export default function PricingPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden no-scrollbar bg-gray-50/50"
      dir="rtl"
      lang="he"
    >
      {/* Background decorations */}
      <div
        className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-primary/5 blur-[80px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-[20%] left-[-10%] w-[40%] h-[30%] rounded-full bg-primary/5 blur-[60px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="flex items-center justify-between p-6 pt-8 z-10 sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100/50 max-w-4xl mx-auto w-full">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-dark hover:bg-gray-200 transition-colors"
          aria-label="חזרה"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </Link>
        <span className="text-text-dark font-bold text-lg tracking-tight">תוכניות מינוי</span>
        <button
          type="button"
          className="text-primary font-bold text-sm hover:text-primary-light transition-colors"
        >
          שחזר
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-6 pb-24 relative z-10 w-full overflow-y-auto max-w-4xl mx-auto">
        {/* Intro */}
        <div className="text-center mt-4 mb-8">
          <h1 className="text-2xl font-extrabold text-text-dark mb-2">בחר את התוכנית המתאימה לך</h1>
          <p className="text-text-subtle text-sm">
            שדרג את החוויה שלך עם גישה לכלים מתקדמים וליווי אישי.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-6 bg-gray-100 p-1 rounded-full w-fit mx-auto">
            <button
              type="button"
              className="px-4 py-1.5 rounded-full text-sm font-bold bg-white text-primary shadow-sm transition-all"
            >
              חודשי
            </button>
            <button
              type="button"
              className="px-4 py-1.5 rounded-full text-sm font-medium text-text-subtle hover:text-text-dark transition-all"
            >
              שנתי{" "}
              <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full mr-1">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="space-y-4">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              hebrewName={plan.hebrewName}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              featured={plan.featured}
              premium={plan.premium}
            />
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex justify-center items-center gap-6 mt-2 mb-4 opacity-70">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-gray-400 text-2xl" aria-hidden="true">
              lock
            </span>
            <span className="text-[10px] text-text-subtle mt-1">תשלום מאובטח</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-gray-400 text-2xl" aria-hidden="true">
              cancel
            </span>
            <span className="text-[10px] text-text-subtle mt-1">ביטול בכל עת</span>
          </div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-8 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            className="w-full flex items-center justify-center rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]"
          >
            <span className="text-lg font-bold tracking-tight">המשך עם תוכנית Pro</span>
          </button>
          <p className="text-center text-[11px] text-text-subtle mt-3">
            בלחיצה על &quot;המשך&quot; אני מסכים{" "}
            <Link href="/terms" className="underline text-primary">
              לתנאי השימוש
            </Link>{" "}
            ול
            <Link href="/privacy" className="underline text-primary">
              מדיניות הפרטיות
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
