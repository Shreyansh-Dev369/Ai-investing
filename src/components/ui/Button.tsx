import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "teal";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-md";

    const variantStyles = {
      primary:
        "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm active:bg-emerald-700",
      teal:
        "bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-sm active:bg-teal-700",
      secondary:
        "bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] active:bg-[var(--bg-surface)]",
      outline:
        "border border-[var(--border-strong)] bg-transparent hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)]",
      ghost:
        "hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
      danger:
        "bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 active:bg-rose-900",
    };

    const sizeStyles = {
      sm: "h-8 px-2.5 text-xs gap-1.5",
      md: "h-9 px-3.5 text-sm gap-2",
      lg: "h-11 px-5 text-base gap-2.5",
      icon: "h-8 w-8 text-sm p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
