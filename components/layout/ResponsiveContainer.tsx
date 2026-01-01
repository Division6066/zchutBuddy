"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface ResponsiveContainerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode;
  /** Sidebar slot - used when tabletLayout="sidebar" or desktopLayout="sidebar-wide" */
  sidebar?: ReactNode;
  /** Main content slot - used when tabletLayout="sidebar" or desktopLayout="sidebar-wide" */
  main?: ReactNode;
  mobileLayout?: "stack" | "scroll-x";
  tabletLayout?: "grid-2" | "sidebar";
  desktopLayout?: "grid-3" | "sidebar-wide";
  noPadding?: boolean;
}

export interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  mobileCols?: 1 | 2;
  tabletCols?: 2 | 3;
  desktopCols?: 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export interface ResponsiveStackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Breakpoint at which stack switches from vertical to horizontal */
  breakpoint?: "sm" | "md" | "lg";
  /** Gap between items */
  gap?: "sm" | "md" | "lg";
}

export interface HideOnProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Hide on mobile (< 768px) */
  mobile?: boolean;
  /** Hide on tablet (768px - 1023px) */
  tablet?: boolean;
  /** Hide on desktop (>= 1024px) */
  desktop?: boolean;
}

export interface ShowOnProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Show only on mobile (< 768px) */
  mobile?: boolean;
  /** Show only on tablet (768px - 1023px) */
  tablet?: boolean;
  /** Show only on desktop (>= 1024px) */
  desktop?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const GAP_MAP = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
} as const;

const MOBILE_COLS_MAP = {
  1: "grid-cols-1",
  2: "grid-cols-2",
} as const;

const TABLET_COLS_MAP = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
} as const;

const DESKTOP_COLS_MAP = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
} as const;

// ============================================================================
// ResponsiveContainer
// ============================================================================

export function ResponsiveContainer({
  children,
  sidebar,
  main,
  mobileLayout,
  tabletLayout,
  desktopLayout,
  noPadding = false,
  className,
  ...props
}: ResponsiveContainerProps) {
  // Determine if we're using sidebar layout
  const usesSidebarLayout =
    tabletLayout === "sidebar" || desktopLayout === "sidebar-wide";

  // Base container classes with responsive max-width and padding
  const baseClasses = cn(
    "w-full mx-auto",
    // Padding - uses symmetric padding (RTL-safe)
    noPadding ? "px-0 md:px-0 lg:px-0" : "px-4 md:px-6 lg:px-8",
    // Max-width per breakpoint
    "md:max-w-3xl lg:max-w-7xl"
  );

  // Mobile layout classes
  const mobileClasses = cn({
    "flex flex-col": mobileLayout === "stack",
    "flex overflow-x-auto snap-x snap-mandatory gap-4":
      mobileLayout === "scroll-x",
  });

  // Tablet layout classes
  const tabletClasses = cn({
    "md:grid md:grid-cols-2 md:gap-4": tabletLayout === "grid-2",
    "md:grid md:grid-cols-[minmax(0,18rem)_1fr] md:gap-6":
      tabletLayout === "sidebar",
  });

  // Desktop layout classes
  const desktopClasses = cn({
    "lg:grid lg:grid-cols-3 lg:gap-6": desktopLayout === "grid-3",
    "lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-8":
      desktopLayout === "sidebar-wide",
  });

  // Render sidebar layout if sidebar/main slots are provided
  if (usesSidebarLayout && sidebar && main) {
    return (
      <div
        className={cn(
          baseClasses,
          // On mobile, stack vertically
          "flex flex-col gap-4",
          tabletClasses,
          desktopClasses,
          className
        )}
        {...props}
      >
        <aside className="min-w-0">{sidebar}</aside>
        <main className="min-w-0">{main}</main>
      </div>
    );
  }

  // Default rendering with children
  return (
    <div
      className={cn(
        baseClasses,
        mobileClasses,
        tabletClasses,
        desktopClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// ResponsiveGrid
// ============================================================================

export function ResponsiveGrid({
  children,
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  gap = "md",
  className,
  ...props
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        "grid",
        MOBILE_COLS_MAP[mobileCols],
        TABLET_COLS_MAP[tabletCols],
        DESKTOP_COLS_MAP[desktopCols],
        GAP_MAP[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// ResponsiveStack
// ============================================================================

export function ResponsiveStack({
  children,
  breakpoint = "md",
  gap = "md",
  className,
  ...props
}: ResponsiveStackProps) {
  // Breakpoint-specific horizontal class
  const horizontalClass = {
    sm: "sm:flex-row",
    md: "md:flex-row",
    lg: "lg:flex-row",
  }[breakpoint];

  return (
    <div
      className={cn("flex flex-col", horizontalClass, GAP_MAP[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// HideOn
// ============================================================================

export function HideOn({
  children,
  mobile = false,
  tablet = false,
  desktop = false,
  className,
  ...props
}: HideOnProps) {
  // Build visibility classes based on breakpoints to hide
  // mobile: < 768px (default visible, hidden if mobile=true)
  // tablet: 768px - 1023px (md: visible, hidden if tablet=true)
  // desktop: >= 1024px (lg: visible, hidden if desktop=true)

  const visibilityClasses = cn(
    // Mobile: hide by default if mobile=true, then show at md if not tablet hidden
    mobile && "hidden",
    mobile && !tablet && "md:block",
    // Tablet: hide at md if tablet=true
    tablet && "md:hidden",
    tablet && !desktop && "lg:block",
    // Desktop: hide at lg if desktop=true
    desktop && "lg:hidden"
  );

  return (
    <div className={cn(visibilityClasses, className)} {...props}>
      {children}
    </div>
  );
}

// ============================================================================
// ShowOn
// ============================================================================

export function ShowOn({
  children,
  mobile = false,
  tablet = false,
  desktop = false,
  className,
  ...props
}: ShowOnProps) {
  // If no flags are set, show always
  const noFlagsSet = !mobile && !tablet && !desktop;

  if (noFlagsSet) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  // Build visibility classes to show only on specified breakpoints
  // Start hidden, then show only on specified breakpoints
  const visibilityClasses = cn(
    // Start hidden if not showing on mobile
    !mobile && "hidden",
    // Show on mobile if mobile=true (default block)
    mobile && "block",
    // At md breakpoint
    mobile && !tablet && "md:hidden", // Was showing, now hide
    !mobile && tablet && "md:block", // Was hidden, now show
    tablet && !desktop && "lg:hidden", // Was showing at md, now hide at lg
    // At lg breakpoint
    !mobile && !tablet && desktop && "lg:block", // Was hidden, now show
    (mobile || tablet) && !desktop && "lg:hidden" // Was showing, now hide
  );

  return (
    <div className={cn(visibilityClasses, className)} {...props}>
      {children}
    </div>
  );
}

// ============================================================================
// Default export (optional - for convenience)
// ============================================================================

export default ResponsiveContainer;

