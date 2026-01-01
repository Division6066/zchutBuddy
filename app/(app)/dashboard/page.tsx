"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function DashboardPage() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: "check_circle",
      value: "5",
      label: t("dashboard.stats.activeRights"),
      color: "bg-success-bg text-success",
    },
    {
      icon: "pending",
      value: "3",
      label: t("dashboard.stats.pending"),
      color: "bg-warning-bg text-warning",
    },
    {
      icon: "description",
      value: "12",
      label: t("dashboard.stats.documents"),
      color: "bg-info-bg text-info",
    },
    {
      icon: "task_alt",
      value: "8",
      label: t("dashboard.stats.completed"),
      color: "bg-primary/10 text-primary",
    },
  ];

  const todaysTasks = [
    {
      icon: "priority_high",
      title: "הגשת טופס 106",
      subtitle: "דחוף - מועד אחרון מחר",
      badge: "דחוף",
      badgeColor: "bg-error-bg text-error",
      iconColor: "bg-error-bg text-error",
    },
    {
      icon: "schedule",
      title: "תור לביטוח לאומי",
      subtitle: "יום רביעי, 10:30",
      badge: "תזכורת",
      badgeColor: "bg-warning-bg text-warning",
      iconColor: "bg-warning-bg text-warning",
    },
    {
      icon: "upload_file",
      title: "העלאת אישור רפואי",
      subtitle: "עד סוף השבוע",
      badge: "ממתין",
      badgeColor: "bg-info-bg text-info",
      iconColor: "bg-info-bg text-info",
    },
  ];

  const quickActions = [
    {
      href: "/rights-finder",
      icon: "search",
      label: t("dashboard.rightsSearch"),
    },
    {
      href: "/checklists",
      icon: "checklist",
      label: t("dashboard.taskLists"),
    },
    {
      href: "/documents",
      icon: "folder",
      label: t("dashboard.myDocuments"),
    },
    {
      href: "/rights-map",
      icon: "map",
      label: t("dashboard.rightsMap"),
    },
  ];

  return (
    <div className="relative min-h-full">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-3xl">shield</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">
                {t("dashboard.greeting")}, ישראל
              </h1>
              <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card rounded-2xl p-4 border border-border shadow-soft">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`size-10 rounded-xl ${stat.color} flex items-center justify-center`}
                  >
                    <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                  </div>
                </div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Tasks */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">{t("dashboard.todaysTasks")}</h2>
            <Link href="/today" className="text-primary text-sm font-bold hover:underline">
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="space-y-3">
            {todaysTasks.map((task, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 border border-border shadow-soft hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`size-10 rounded-xl ${task.iconColor} flex items-center justify-center shrink-0`}
                  >
                    <span className="material-symbols-outlined text-xl">{task.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground mb-1 truncate">{task.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{task.subtitle}</p>
                    <span
                      className={`inline-block px-2 py-1 ${task.badgeColor} text-xs font-bold rounded-lg`}
                    >
                      {task.badge}
                    </span>
                  </div>
                  <button className="size-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">{t("dashboard.quickActions")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-card rounded-2xl p-4 border border-border shadow-soft hover:shadow-md hover:border-primary/30 transition-all flex flex-col items-center text-center"
              >
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                </div>
                <span className="font-bold text-foreground text-sm">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Rights GPS Card */}
        <section>
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">explore</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">ה-GPS לזכויות שלך</h3>
                  <p className="text-white/80 text-sm">בוא נמצא עוד זכויות</p>
                </div>
              </div>
              <Link
                href="/rights-finder"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                חפש זכויות
                <span className="material-symbols-outlined">arrow_back</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
