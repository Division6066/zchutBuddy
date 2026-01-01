"use client";

import { useState } from "react";
import { SignUpModal } from "@/components/SignUpModal";
import { useTranslation } from "@/lib/i18n";

export default function FeaturesPage() {
  const { t } = useTranslation();
  const [showSignUp, setShowSignUp] = useState(false);

  const features = [
    {
      icon: "search",
      title: t("home.features.rightsFinder.title"),
      description: t("home.features.rightsFinder.description"),
      details: [
        "חיפוש מותאם אישית לפי המצב שלך",
        "תוצאות מגובות במקורות רשמיים",
        "מעקב אחר זכויות שטרם מומשו",
      ],
    },
    {
      icon: "checklist",
      title: t("home.features.checklists.title"),
      description: t("home.features.checklists.description"),
      details: ["רשימות משימות צעד אחר צעד", "תזכורות אוטומטיות למועדים", "מעקב התקדמות בזמן אמת"],
    },
    {
      icon: "notifications_active",
      title: t("home.features.updates.title"),
      description: t("home.features.updates.description"),
      details: ["עדכונים על שינויים בחקיקה", "התראות על זכויות חדשות", "סיכום שבועי מותאם אישית"],
    },
    {
      icon: "folder_shared",
      title: "כספת מסמכים",
      description: "אחסון מאובטח לכל המסמכים החשובים שלך",
      details: ["העלאה קלה של מסמכים", "ארגון אוטומטי לפי קטגוריות", "גישה מכל מקום"],
    },
    {
      icon: "support_agent",
      title: "תמיכה מותאמת",
      description: "צוות תמיכה זמין לעזור לך בכל שלב",
      details: ["צ'אט חי עם צוות תמיכה", "מדריכים מפורטים", "קהילת משתמשים פעילה"],
    },
    {
      icon: "security",
      title: "אבטחה מתקדמת",
      description: "המידע שלך מוגן בסטנדרטים הגבוהים ביותר",
      details: ["הצפנה מקצה לקצה", "אימות דו-שלבי", "תאימות GDPR"],
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary/10 via-background to-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            {t("nav.features")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            כל הכלים שאתה צריך כדי לנווט במערכת הזכויות הישראלית
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="material-symbols-outlined text-primary text-base mt-0.5">
                        check_circle
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-card py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-foreground mb-6">מוכן להתחיל?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            הצטרף עכשיו והתחל לגלות את הזכויות שמגיעות לך
          </p>
          <button
            onClick={() => setShowSignUp(true)}
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all shadow-lg shadow-primary/30"
          >
            {t("common.getStarted")}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </section>

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </>
  );
}
