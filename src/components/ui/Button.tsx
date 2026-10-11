import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "cobalt" | "lime";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#365CFF] disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer rounded-xs tracking-tight";

    const variantStyles = {
      primary:
        "bg-[#111210] hover:bg-[#242621] text-[#F4F1E9] border border-[#111210] shadow-xs active:translate-y-px",
      cobalt:
        "bg-[#365CFF] hover:bg-[#2649E6] text-white font-medium border border-[#365CFF] shadow-xs active:translate-y-px",
      lime:
        "bg-[#D8F36A] hover:bg-[#C9E55B] text-[#121311] font-semibold border border-[#BDD950] shadow-xs active:translate-y-px",
      secondary:
        "bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]",
      outline:
        "border border-[var(--border-subtle)] bg-transparent hover:bg-black/5 text-[var(--text-primary)]",
      ghost:
        "hover:bg-black/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
      danger:
        "bg-[#CF2A2C]/10 hover:bg-[#CF2A2C]/20 text-[#CF2A2C] border border-[#CF2A2C]/30 active:translate-y-px",
    };

    const sizeStyles = {
      sm: "h-7 px-2.5 text-xs gap-1.5 font-mono",
      md: "h-9 px-3.5 text-xs gap-2 font-mono",
      lg: "h-11 px-5 text-sm gap-2.5 font-sans font-medium",
      icon: "h-8 w-8 text-xs p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
