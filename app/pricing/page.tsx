"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "חינם (Free)",
      description: "למתחילים את הדרך",
      monthlyPrice: "₪0",
      annualPrice: "₪0",
      features: ["גישה למדריכים בסיסיים", "מחשבון זכויות פשוט"],
      popular: false,
      gradient: false,
    },
    {
      name: "פלוס (Plus)",
      description: "למי שצריך קצת יותר",
      monthlyPrice: "₪29",
      annualPrice: "₪23",
      features: ["כל מה שבחינם", "טפסים דיגיטליים חכמים", "תזכורות לחידוש זכאות"],
      popular: false,
      gradient: false,
    },
    {
      name: "מקצועי (Pro)",
      description: "ליווי צמוד ומקיף",
      monthlyPrice: "₪59",
      annualPrice: "₪47",
      features: [
        "כל מה שבפלוס",
        "צ'אט עם מומחה זכויות",
        "בדיקת מסמכים לפני שליחה",
        "ליווי בוועדות רפואיות (וירטואלי)",
      ],
      popular: true,
      gradient: false,
    },
    {
      name: "מקס (Max)",
      description: "החבילה המלאה להצלחה בטוחה",
      monthlyPrice: "₪129",
      annualPrice: "₪103",
      features: [
        "כל מה שבמקצועי",
        "עורך דין צמוד לתיק",
        "ערעור במידת הצורך ללא עלות נוספת",
      ],
      popular: false,
      gradient: true,
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden bg-gray-50/50">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[50%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] h-[30%] w-[40%] rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-8 z-10 sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
        <Link href="/" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-dark hover:bg-gray-200 transition-colors">
          <Icon name="close" size={24} />
        </Link>
        <span className="text-text-dark font-bold text-lg tracking-tight">תוכניות מינוי</span>
        <button className="text-primary font-bold text-sm hover:text-primary-light transition-colors">
          שחזר
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-24 relative z-10 w-full overflow-y-auto">
        <div className="text-center mt-4 mb-8">
          <h1 className="text-2xl font-extrabold text-text-dark mb-2">בחר את התוכנית המתאימה לך</h1>
          <p className="text-text-subtle text-sm">שדרג את החוויה שלך עם גישה לכלים מתקדמים וליווי אישי.</p>
          <div className="flex items-center justify-center gap-3 mt-6 bg-gray-100 p-1 rounded-full w-fit mx-auto">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-subtle hover:text-text-dark"
              }`}
            >
              חודשי
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                billingCycle === "annual"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-subtle hover:text-text-dark"
              }`}
            >
              שנתי{" "}
              <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full mr-1">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {plans.map((plan, index) => {
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const isPro = plan.name.includes("מקצועי");

            if (plan.gradient) {
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#2b1c4e] to-[#4c3575] rounded-2xl p-5 shadow-lg relative overflow-hidden text-white"
                >
                  <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-white/10 rounded-full blur-2xl" />
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                      <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        {plan.name}
                        <Icon name="workspace_premium" size={16} className="text-amber-400" />
                      </h3>
                      <p className="text-xs text-gray-300 mt-1">{plan.description}</p>
                    </div>
                    <div className="text-right relative z-10">
                      <span className="text-2xl font-extrabold text-white">{price}</span>
                      <span className="text-xs text-gray-300 block">לחודש</span>
                    </div>
                  </div>
                  <div className="h-px w-full bg-white/20 my-3 relative z-10" />
                  <ul className="space-y-2.5 relative z-10">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm text-gray-100">
                        <span className="text-amber-400 text-[18px]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <Card
                key={index}
                className={`p-5 relative overflow-hidden group hover:border-primary/30 transition-all ${
                  isPro ? "border-2 border-primary shadow-soft transform scale-[1.02]" : ""
                }`}
              >
                {isPro && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">
                    הכי פופולרי
                  </div>
                )}
                <div className={`flex justify-between items-start mb-3 ${isPro ? "pt-8" : ""}`}>
                  <div>
                    <h3 className={`font-bold text-lg ${isPro ? "text-primary" : "text-text-dark"}`}>
                      {plan.name}
                    </h3>
                    <p className="text-xs text-text-subtle mt-1">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-${isPro ? "3xl" : "2xl"} font-extrabold ${
                        isPro ? "text-primary" : "text-text-dark"
                      }`}
                    >
                      {price}
                    </span>
                    <span className="text-xs text-text-subtle block">לחודש</span>
                  </div>
                </div>
                <div className="h-px w-full bg-gray-100 my-3" />
                <ul className="space-y-2.5">
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className={`flex items-center gap-2 text-sm ${
                        isPro ? "text-text-dark font-medium" : "text-text-subtle"
                      }`}
                    >
                      <span className="text-primary text-[18px]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center items-center gap-6 mt-2 mb-4 opacity-70">
          <div className="flex flex-col items-center">
            <Icon name="lock" size={24} className="text-gray-400" />
            <span className="text-[10px] text-text-subtle mt-1">תשלום מאובטח</span>
          </div>
          <div className="flex flex-col items-center">
            <Icon name="cancel" size={24} className="text-gray-400" />
            <span className="text-[10px] text-text-subtle mt-1">ביטול בכל עת</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-8 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button className="w-full flex items-center justify-center rounded-2xl h-14 bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98]">
          <span className="text-lg font-bold tracking-tight">המשך עם תוכנית Pro</span>
        </Button>
        <p className="text-center text-[11px] text-text-subtle mt-3">
          בלחיצה על "המשך" אני מסכים{" "}
          <a className="underline text-primary" href="#">
            לתנאי השימוש
          </a>{" "}
          ול<a className="underline text-primary" href="#">
            מדיניות הפרטיות
          </a>
          .
        </p>
      </div>
    </div>
  );
}
