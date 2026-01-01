"use client";

import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  Bell,
  BookMarked,
  CheckSquare,
  ExternalLink,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useGuestAuth } from "@/lib/guest-auth";
import { useDir, useToggleLocale, useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// ============================================================================
// Constants
// ============================================================================

const SIDEBAR_WIDTH = 280;

// Navigation sections configuration
const NAV_SECTIONS = {
  main: [
    { id: "dashboard", href: "/dashboard", icon: Home, labelKey: "nav.dashboard" },
    { id: "rights-finder", href: "/rights-finder", icon: Search, labelKey: "nav.rightsFinder" },
    { id: "chat", href: "/chat", icon: MessageSquare, labelKey: "nav.chat" },
  ],
  features: [
    { id: "deep-research", href: "/deep-research", icon: Sparkles, labelKey: "nav.deepResearch" },
    { id: "saved-rights", href: "/saved-rights", icon: BookMarked, labelKey: "nav.savedRights" },
    { id: "checklists", href: "/checklists", icon: CheckSquare, labelKey: "nav.checklists" },
  ],
  account: [
    { id: "alerts", href: "/alerts", icon: Bell, labelKey: "nav.alerts", hasBadge: true },
    { id: "profile", href: "/profile", icon: User, labelKey: "nav.profile" },
    { id: "settings", href: "/settings", icon: Settings, labelKey: "nav.settings" },
  ],
};

// ============================================================================
// Helper Components
// ============================================================================

interface NavItemProps {
  href: string;
  icon: typeof Home;
  label: string;
  isActive: boolean;
  badge?: number;
}

function NavItem({ href, icon: Icon, label, isActive, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isActive
          ? "bg-[#0d968b]/10 text-[#0d968b] font-semibold"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <div className="relative shrink-0">
        <Icon
          className={cn("size-5 transition-transform group-hover:scale-105")}
          fill={isActive ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={isActive ? 1.5 : 2}
        />
        {badge !== undefined && badge > 0 && (
          <span
            className={cn(
              "absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px]",
              "flex items-center justify-center",
              "bg-red-500 text-white text-[10px] font-bold rounded-full px-1",
              "animate-in zoom-in-50 duration-200"
            )}
          >
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
      <span className="truncate">{label}</span>
    </Link>
  );
}

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
}

function NavSection({ title, children }: NavSectionProps) {
  return (
    <div className="space-y-1">
      <h3 className="px-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dir = useDir();
  const { t, locale } = useTranslation();
  const toggleLocale = useToggleLocale();
  const { signOut: clerkSignOut } = useClerk();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user } = useUser();
  const { logoutGuest, isGuest } = useGuestAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we should run authenticated queries
  const shouldRunAuthQueries = authLoaded && isSignedIn === true;

  // Convex queries - skip unless user is fully authenticated with Clerk
  const unreadCount = useQuery(api.alerts.getUnreadCount, shouldRunAuthQueries ? {} : "skip");
  const usageSummary = useQuery(
    api.usageTracking.getUsageSummary,
    shouldRunAuthQueries ? {} : "skip"
  );
  const subscription = useQuery(
    api.subscriptions.getMySubscription,
    shouldRunAuthQueries ? {} : "skip"
  );

  // Don't render before mount (SSR safety)
  if (!mounted) {
    return null;
  }

  const isRTL = dir === "rtl";

  // User display info
  const displayName =
    user?.firstName || user?.fullName || (isGuest ? t("common.guest") : t("common.user"));
  const avatarUrl = user?.imageUrl;

  // Usage calculations
  const usagePercent = usageSummary?.apiUsagePercent ?? 0;
  const creditsUsed = usageSummary?.apiCreditsUsed ?? 0;
  const creditsLimit = usageSummary?.apiCreditsLimit ?? 0;
  const creditsRemaining = Math.max(0, creditsLimit - creditsUsed);

  // Tier info
  const tierName =
    locale === "he"
      ? usageSummary?.tierNameHe || subscription?.tier || t("sidebar.freeTrial")
      : usageSummary?.tierName || subscription?.tier || t("sidebar.freeTrial");
  const isMaxTier = usageSummary?.tier === "max" || subscription?.tier === "max";

  // Handle logout
  const handleLogout = () => {
    if (isGuest) {
      logoutGuest();
    } else {
      clerkSignOut();
    }
    router.push("/");
  };

  // App version
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";

  return (
    <>
      {/* Fixed sidebar - MainLayout handles content offset */}
      <aside
        dir={dir}
        className={cn(
          "hidden lg:flex fixed top-0 bottom-0 z-40",
          "flex-col bg-card",
          isRTL ? "right-0 border-s border-border" : "left-0 border-e border-border"
        )}
        style={{ width: SIDEBAR_WIDTH }}
      >
        {/* Header: Logo + Language Toggle */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="size-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">accessibility_new</span>
              </div>
              <span className="text-lg font-bold text-foreground">{t("common.appName")}</span>
            </Link>
            <button
              onClick={toggleLocale}
              className={cn(
                "px-2 py-1 rounded-lg text-xs font-medium",
                "bg-accent text-muted-foreground hover:text-foreground",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label={locale === "en" ? "Switch to Hebrew" : "Switch to English"}
            >
              {locale === "en" ? "עב" : "EN"}
            </button>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-b border-border">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 p-2 -m-2 rounded-xl",
              "hover:bg-accent transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            {/* Avatar */}
            <div className="size-10 shrink-0 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-5 text-primary" />
              )}
            </div>
            {/* Name + Tier */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                  isMaxTier
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-primary/10 text-primary"
                )}
              >
                {tierName}
              </span>
            </div>
            <ExternalLink className="size-4 text-muted-foreground shrink-0" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-4">
          {/* Main Section */}
          <NavSection title={t("sidebar.main")}>
            {NAV_SECTIONS.main.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <NavItem
                  key={item.id}
                  href={item.href}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  isActive={isActive}
                />
              );
            })}
          </NavSection>

          {/* Features Section */}
          <NavSection title={t("sidebar.features")}>
            {NAV_SECTIONS.features.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <NavItem
                  key={item.id}
                  href={item.href}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  isActive={isActive}
                />
              );
            })}
          </NavSection>

          {/* Account Section */}
          <NavSection title={t("sidebar.account")}>
            {NAV_SECTIONS.account.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const badge = item.hasBadge ? (unreadCount ?? 0) : undefined;
              return (
                <NavItem
                  key={item.id}
                  href={item.href}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  isActive={isActive}
                  badge={badge}
                />
              );
            })}
          </NavSection>
        </nav>

        {/* Usage Section */}
        <div className="p-4 border-t border-border space-y-3">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t("sidebar.monthlyUsage")}</span>
              <span className="font-medium text-foreground">{usagePercent}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={usagePercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t("sidebar.monthlyUsage")}
              className="h-2 bg-accent rounded-full overflow-hidden"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  usagePercent >= 90
                    ? "bg-red-500"
                    : usagePercent >= 70
                      ? "bg-amber-500"
                      : "bg-[#0d968b]"
                )}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Credits remaining */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t("sidebar.creditsRemaining")}</span>
            <span className="font-medium text-foreground">₪{creditsRemaining.toFixed(2)}</span>
          </div>

          {/* Upgrade CTA */}
          {!isMaxTier && (
            <Link
              href="/pricing"
              className={cn(
                "flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl",
                "bg-gradient-to-r from-[#0d968b] to-teal-600 text-white font-medium text-sm",
                "hover:opacity-90 transition-opacity",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
            >
              <Sparkles className="size-4" />
              {t("sidebar.upgrade")}
            </Link>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-border space-y-1">
          {/* Help & Support */}
          <Link
            href="/contact"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-sm",
              "text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            <HelpCircle className="size-4" />
            {t("sidebar.helpSupport")}
          </Link>

          {/* Terms & Privacy */}
          <div className="flex items-center gap-2 px-3 py-1">
            <Link
              href="/terms"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground transition-colors",
                "focus-visible:outline-none focus-visible:underline"
              )}
            >
              {t("sidebar.terms")}
            </Link>
            <span className="text-muted-foreground/50">·</span>
            <Link
              href="/privacy"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground transition-colors",
                "focus-visible:outline-none focus-visible:underline"
              )}
            >
              {t("sidebar.privacy")}
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-sm w-full",
              "text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            <LogOut className="size-4" />
            {t("sidebar.logout")}
          </button>

          {/* Version */}
          <div className="px-3 py-1">
            <span className="text-[10px] text-muted-foreground/50">
              {t("sidebar.version")} {appVersion}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
