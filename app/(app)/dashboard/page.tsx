"use client";

import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "@/lib/i18n";

// Skeleton loaders
function StatSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-soft animate-pulse">
      <div className="flex items-center gap-3 mb-2">
        <div className="size-10 rounded-xl bg-muted" />
      </div>
      <div className="h-6 w-12 bg-muted rounded mb-2" />
      <div className="h-3 w-20 bg-muted rounded" />
    </div>
  );
}

function AlertSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-soft animate-pulse">
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-xl bg-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="h-3 w-32 bg-muted rounded mb-2" />
          <div className="h-2 w-16 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  // Fetch user data
  const currentUser = useQuery(api.users.getCurrentUser);
  const subscription = useQuery(api.users.getUserSubscription);
  const alerts = useQuery(api.users.getUserAlerts, { unreadOnly: false });

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || currentUser === undefined) {
    return (
      <div className="relative min-h-full">
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-14 rounded-2xl bg-primary animate-pulse" />
              <div>
                <div className="h-6 w-32 bg-muted rounded mb-2" />
                <div className="h-3 w-40 bg-muted rounded" />
              </div>
            </div>
          </div>

          <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <StatSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Calculate trial days remaining
  const trialDaysRemaining =
    subscription && subscription.status === "trialing" && subscription.trialEndsAt
      ? Math.max(0, Math.ceil((subscription.trialEndsAt - Date.now()) / (24 * 60 * 60 * 1000)))
      : null;

  const tierColors: Record<string, { bg: string; text: string }> = {
    free_trial: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" },
    plus: { bg: "bg-green-100 dark:bg-green-950", text: "text-green-700 dark:text-green-300" },
    pro: { bg: "bg-purple-100 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-300" },
    max: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300" },
  };

  const tierNames: Record<string, string> = {
    free_trial: "ניסיון חינמי",
    plus: "פלוס",
    pro: "פרו",
    max: "מקס",
  };

  const currentTier = subscription?.tier || "free_trial";
  const tierColor = tierColors[currentTier] || tierColors.free_trial;
  const tierName = tierNames[currentTier] || "ניסיון";

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
                {t("dashboard.greeting")}, {currentUser?.name || "ישראל"}
              </h1>
              <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
            </div>
          </div>

          {/* Subscription Status Badge */}
          {subscription && (
            <div className="flex items-center gap-4 flex-wrap">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${tierColor.bg} ${tierColor.text} text-sm font-bold`}
              >
                <span className="material-symbols-outlined text-base">verified</span>
                {tierName}
              </div>
              {trialDaysRemaining !== null && trialDaysRemaining > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent text-accent-foreground text-sm font-bold">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  {trialDaysRemaining} ימים נותרים
                </div>
              )}
              {trialDaysRemaining === 0 && subscription.status === "trialing" && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-error-bg text-error text-sm font-bold">
                  <span className="material-symbols-outlined text-base">warning</span>
                  תקופה עתידה להסתיים
                </div>
              )}
            </div>
          )}
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

        {/* Alerts Section */}
        {alerts && alerts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">הודעות חשובות</h2>
              {alerts.filter((a) => !a.isRead).length > 0 && (
                <span className="inline-flex items-center justify-center size-6 rounded-full bg-error text-white text-xs font-bold">
                  {alerts.filter((a) => !a.isRead).length}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => {
                const priorityColors: Record<string, string> = {
                  urgent: "bg-error-bg border-error",
                  high: "bg-warning-bg border-warning",
                  medium: "bg-info-bg border-info",
                  low: "bg-accent border-border",
                };

                return (
                  <div
                    key={alert._id}
                    className={`bg-card rounded-2xl p-4 border-l-4 shadow-soft hover:shadow-md transition-shadow ${
                      priorityColors[alert.priority] || priorityColors.low
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground">{alert.title}</h3>
                          {!alert.isRead && (
                            <span className="size-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        {alert.actionUrl && (
                          <Link
                            href={alert.actionUrl}
                            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition"
                          >
                            {alert.actionLabel || "צפייה"}
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {alerts.length > 3 && (
                <Link
                  href="/alerts"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-bold mt-2"
                >
                  צפייה בכל ההודעות
                  <span className="material-symbols-outlined">arrow_back</span>
                </Link>
              )}
            </div>
          </section>
        )}

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
