"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: "/dashboard", icon: "home", label: t("nav.home") },
    { href: "/rights-finder", icon: "search", label: t("common.search") },
    { href: "/checklists", icon: "checklist", label: t("nav.checklists") },
    { href: "/profile", icon: "person", label: t("nav.profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 pb-6 z-40 md:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              <span className={`text-xs ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

