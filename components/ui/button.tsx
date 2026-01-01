"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button Variants
 *
 * Comprehensive button styling with variants for different use cases:
 * - primary: Main CTA buttons (teal)
 * - secondary: Secondary actions (gray)
 * - outline: Bordered buttons
 * - ghost: Minimal/text buttons
 * - danger: Destructive actions (red)
 * - success: Positive actions (green)
 * - link: Text link style
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/20 rounded-lg",
        primary:
          "bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/20 rounded-lg",
        secondary:
          "bg-gray-100 text-foreground hover:bg-gray-200 rounded-lg dark:bg-neutral-800 dark:hover:bg-neutral-700",
        outline:
          "border-2 border-input bg-background hover:bg-primary-50 hover:text-primary hover:border-primary rounded-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg",
        danger:
          "bg-error text-white hover:bg-error-dark shadow-lg shadow-error/20 rounded-lg",
        success:
          "bg-success text-white hover:bg-success-dark shadow-lg shadow-success/20 rounded-lg",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-md [&_svg]:size-3",
        sm: "h-8 px-3 text-sm rounded-md [&_svg]:size-3.5",
        default: "h-10 px-4 text-sm rounded-lg [&_svg]:size-4",
        md: "h-10 px-4 text-sm rounded-lg [&_svg]:size-4",
        lg: "h-12 px-6 text-base rounded-xl [&_svg]:size-5",
        xl: "h-14 px-8 text-lg rounded-xl [&_svg]:size-6",
        icon: "h-10 w-10 rounded-lg [&_svg]:size-5",
        "icon-sm": "h-8 w-8 rounded-md [&_svg]:size-4",
        "icon-lg": "h-12 w-12 rounded-xl [&_svg]:size-6",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child component (for composition with Link, etc.) */
  asChild?: boolean;
  /** Show loading spinner and disable button */
  loading?: boolean;
  /** Loading text (replaces children when loading) */
  loadingText?: string;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    // For icon-only buttons, just show spinner
    const isIconButton = size === "icon" || size === "icon-sm" || size === "icon-lg";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            {!isIconButton && (loadingText || children)}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

/**
 * IconButton
 * A specialized button for icon-only use cases
 */
export interface IconButtonProps extends Omit<ButtonProps, "children" | "leftIcon" | "rightIcon"> {
  /** The icon to display */
  icon: React.ReactNode;
  /** Accessible label (required for icon-only buttons) */
  "aria-label": string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = "icon", className, ...props }, ref) => {
    return (
      <Button ref={ref} size={size} className={cn("p-0", className)} {...props}>
        {icon}
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";

/**
 * ButtonGroup
 * Container for grouping related buttons together
 */
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation of the button group */
  orientation?: "horizontal" | "vertical";
  /** Attach buttons together with shared borders */
  attached?: boolean;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", attached = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex",
          orientation === "vertical" ? "flex-col" : "flex-row",
          attached && orientation === "horizontal" && "[&>button:not(:first-child)]:rounded-s-none [&>button:not(:last-child)]:rounded-e-none [&>button:not(:last-child)]:border-e-0",
          attached && orientation === "vertical" && "[&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none [&>button:not(:last-child)]:border-b-0",
          !attached && "gap-2",
          className
        )}
        {...props}
      />
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

export { Button, IconButton, ButtonGroup, buttonVariants };
