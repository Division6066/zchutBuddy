"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  documents?: string[];
}

export default function ChecklistDetailPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  
  // Mock data - in production, this would come from Convex
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "1",
      title: "הרשמה בשירות התעסוקה",
      description: "הירשם באתר שירות התעסוקה או בסניף הקרוב",
      completed: true,
      documents: ["אישור הרשמה"],
    },
    {
      id: "2",
      title: "קבלת אישור פיטורין",
      description: "קבל מכתב פיטורין רשמי מהמעסיק",
      completed: true,
      documents: ["מכתב פיטורין"],
    },
    {
      id: "3",
      title: "איסוף תלושי משכורת",
      description: "אסוף את 12 תלושי המשכורת האחרונים",
      completed: true,
      documents: ["תלושי שכר"],
    },
    {
      id: "4",
      title: "צילום תעודת זהות",
      description: "הכן צילום של תעודת הזהות משני הצדדים",
      completed: true,
    },
    {
      id: "5",
      title: "מילוי טופס תביעה",
      description: "מלא את טופס התביעה לדמי אבטלה באתר ביטוח לאומי",
      completed: true,
    },
    {
      id: "6",
      title: "הגשת המסמכים",
      description: "העלה את כל המסמכים לאתר או שלח בדואר",
      completed: false,
    },
    {
      id: "7",
      title: "המתנה לאישור",
      description: "המתן לתשובה מביטוח לאומי (עד 21 יום)",
      completed: false,
    },
    {
      id: "8",
      title: "קבלת התשלום",
      description: "לאחר אישור, התשלום יועבר לחשבון הבנק",
      completed: false,
    },
  ]);

  const toggleStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/checklists"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
            {t("common.back")}
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-foreground mb-2">
                הגשת תביעה לדמי אבטלה
              </h1>
              <p className="text-sm text-muted-foreground">
                כל השלבים להגשת תביעה לדמי אבטלה בביטוח לאומי
              </p>
            </div>
            <span className="shrink-0 px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary">
              {t("checklists.inProgress")}
            </span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-soft mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative size-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="fill-none stroke-accent"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="fill-none stroke-primary"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 1.76} 176`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-foreground">{progress}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-foreground">התקדמות</h3>
              <p className="text-sm text-muted-foreground">
                {completedSteps} מתוך {steps.length} שלבים הושלמו
              </p>
            </div>
          </div>
          <div className="h-2 bg-accent rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-card rounded-2xl p-4 border transition-all ${
                step.completed
                  ? "border-success/30 bg-success/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`shrink-0 size-8 rounded-lg flex items-center justify-center transition-all ${
                    step.completed
                      ? "bg-success text-white"
                      : "bg-accent text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {step.completed ? (
                    <span className="material-symbols-outlined text-lg">check</span>
                  ) : (
                    <span className="font-bold text-sm">{index + 1}</span>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold mb-1 ${step.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {step.description}
                  </p>

                  {step.documents && step.documents.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {step.documents.map((doc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-accent rounded-lg text-xs text-muted-foreground"
                        >
                          <span className="material-symbols-outlined text-xs">description</span>
                          {doc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-primary">
            <span className="material-symbols-outlined">share</span>
            שתף
          </button>
          <button className="flex-1 h-12 rounded-xl bg-card border border-border text-foreground font-bold flex items-center justify-center gap-2 hover:bg-accent transition-colors">
            <span className="material-symbols-outlined">download</span>
            ייצא PDF
          </button>
        </div>
      </div>
    </div>
  );
}

