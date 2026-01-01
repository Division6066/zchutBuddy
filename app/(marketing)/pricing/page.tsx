"use client";

import { useState } from "react";
import { SignUpModal } from "@/components/SignUpModal";
import { useTranslation } from "@/lib/i18n";

export default function PricingPage() {
  const { t, locale } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const plans = [
    {
      name: locale === "he" ? "פלוס" : "Plus",
      monthlyPrice: 69,
      annualPrice: 690, // 10 months instead of 12
      description: locale === "he" ? "לשימוש קבוע" : "For regular use",
      features:
        locale === "he"
          ? [
              "חיפושים ללא הגבלה",
              "רשימות משימות מותאמות",
              "אחסון מסמכים",
              "תמיכה מועדפת",
              "עדכונים בזמן אמת",
            ]
          : [
              "Unlimited searches",
              "Custom task lists",
              "Document storage",
              "Priority support",
              "Real-time updates",
            ],
      highlighted: false,
      cta: locale === "he" ? "בחר בפלוס" : "Choose Plus",
    },
    {
      name: locale === "he" ? "פרו" : "Pro",
      monthlyPrice: 99,
      annualPrice: 990, // 10 months instead of 12
      description: locale === "he" ? "לצרכים מתקדמים" : "For advanced needs",
      features:
        locale === "he"
          ? ["הכל בפלוס", "יועץ אישי", "עיבוד מואץ", "דוחות מותאמים אישית", "תמיכה טלפונית"]
          : [
              "Everything in Plus",
              "Personal advisor",
              "Expedited processing",
              "Custom reports",
              "Phone support",
            ],
      highlighted: true,
      cta: locale === "he" ? "בחר בפרו" : "Choose Pro",
      badge: locale === "he" ? "הכי פופולרי" : "Most Popular",
    },
    {
      name: locale === "he" ? "מקס" : "Max",
      monthlyPrice: 199,
      annualPrice: 1990, // 10 months instead of 12
      description: locale === "he" ? "לשירות פרימיום" : "For premium service",
      features:
        locale === "he"
          ? [
              "הכל בפרו",
              "מנהל חשבון ייעודי",
              "ייעוץ אישי בלתי מוגבל",
              "עדיפות מלאה בתורים",
              "גישה ל-API לאינטגרציות",
            ]
          : [
              "Everything in Pro",
              "Dedicated account manager",
              "Unlimited personal consulting",
              "Full priority in queues",
              "API access for integrations",
            ],
      highlighted: false,
      cta: locale === "he" ? "בחר במקס" : "Choose Max",
    },
  ];

  const freeTrialText = locale === "he" ? "14 ימי ניסיון חינם" : "14-day free trial";
  const annualSaveText = locale === "he" ? "חסוך 2 חודשים!" : "Save 2 months!";
  const perMonthText = locale === "he" ? "/חודש" : "/mo";
  const billedAnnuallyText = locale === "he" ? "חיוב שנתי מראש" : "Billed annually upfront";
  const allPlansIncludeText =
    locale === "he"
      ? "כל התוכניות כוללות 14 ימי ניסיון חינם. בטל בכל עת."
      : "All plans include a 14-day free trial. Cancel anytime.";

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary/10 via-background to-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <span className="material-symbols-outlined text-base">verified</span>
            {freeTrialText}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            {t("pricing.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {allPlansIncludeText}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-card p-2 rounded-xl border border-border">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !isAnnual
                  ? "bg-primary text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                isAnnual
                  ? "bg-primary text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("pricing.annual")}
              <span className="text-xs bg-success text-white px-2 py-1 rounded-full font-bold">
                {annualSaveText}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
              const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              const monthlyEquivalent = isAnnual ? Math.round(plan.annualPrice / 12) : null;

              return (
                <div
                  key={index}
                  className={`relative bg-card p-8 rounded-2xl border transition-all ${
                    plan.highlighted
                      ? "border-primary shadow-xl shadow-primary/20 scale-105 z-10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-full shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-foreground mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                    <div className="flex flex-col items-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-black text-primary">₪{displayPrice}</span>
                        {!isAnnual && (
                          <span className="text-muted-foreground font-medium">{perMonthText}</span>
                        )}
                      </div>

                      {isAnnual && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-muted-foreground">{billedAnnuallyText}</p>
                          <p className="text-xs text-primary font-bold">
                            {locale === "he"
                              ? `(שווה ערך ל-₪${monthlyEquivalent}/חודש)`
                              : `(equivalent to ₪${monthlyEquivalent}/mo)`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="material-symbols-outlined text-primary text-lg shrink-0">
                          check_circle
                        </span>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setShowSignUp(true)}
                    className={`w-full h-14 rounded-xl font-bold text-lg transition-all ${
                      plan.highlighted
                        ? "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30"
                        : "bg-background border-2 border-primary text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <p className="text-center text-xs text-muted-foreground mt-4">{freeTrialText}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-card py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-foreground mb-12 text-center">
            {locale === "he" ? "שאלות נפוצות" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-4">
            {(locale === "he"
              ? [
                  {
                    q: "מה כלול בניסיון החינם?",
                    a: "ניסיון החינם כולל גישה מלאה לכל התכונות של התוכנית שבחרת למשך 14 יום. לא תחויב עד סוף תקופת הניסיון.",
                  },
                  {
                    q: "מה ההבדל בין חיוב חודשי לשנתי?",
                    a: "בחיוב שנתי אתה משלם מראש עבור 10 חודשים ומקבל 12 חודשי שירות - חיסכון של חודשיים!",
                  },
                  {
                    q: "האם אני יכול לבטל בכל עת?",
                    a: "כן, אתה יכול לבטל את המנוי שלך בכל עת. לא תחויב לאחר הביטול.",
                  },
                  {
                    q: "מה קורה לנתונים שלי אם אני מבטל?",
                    a: "הנתונים שלך נשמרים למשך 30 יום לאחר הביטול. אתה יכול לייצא אותם בכל עת.",
                  },
                  {
                    q: "האם ניתן לשדרג או לשנמך תוכנית?",
                    a: "בהחלט! תוכל לשנות את התוכנית שלך בכל עת ותחויב באופן יחסי.",
                  },
                ]
              : [
                  {
                    q: "What's included in the free trial?",
                    a: "The free trial includes full access to all features of your chosen plan for 14 days. You won't be charged until the trial ends.",
                  },
                  {
                    q: "What's the difference between monthly and annual billing?",
                    a: "With annual billing, you pay upfront for 10 months and get 12 months of service - saving 2 months!",
                  },
                  {
                    q: "Can I cancel anytime?",
                    a: "Yes, you can cancel your subscription at any time. You won't be charged after cancellation.",
                  },
                  {
                    q: "What happens to my data if I cancel?",
                    a: "Your data is kept for 30 days after cancellation. You can export it at any time.",
                  },
                  {
                    q: "Can I upgrade or downgrade my plan?",
                    a: "Absolutely! You can change your plan at any time and you'll be charged proportionally.",
                  },
                ]
            ).map((faq, index) => (
              <div key={index} className="bg-background p-6 rounded-xl border border-border">
                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </>
  );
}
