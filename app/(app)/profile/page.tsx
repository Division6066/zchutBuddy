"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

export default function ProfilePage() {
  const { t } = useTranslation();

  // Mock user data - in production, this would come from Clerk/Convex
  const user = {
    name: "ישראל ישראלי",
    email: "israel@example.com",
    avatar: null,
    joinedAt: "דצמבר 2024",
    subscription: "פלוס",
  };

  const stats = [
    { label: "זכויות פעילות", value: "5" },
    { label: "רשימות משימות", value: "3" },
    { label: "מסמכים", value: "12" },
  ];

  const menuItems = [
    {
      icon: "person",
      label: t("profile.personalInfo"),
      href: "/profile/edit",
    },
    {
      icon: "notifications",
      label: t("profile.notifications"),
      href: "/profile/notifications",
    },
    {
      icon: "tune",
      label: t("profile.preferences"),
      href: "/profile/preferences",
    },
    {
      icon: "security",
      label: "אבטחה ופרטיות",
      href: "/profile/security",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-black text-foreground">{t("profile.title")}</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                  {user.subscription}
                </span>
                <span className="text-xs text-muted-foreground">
                  הצטרף ב{user.joinedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-4 p-4 hover:bg-accent transition-colors border-b border-border last:border-b-0"
            >
              <div className="size-10 rounded-xl bg-accent text-muted-foreground flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
              </div>
              <span className="flex-1 font-medium text-foreground">{item.label}</span>
              <span className="material-symbols-outlined text-muted-foreground">chevron_left</span>
            </Link>
          ))}
        </div>

        {/* Upgrade Banner */}
        <div className="mt-6 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">שדרג לתוכנית פרו</h3>
          <p className="text-white/80 text-sm mb-4">
            קבל גישה ליועץ אישי, עיבוד מואץ ותכונות נוספות
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            צפה בתוכניות
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
