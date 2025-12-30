"use client";

import { useState } from "react";
import { useTranslation, useToggleLocale } from "@/lib/i18n";
import Link from "next/link";

export default function SettingsPage() {
  const { t, locale } = useTranslation();
  const toggleLocale = useToggleLocale();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  const settingsSections = [
    {
      title: t("settings.account"),
      items: [
        {
          icon: "person",
          label: "פרטים אישיים",
          href: "/profile/edit",
          type: "link" as const,
        },
        {
          icon: "lock",
          label: "שינוי סיסמה",
          href: "/profile/security",
          type: "link" as const,
        },
        {
          icon: "credit_card",
          label: "מנוי ותשלום",
          href: "/profile/subscription",
          type: "link" as const,
        },
      ],
    },
    {
      title: t("profile.preferences"),
      items: [
        {
          icon: "language",
          label: t("profile.language"),
          value: locale === "he" ? "עברית" : "English",
          onClick: toggleLocale,
          type: "button" as const,
        },
        {
          icon: "dark_mode",
          label: "מצב תצוגה",
          value: "אוטומטי",
          type: "button" as const,
        },
      ],
    },
    {
      title: t("profile.notifications"),
      items: [
        {
          icon: "mail",
          label: "התראות אימייל",
          checked: notifications.email,
          onChange: () => setNotifications((prev) => ({ ...prev, email: !prev.email })),
          type: "toggle" as const,
        },
        {
          icon: "notifications",
          label: "התראות Push",
          checked: notifications.push,
          onChange: () => setNotifications((prev) => ({ ...prev, push: !prev.push })),
          type: "toggle" as const,
        },
        {
          icon: "calendar_month",
          label: "סיכום שבועי",
          checked: notifications.weekly,
          onChange: () => setNotifications((prev) => ({ ...prev, weekly: !prev.weekly })),
          type: "toggle" as const,
        },
      ],
    },
    {
      title: t("settings.help"),
      items: [
        {
          icon: "help",
          label: "מרכז עזרה",
          href: "/help",
          type: "link" as const,
        },
        {
          icon: "chat",
          label: "צור קשר",
          href: "/contact",
          type: "link" as const,
        },
        {
          icon: "bug_report",
          label: "דווח על בעיה",
          href: "/report",
          type: "link" as const,
        },
      ],
    },
    {
      title: t("settings.about"),
      items: [
        {
          icon: "info",
          label: "אודות האפליקציה",
          href: "/about",
          type: "link" as const,
        },
        {
          icon: "description",
          label: "תנאי שימוש",
          href: "/terms",
          type: "link" as const,
        },
        {
          icon: "privacy_tip",
          label: "מדיניות פרטיות",
          href: "/privacy",
          type: "link" as const,
        },
      ],
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-black text-foreground">{t("settings.title")}</h1>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                {section.title}
              </h2>
              <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
                {section.items.map((item, itemIndex) => {
                  if (item.type === "link") {
                    return (
                      <Link
                        key={itemIndex}
                        href={item.href!}
                        className="flex items-center gap-4 p-4 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                      >
                        <div className="size-10 rounded-xl bg-accent text-muted-foreground flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        </div>
                        <span className="flex-1 font-medium text-foreground">{item.label}</span>
                        <span className="material-symbols-outlined text-muted-foreground">
                          chevron_left
                        </span>
                      </Link>
                    );
                  }

                  if (item.type === "button") {
                    return (
                      <button
                        key={itemIndex}
                        onClick={item.onClick}
                        className="flex items-center gap-4 p-4 hover:bg-accent transition-colors border-b border-border last:border-b-0 w-full"
                      >
                        <div className="size-10 rounded-xl bg-accent text-muted-foreground flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        </div>
                        <span className="flex-1 font-medium text-foreground text-start">
                          {item.label}
                        </span>
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                        <span className="material-symbols-outlined text-muted-foreground">
                          chevron_left
                        </span>
                      </button>
                    );
                  }

                  if (item.type === "toggle") {
                    return (
                      <div
                        key={itemIndex}
                        className="flex items-center gap-4 p-4 border-b border-border last:border-b-0"
                      >
                        <div className="size-10 rounded-xl bg-accent text-muted-foreground flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        </div>
                        <span className="flex-1 font-medium text-foreground">{item.label}</span>
                        <button
                          onClick={item.onChange}
                          className={`relative w-12 h-7 rounded-full transition-colors ${
                            item.checked ? "bg-primary" : "bg-accent"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                              item.checked ? "start-6" : "start-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="mt-8">
          <button className="w-full h-12 rounded-xl bg-error-bg text-error font-bold hover:bg-error/20 transition-colors">
            {t("common.signOut")}
          </button>
        </div>

        {/* App Version */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          גרסה 1.0.0
        </p>
      </div>
    </div>
  );
}
