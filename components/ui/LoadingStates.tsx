"use client";

/**
 * Loading State Components
 *
 * A collection of loading indicators and skeleton components
 * for consistent loading UX throughout the application.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/* ==========================================================================
   Spinner Component
   ========================================================================== */

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerColor = "primary" | "white" | "gray" | "current";

interface SpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Color variant */
  color?: SpinnerColor;
  /** Additional class names */
  className?: string;
  /** Screen reader label */
  label?: string;
}

const spinnerSizes: Record<SpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const spinnerColors: Record<SpinnerColor, string> = {
  primary: "text-primary",
  white: "text-white",
  gray: "text-muted-foreground",
  current: "text-current",
};

export function Spinner({
  size = "md",
  color = "primary",
  className,
  label = "טוען...",
}: SpinnerProps) {
  return (
    <div role="status" aria-label={label} className={cn("inline-flex", className)}>
      <Loader2
        className={cn("animate-spin", spinnerSizes[size], spinnerColors[color])}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/* ==========================================================================
   Skeleton Component
   ========================================================================== */

type SkeletonShape = "text" | "circle" | "rectangle" | "card";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape of the skeleton */
  shape?: SkeletonShape;
  /** Width (can be tailwind class or value) */
  width?: string;
  /** Height (can be tailwind class or value) */
  height?: string;
  /** Animate the skeleton */
  animate?: boolean;
}

export function Skeleton({
  shape = "rectangle",
  width,
  height,
  animate = true,
  className,
  style,
  ...props
}: SkeletonProps) {
  const shapeClasses: Record<SkeletonShape, string> = {
    text: "h-4 rounded",
    circle: "rounded-full aspect-square",
    rectangle: "rounded-lg",
    card: "rounded-2xl h-48",
  };

  return (
    <div
      className={cn(
        "bg-muted",
        animate && "animate-pulse",
        shapeClasses[shape],
        width && (width.startsWith("w-") ? width : undefined),
        height && (height.startsWith("h-") ? height : undefined),
        className
      )}
      style={{
        width: width && !width.startsWith("w-") ? width : undefined,
        height: height && !height.startsWith("h-") ? height : undefined,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

/* ==========================================================================
   Skeleton Text Lines
   ========================================================================== */

interface SkeletonTextProps {
  /** Number of lines */
  lines?: number;
  /** Gap between lines */
  gap?: "sm" | "md" | "lg";
  /** Vary the last line width */
  lastLineWidth?: string;
  /** Additional class names */
  className?: string;
}

export function SkeletonText({
  lines = 3,
  gap = "sm",
  lastLineWidth = "w-2/3",
  className,
}: SkeletonTextProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  return (
    <div className={cn("flex flex-col", gapClasses[gap], className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          shape="text"
          className={cn(i === lines - 1 && lastLineWidth)}
        />
      ))}
    </div>
  );
}

/* ==========================================================================
   Page Loader Component
   ========================================================================== */

interface PageLoaderProps {
  /** Loading message */
  message?: string;
  /** Show progress percentage */
  progress?: number;
  /** Additional class names */
  className?: string;
}

export function PageLoader({ message, progress, className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Logo Animation */}
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Spinner size="lg" color="primary" />
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className="text-lg font-medium text-foreground mb-4">{message}</p>
      )}

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Button Loader Component
   ========================================================================== */

interface ButtonLoaderProps {
  /** Size matching button size */
  size?: "xs" | "sm" | "md" | "lg";
  /** Color variant */
  color?: SpinnerColor;
}

export function ButtonLoader({ size = "md", color = "current" }: ButtonLoaderProps) {
  const sizeMap: Record<string, SpinnerSize> = {
    xs: "xs",
    sm: "xs",
    md: "sm",
    lg: "md",
  };

  return <Spinner size={sizeMap[size]} color={color} label="פעולה מתבצעת..." />;
}

/* ==========================================================================
   Content Loader Component
   ========================================================================== */

interface ContentLoaderProps {
  /** Type of content to show skeleton for */
  type?: "card" | "list" | "text" | "avatar-text";
  /** Number of items */
  count?: number;
  /** Additional class names */
  className?: string;
}

export function ContentLoader({
  type = "text",
  count = 1,
  className,
}: ContentLoaderProps) {
  const renderItem = (index: number) => {
    switch (type) {
      case "card":
        return (
          <div key={index} className="space-y-4 p-4 border rounded-2xl">
            <Skeleton shape="rectangle" height="h-32" />
            <Skeleton shape="text" width="w-3/4" />
            <Skeleton shape="text" width="w-1/2" />
          </div>
        );

      case "list":
        return (
          <div key={index} className="flex items-center gap-4 p-3">
            <Skeleton shape="circle" width="w-10" height="h-10" />
            <div className="flex-1 space-y-2">
              <Skeleton shape="text" width="w-3/4" />
              <Skeleton shape="text" width="w-1/2" />
            </div>
          </div>
        );

      case "avatar-text":
        return (
          <div key={index} className="flex items-center gap-3">
            <Skeleton shape="circle" width="w-12" height="h-12" />
            <div className="space-y-2">
              <Skeleton shape="text" width="w-24" />
              <Skeleton shape="text" width="w-16" />
            </div>
          </div>
        );

      case "text":
      default:
        return <SkeletonText key={index} lines={3} />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => renderItem(i))}
    </div>
  );
}

/* ==========================================================================
   Chat Loader Component (Typing Indicator)
   ========================================================================== */

interface ChatLoaderProps {
  /** Show "AI is thinking" text */
  showText?: boolean;
  /** Custom text */
  text?: string;
  /** Additional class names */
  className?: string;
}

export function ChatLoader({
  showText = true,
  text = "AI חושב...",
  className,
}: ChatLoaderProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} role="status">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.6s",
            }}
          />
        ))}
      </div>
      {showText && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
      <span className="sr-only">{text}</span>
    </div>
  );
}

/* ==========================================================================
   Progress Bar Component
   ========================================================================== */

interface ProgressBarProps {
  /** Progress value (0-100) */
  value: number;
  /** Max value */
  max?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Color variant */
  color?: "primary" | "success" | "warning" | "error";
  /** Animate the progress */
  animated?: boolean;
  /** Additional class names */
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  color = "primary",
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full bg-muted rounded-full overflow-hidden",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full",
            colorClasses[color],
            animated && "transition-all duration-300 ease-out"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{value}</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Pulse Animation Component
   ========================================================================== */

interface PulseProps {
  children: React.ReactNode;
  /** Enable pulsing */
  active?: boolean;
  /** Additional class names */
  className?: string;
}

export function Pulse({ children, active = true, className }: PulseProps) {
  return (
    <div className={cn(active && "animate-pulse", className)}>
      {children}
    </div>
  );
}

/* ==========================================================================
   Inline Loader Component
   ========================================================================== */

interface InlineLoaderProps {
  /** Loading text */
  text?: string;
  /** Additional class names */
  className?: string;
}

export function InlineLoader({ text = "טוען", className }: InlineLoaderProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} role="status">
      <Spinner size="xs" color="current" />
      <span>{text}</span>
    </span>
  );
}

export default {
  Spinner,
  Skeleton,
  SkeletonText,
  PageLoader,
  ButtonLoader,
  ContentLoader,
  ChatLoader,
  ProgressBar,
  Pulse,
  InlineLoader,
};

