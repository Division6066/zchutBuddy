"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";

import { useDeviceType } from "@/hooks/useDeviceType";
import { useGuestAuth } from "@/lib/guest-auth";
import { useDir, useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// ============================================================================
// Constants
// ============================================================================

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 240;
const STORAGE_KEY = "tabletSidebar_collapsed";
const SIDEBAR_TOGGLE_EVENT = "tabletSidebarToggle";

// Navigation items configuration
const NAV_ITEMS = [
  { id: "home", href: "/dashboard", icon: Home, labelKey: "nav.home" },
  { id: "rights", href: "/rights-finder", icon: Search, labelKey: "nav.rights" },
  { id: "chat", href: "/chat", icon: MessageSquare, labelKey: "nav.chat" },
  { id: "alerts", href: "/alerts", icon: Bell, labelKey: "nav.alerts", hasBadge: true },
  { id: "profile", href: "/profile", icon: User, labelKey: "nav.profile" },
  { id: "settings", href: "/settings", icon: Settings, labelKey: "nav.settings" },
  { id: "help", href: "/help", icon: HelpCircle, labelKey: "nav.help" },
];

// ============================================================================
// Component
// ============================================================================

export default function TabletSidebar() {
  const { isTablet } = useDeviceType();
  const pathname = usePathname();
  const router = useRouter();
  const dir = useDir();
  const { t } = useTranslation();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { logoutGuest, isGuest } = useGuestAuth();

  // Determine if we should run authenticated queries
  const shouldRunAuthQueries = !authLoading && isAuthenticated;

  // Convex queries - skip unless user is fully authenticated with Convex Auth
  const unreadCount = useQuery(api.alerts.getUnreadCount, shouldRunAuthQueries ? {} : "skip");
  const usageSummary = useQuery(
    api.usageTracking.getUsageSummary,
    shouldRunAuthQueries ? {} : "skip"
  );

  // Collapsed state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  // Save collapsed state to localStorage and emit event for MainLayout sync
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(STORAGE_KEY, String(newState));

    // Dispatch custom event so MainLayout can update its margin
    window.dispatchEvent(
      new CustomEvent(SIDEBAR_TOGGLE_EVENT, {
        detail: { collapsed: newState },
      })
    );
  };

  // Handle logout
  const handleLogout = async () => {
    if (isGuest) {
      logoutGuest();
    } else {
      await signOut();
    }
    router.push("/");
  };

  // Don't render on non-tablet devices or before mount
  if (!mounted || !isTablet) {
    return null;
  }

  const isRTL = dir === "rtl";
  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  // Chevron icon logic based on RTL and collapsed state
  const ChevronIcon = isRTL
    ? isCollapsed
      ? ChevronLeft
      : ChevronRight
    : isCollapsed
      ? ChevronRight
      : ChevronLeft;

  // Calculate usage percentage
  const usagePercent = usageSummary?.apiUsagePercent || 0;
  const tierName = usageSummary?.tierNameHe || usageSummary?.tierName || "Free";
  const isMaxTier = usageSummary?.tier === "max";

  return (
    <>
      {/* Fixed sidebar - MainLayout handles content offset */}
      <motion.aside
        dir={dir}
        className={cn(
          "hidden md:flex lg:hidden fixed top-0 bottom-0 z-40",
          "flex-col bg-card border-e border-border",
          isRTL ? "right-0" : "left-0"
        )}
        initial={false}
        animate={{ width: currentWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Toggle button */}
        <button
          onClick={toggleCollapsed}
          className={cn(
            "absolute top-4 z-50 size-8 rounded-full",
            "bg-primary text-primary-foreground shadow-lg",
            "flex items-center justify-center",
            "hover:bg-primary/90 transition-colors",
            isRTL ? "-left-4" : "-right-4"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronIcon className="size-4" />
        </button>

        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">accessibility_new</span>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold text-foreground whitespace-nowrap overflow-hidden"
                >
                  {t("common.appName")}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <motion.ul className="space-y-1">
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              const showBadge = item.hasBadge && unreadCount !== undefined && unreadCount > 0;

              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative",
                      isCollapsed ? "justify-center" : "",
                      isActive
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    title={isCollapsed ? t(item.labelKey) : undefined}
                  >
                    <div className="relative shrink-0">
                      <Icon className="size-5" />
                      {/* Badge */}
                      <AnimatePresence>
                        {showBadge && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={cn(
                              "absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px]",
                              "flex items-center justify-center",
                              "bg-red-500 text-white text-[10px] font-bold rounded-full px-1"
                            )}
                          >
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {t(item.labelKey)}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* Bottom section */}
        <div className="p-2 border-t border-border space-y-2">
          {/* Usage meter */}
          {usageSummary && (
            <div
              className={cn(
                "p-2 rounded-xl bg-accent/50",
                isCollapsed ? "flex justify-center" : ""
              )}
              title={isCollapsed ? `${usagePercent}% ${t("common.loading")}` : undefined}
            >
              {isCollapsed ? (
                <div className="relative size-8">
                  <svg className="size-8 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.2"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeDasharray={`${usagePercent}, 100`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
                    {usagePercent}%
                  </span>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{tierName}</span>
                    <span className="font-medium">{usagePercent}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        usagePercent >= 60
                          ? "bg-red-500"
                          : usagePercent >= 40
                            ? "bg-amber-500"
                            : "bg-primary"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(usagePercent, 100)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Upgrade button */}
          {!isMaxTier && (
            <Link
              href="/pricing"
              className={cn(
                "flex items-center gap-2 rounded-xl transition-all",
                "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
                "hover:from-primary/90 hover:to-primary/70",
                isCollapsed ? "justify-center p-2" : "px-3 py-2"
              )}
              title={isCollapsed ? t("pricing.upgrade") : undefined}
            >
              <Sparkles className="size-4 shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {t("pricing.upgrade") || "Upgrade"}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-2 w-full rounded-xl transition-all",
              "text-muted-foreground hover:bg-accent hover:text-foreground",
              isCollapsed ? "justify-center p-2" : "px-3 py-2"
            )}
            title={isCollapsed ? t("common.signOut") : undefined}
          >
            <LogOut className="size-4 shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm whitespace-nowrap overflow-hidden"
                >
                  {t("common.signOut")}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
