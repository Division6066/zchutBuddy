"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { Bell, Home, MessageSquare, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useDir, useTranslations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  key: "home" | "rights" | "chat" | "alerts" | "profile";
  Icon: typeof Home;
};

const ACTIVE_COLOR_CLASS = "text-[#0d968b]";
const INACTIVE_COLOR_CLASS = "text-gray-500";

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", key: "home", Icon: Home },
  { href: "/rights-finder", key: "rights", Icon: Search },
  { href: "/chat", key: "chat", Icon: MessageSquare },
  { href: "/alerts", key: "alerts", Icon: Bell },
  { href: "/profile", key: "profile", Icon: User },
];

export interface MobileNavProps {
  className?: string;
}

export default function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();
  const { isMobile } = useDeviceType();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const dir = useDir();
  const tNav = useTranslations("nav");

  // Determine if we should run authenticated queries
  const shouldRunAuthQueries = !authLoading && isAuthenticated;

  // Skip Convex query unless user is fully authenticated with Convex Auth
  const unreadCount = useQuery(api.alerts.getUnreadCount, shouldRunAuthQueries ? {} : "skip");
  const alertsCount = typeof unreadCount === "number" ? unreadCount : 0;

  return (
    <nav
      dir={dir}
      aria-label="Mobile navigation"
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 md:hidden",
        "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        "border-t border-gray-200",
        // Safe area + minimum height
        "pb-[env(safe-area-inset-bottom)] min-h-[calc(60px+env(safe-area-inset-bottom))]",
        className
      )}
      data-device-mobile={isMobile ? "true" : "false"}
    >
      <div
        className={cn(
          "mx-auto max-w-md",
          "flex items-stretch justify-between",
          // Mirror ordering in RTL without changing icon direction
          dir === "rtl" ? "flex-row-reverse" : "flex-row"
        )}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          const isAlertsTab = item.key === "alerts";

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center",
                "py-2",
                "transition-colors duration-200",
                isActive ? ACTIVE_COLOR_CLASS : INACTIVE_COLOR_CLASS
              )}
            >
              <span className="relative">
                <item.Icon
                  aria-hidden="true"
                  size={isActive ? 26 : 24}
                  className={cn(
                    "transition-transform duration-200",
                    isActive ? "scale-[1.02]" : "scale-100"
                  )}
                />

                {isAlertsTab && (
                  <span
                    className={cn(
                      "absolute -top-1 -end-1",
                      "min-w-4 h-4 px-1",
                      "rounded-full bg-red-500 text-white",
                      "text-[10px] leading-4 text-center font-bold",
                      "transition-all duration-200",
                      alertsCount > 0
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75 pointer-events-none"
                    )}
                    aria-label={alertsCount > 0 ? `${alertsCount} unread notifications` : undefined}
                  >
                    {alertsCount > 99 ? "99+" : alertsCount}
                  </span>
                )}
              </span>

              <span className="mt-1 text-xs leading-none">
                {item.key === "home" && tNav("home")}
                {item.key === "rights" && tNav("rights")}
                {item.key === "chat" && tNav("chat")}
                {item.key === "alerts" && tNav("alerts")}
                {item.key === "profile" && tNav("profile")}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
