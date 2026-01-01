"use client";

/**
 * Page Transition Component
 *
 * Provides smooth animated transitions between page changes using Framer Motion.
 * Respects user's reduced motion preferences.
 */

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type TransitionVariant = "fade" | "slide" | "slideUp" | "scale" | "none";

interface PageTransitionProps {
  children: React.ReactNode;
  /** Animation variant to use */
  variant?: TransitionVariant;
  /** Animation duration in seconds */
  duration?: number;
  /** Custom class name for the container */
  className?: string;
  /** Disable transitions entirely */
  disabled?: boolean;
}

/**
 * Animation variants for different transition types
 */
const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

/**
 * RTL-aware slide variant
 */
const getSlideVariant = (isRtl: boolean) => ({
  initial: { opacity: 0, x: isRtl ? -20 : 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: isRtl ? 20 : -20 },
});

/**
 * Custom easing function for smooth transitions
 */
const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * Check if user prefers reduced motion
 */
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Check if document direction is RTL
 */
function useIsRtl(): boolean {
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl");
  }, []);

  return isRtl;
}

/**
 * PageTransition Component
 *
 * Wraps page content with animated transitions
 *
 * @example
 * ```tsx
 * <PageTransition variant="slideUp">
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  variant = "fade",
  duration = 0.2,
  className,
  disabled = false,
}: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isRtl = useIsRtl();

  // Use reduced/no animation if user prefers
  const effectiveVariant = prefersReducedMotion || disabled ? "none" : variant;

  // Get the correct variant (RTL-aware for slide)
  const animationVariant =
    effectiveVariant === "slide" ? getSlideVariant(isRtl) : variants[effectiveVariant];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={animationVariant}
        transition={{
          duration: effectiveVariant === "none" ? 0 : duration,
          ease: easing,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * FadeIn Component
 *
 * Simple fade-in animation for elements
 */
interface FadeInProps {
  children: React.ReactNode;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Custom class name */
  className?: string;
  /** Animate when element enters viewport */
  whenInView?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className,
  whenInView = false,
}: FadeInProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const animationProps = whenInView
    ? {
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <motion.div
      {...animationProps}
      transition={{
        duration,
        delay,
        ease: easing,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerChildren Component
 *
 * Staggers animation of child elements
 */
interface StaggerChildrenProps {
  children: React.ReactNode;
  /** Delay between each child animation (seconds) */
  staggerDelay?: number;
  /** Custom class name */
  className?: string;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerChildrenProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem Component
 *
 * Individual item within StaggerChildren
 */
interface StaggerItemProps {
  children: React.ReactNode;
  /** Custom class name */
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.3, ease: easing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideIn Component
 *
 * Slides content in from a direction
 */
interface SlideInProps {
  children: React.ReactNode;
  /** Direction to slide from */
  from?: "left" | "right" | "top" | "bottom";
  /** Distance to slide (pixels) */
  distance?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Delay before animation (seconds) */
  delay?: number;
  /** Custom class name */
  className?: string;
}

export function SlideIn({
  children,
  from = "bottom",
  distance = 30,
  duration = 0.4,
  delay = 0,
  className,
}: SlideInProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isRtl = useIsRtl();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Adjust horizontal directions for RTL
  const getOffset = () => {
    switch (from) {
      case "left":
        return { x: isRtl ? distance : -distance, y: 0 };
      case "right":
        return { x: isRtl ? -distance : distance, y: 0 };
      case "top":
        return { x: 0, y: -distance };
      case "bottom":
      default:
        return { x: 0, y: distance };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: easing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;

