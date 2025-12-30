"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function ChecklistsPage() {
  const { t } = useTranslation();

  // Mock data - in production, this would come from Convex
  const checklists = [
    {
      id: "1",
      title: "הגשת תביעה לדמי אבטלה",
      description: "כל השלבים להגשת תביעה לדמי אבטלה בביטוח לאומי",
      progress: 60,
      totalSteps: 8,
      completedSteps: 5,
      status: "in_progress" as const,
      updatedAt: "לפני שעתיים",
    },
    {
      id: "2",
      title: "בדיקת זכאות לנכות כללית",
      description: "תהליך בדיקת זכאות לגמלת נכות כללית",
      progress: 25,
      totalSteps: 12,
      completedSteps: 3,
      status: "in_progress" as const,
      updatedAt: "אתמול",
    },
    {
      id: "3",
      title: "הנחה בארנונה",
      description: "הגשת בקשה להנחה בארנונה",
      progress: 100,
      totalSteps: 5,
      completedSteps: 5,
      status: "completed" as const,
      updatedAt: "לפני שבוע",
    },
  ];

  const getStatusColor = (status: "in_progress" | "completed") => {
    return status === "completed"
      ? "bg-success-bg text-success"
      : "bg-primary/10 text-primary";
  };

  const getStatusLabel = (status: "in_progress" | "completed") => {
    return status === "completed" ? t("checklists.completed") : t("checklists.inProgress");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">checklist</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-foreground">{t("checklists.title")}</h1>
                <p className="text-sm text-muted-foreground">מעקב אחר התקדמות בתהליכים</p>
              </div>
            </div>
            <button className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 transition-colors shadow-primary">
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="hidden sm:inline">{t("checklists.createNew")}</span>
            </button>
          </div>
        </div>

        {/* Checklists */}
        {checklists.length > 0 ? (
          <div className="space-y-4">
            {checklists.map((checklist) => (
              <Link
                key={checklist.id}
                href={`/checklists/${checklist.id}`}
                className="block bg-card rounded-2xl p-5 border border-border shadow-soft hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground mb-1 truncate">{checklist.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{checklist.description}</p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(checklist.status)}`}>
                    {getStatusLabel(checklist.status)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      {checklist.completedSteps} מתוך {checklist.totalSteps} {t("checklists.steps")}
                    </span>
                    <span className="font-bold text-foreground">{checklist.progress}%</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        checklist.progress === 100 ? "bg-success" : "bg-primary"
                      }`}
                      style={{ width: `${checklist.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">עודכן {checklist.updatedAt}</span>
                  <span className="text-primary font-medium flex items-center gap-1">
                    צפה בפרטים
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="size-20 rounded-2xl bg-accent text-muted-foreground flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">checklist</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t("checklists.empty")}</h3>
            <p className="text-muted-foreground mb-6">
              צור רשימת משימות חדשה להתחיל לעקוב אחר התקדמות
            </p>
            <button className="h-12 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 mx-auto transition-colors shadow-primary">
              <span className="material-symbols-outlined">add</span>
              {t("checklists.createNew")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
