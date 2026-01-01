"use client";

import { useState, useEffect, useCallback } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { cn } from "@/lib/utils";

import MobileNav from "./MobileNav";
import TabletSidebar from "./TabletSidebar";
import DesktopSidebar from "./DesktopSidebar";

// ============================================================================
// Constants
// ============================================================================

const TABLET_SIDEBAR_STORAGE_KEY = "tabletSidebar_collapsed";
const TABLET_SIDEBAR_EVENT = "tabletSidebarToggle";
const TABLET_COLLAPSED_WIDTH = 64;
const TABLET_EXPANDED_WIDTH = 240;
const DESKTOP_WIDTH = 280;
const MOBILE_BOTTOM_NAV_HEIGHT = 60;

// ============================================================================
// Navigation Component
// ============================================================================

/**
 * Navigation component that renders the appropriate navigation based on device type.
 * Handles SSR by returning null until mounted.
 */
export function Navigation() {
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR or before hydration
  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return <MobileNav />;
  }

  if (isTablet) {
    return <TabletSidebar />;
  }

  if (isDesktop) {
    return <DesktopSidebar />;
  }

  // Fallback to desktop if device type is unclear
  return <DesktopSidebar />;
}

// ============================================================================
// MainLayout Component
// ============================================================================

export interface MainLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  className?: string;
}

/**
 * MainLayout component that combines Navigation with properly margined content area.
 * Handles responsive margins based on device type and tablet sidebar state.
 */
export function MainLayout({
  children,
  showNav = true,
  className,
}: MainLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const [mounted, setMounted] = useState(false);
  const [tabletCollapsed, setTabletCollapsed] = useState(true);

  // Initialize mounted state and read tablet collapsed state from localStorage
  useEffect(() => {
    setMounted(true);

    // Read initial collapsed state from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(TABLET_SIDEBAR_STORAGE_KEY);
      if (saved !== null) {
        setTabletCollapsed(saved === "true");
      }
    }
  }, []);

  // Listen for tablet sidebar toggle events
  const handleSidebarToggle = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<{ collapsed: boolean }>;
    setTabletCollapsed(customEvent.detail.collapsed);
  }, []);

  useEffect(() => {
    window.addEventListener(TABLET_SIDEBAR_EVENT, handleSidebarToggle);
    return () => {
      window.removeEventListener(TABLET_SIDEBAR_EVENT, handleSidebarToggle);
    };
  }, [handleSidebarToggle]);

  // Compute content margin classes based on device type
  const getContentMarginClass = (): string => {
    if (!mounted || !showNav) {
      return "";
    }

    if (isMobile) {
      // Bottom nav - add bottom margin
      return `mb-[${MOBILE_BOTTOM_NAV_HEIGHT}px]`;
    }

    if (isTablet) {
      // Sidebar - add start margin (respects RTL)
      const width = tabletCollapsed ? TABLET_COLLAPSED_WIDTH : TABLET_EXPANDED_WIDTH;
      return `ms-[${width}px]`;
    }

    if (isDesktop) {
      // Desktop sidebar - fixed width
      return `ms-[${DESKTOP_WIDTH}px]`;
    }

    // Fallback to desktop
    return `ms-[${DESKTOP_WIDTH}px]`;
  };

  // Use Tailwind arbitrary values directly for better compatibility
  const getMarginStyle = (): React.CSSProperties => {
    if (!mounted || !showNav) {
      return {};
    }

    if (isMobile) {
      return { marginBottom: MOBILE_BOTTOM_NAV_HEIGHT };
    }

    if (isTablet) {
      const width = tabletCollapsed ? TABLET_COLLAPSED_WIDTH : TABLET_EXPANDED_WIDTH;
      return { marginInlineStart: width };
    }

    if (isDesktop) {
      return { marginInlineStart: DESKTOP_WIDTH };
    }

    // Fallback
    return { marginInlineStart: DESKTOP_WIDTH };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - renders correct variant based on device */}
      {showNav && <Navigation />}

      {/* Main content area with responsive margins and padding */}
      <main
        className={cn(
          "min-h-screen transition-[margin] duration-300 ease-in-out",
          "p-4 md:p-6 lg:p-8",
          className
        )}
        style={getMarginStyle()}
      >
        {children}
      </main>
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default Navigation;

