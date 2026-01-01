"use client";

import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card Variants
 */
type CardVariant = "default" | "elevated" | "outlined" | "ghost" | "interactive";

const cardVariants: Record<CardVariant, string> = {
  default: "bg-card border border-border shadow-sm",
  elevated: "bg-card border border-border shadow-lg",
  outlined: "bg-transparent border-2 border-border",
  ghost: "bg-transparent border-none",
  interactive:
    "bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer transition-all duration-200 active:scale-[0.99]",
};

/**
 * Card Component
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Make the card interactive (clickable) */
  as?: "div" | "article" | "section" | "button";
  /** Disable hover effects */
  noHover?: boolean;
  /** Remove default padding */
  noPadding?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", as: Component = "div", noHover, noPadding, ...props },
    ref
  ) => {
    const isInteractive = variant === "interactive" || Component === "button";

    return (
      <Component
        // @ts-expect-error - polymorphic component ref typing
        ref={ref}
        className={cn(
          "rounded-2xl text-card-foreground transition-shadow",
          cardVariants[variant],
          isInteractive &&
            !noHover &&
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

/**
 * CardHeader Component
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add border below header */
  bordered?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, bordered, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-4 md:p-5 lg:p-6",
        bordered && "border-b border-border",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

/**
 * CardTitle Component
 */
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl md:text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/**
 * CardDescription Component
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

/**
 * CardContent Component
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Remove default padding */
  noPadding?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, noPadding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(noPadding ? "p-0" : "p-4 md:p-5 lg:p-6 pt-0", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

/**
 * CardFooter Component
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add border above footer */
  bordered?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, bordered, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-4 md:p-5 lg:p-6 pt-0",
        bordered && "border-t border-border pt-4 md:pt-5 lg:pt-6",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

/**
 * CardImage Component
 * For cards with a header image
 */
export interface CardImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Aspect ratio (default: 16/9) */
  aspectRatio?: number;
  /** Fill the container */
  fill?: boolean;
  /** Custom height */
  height?: number;
  /** Custom width */
  width?: number;
  /** Additional class names */
  className?: string;
  /** Image priority (for above-fold images) */
  priority?: boolean;
}

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ src, alt, aspectRatio = 16 / 9, fill, height, width, className, priority }, ref) => (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-t-2xl", className)}
      style={{
        aspectRatio: fill ? undefined : aspectRatio,
        height: height,
        width: width,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill={!height && !width}
        width={width}
        height={height}
        className="object-cover"
        priority={priority}
      />
    </div>
  )
);
CardImage.displayName = "CardImage";

/**
 * CardActions Component
 * Container for card action buttons
 */
export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alignment of actions */
  align?: "start" | "center" | "end" | "between";
}

const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ className, align = "end", ...props }, ref) => {
    const alignmentClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", alignmentClasses[align], className)}
        {...props}
      />
    );
  }
);
CardActions.displayName = "CardActions";

/**
 * CardSkeleton Component
 * Loading placeholder for cards
 */
export interface CardSkeletonProps {
  /** Show image skeleton */
  hasImage?: boolean;
  /** Number of text lines */
  lines?: number;
  /** Custom class name */
  className?: string;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ hasImage = false, lines = 3, className }) => (
  <Card className={cn("animate-pulse", className)}>
    {hasImage && <div className="h-48 bg-muted rounded-t-2xl" />}
    <CardHeader>
      <div className="h-6 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2 mt-2" />
    </CardHeader>
    <CardContent>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn("h-4 bg-muted rounded", i === lines - 1 ? "w-2/3" : "w-full")}
          style={{ marginTop: i === 0 ? 0 : "0.5rem" }}
        />
      ))}
    </CardContent>
  </Card>
);
CardSkeleton.displayName = "CardSkeleton";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardActions,
  CardSkeleton,
};
