"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGuestAuth } from "@/lib/guest-auth";
import { useToggleLocale, useTranslation } from "@/lib/i18n";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { logoutGuest, isGuest } = useGuestAuth();
  const { t, locale } = useTranslation();
  const toggleLocale = useToggleLocale();

  const navItems = [
    { href: "/dashboard", icon: "dashboard", label: t("nav.dashboard") },
    { href: "/rights-finder", icon: "search", label: t("nav.rightsFinder") },
    { href: "/checklists", icon: "checklist", label: t("nav.checklists") },
    { href: "/documents", icon: "folder", label: t("nav.documents") },
    { href: "/profile", icon: "person", label: t("nav.profile") },
    { href: "/settings", icon: "settings", label: t("nav.settings") },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-card border-e border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0 rtl:-translate-x-full rtl:md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 px-2">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">accessibility_new</span>
            </div>
            <span className="text-xl font-bold text-foreground">{t("common.appName")}</span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 pt-4 border-t border-border">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all w-full"
            >
              <span className="material-symbols-outlined text-xl">language</span>
              {locale === "en" ? "עברית" : "English"}
            </button>

            {/* Sign Out */}
            <button
              onClick={async () => {
                if (isGuest) {
                  logoutGuest();
                } else {
                  await signOut();
                }
                router.push("/");
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all w-full"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              {t("common.signOut")}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
