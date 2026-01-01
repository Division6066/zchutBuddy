"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  high: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const priorityLabels = {
  low: "נמוכה",
  medium: "בינונית",
  high: "גבוהה",
  urgent: "דחוף",
};

type AlertPriority = keyof typeof priorityColors;

export function AlertsPanel() {
  const alerts = useQuery(api.alerts.getMyAlerts, { limit: 10 });
  const unreadCount = useQuery(api.alerts.getUnreadCount);
  const markAsRead = useMutation(api.alerts.markAsRead);
  const dismissAlert = useMutation(api.alerts.dismissAlert);
  const markAllAsRead = useMutation(api.alerts.markAllAsRead);

  const handleDismiss = async (alertId: Id<"alerts">) => {
    await dismissAlert({ alertId });
  };

  const handleRead = async (alertId: Id<"alerts">) => {
    await markAsRead({ alertId });
  };

  if (alerts === undefined) {
    return <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse h-64" />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm" dir="rtl">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">🔔 התראות</h2>
          {unreadCount !== undefined && unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount !== undefined && unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead({})}
            className="text-sm text-primary hover:underline transition-colors"
          >
            סמן הכל כנקרא
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">אין התראות חדשות</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              onClick={() => !alert.isRead && handleRead(alert._id)}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer
                         ${!alert.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${priorityColors[alert.priority as AlertPriority]}`}
                    >
                      {priorityLabels[alert.priority as AlertPriority]}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(alert.createdAt).toLocaleDateString("he-IL")}
                    </span>
                    {!alert.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full" title="לא נקראה" />
                    )}
                  </div>

                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {alert.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {alert.message}
                  </p>

                  {alert.actionUrl && (
                    <Link
                      href={alert.actionUrl}
                      className="inline-block mt-2 text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {alert.actionLabel || "פעולה"}
                    </Link>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss(alert._id);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 
                             transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="סגור"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
