import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "outline"
    | "positive"
    | "negative"
    | "warning"
    | "cobalt"
    | "lime"
    | "healthy"
    | "watch"
    | "at-risk"
    | "provenance";
  size?: "xs" | "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center font-mono uppercase tracking-wider rounded-xs border select-none transition-colors";

  const sizeClasses = {
    xs: "px-1.5 py-0.2 text-[9px] gap-1",
    sm: "px-2 py-0.5 text-[10px] gap-1.5",
    md: "px-2.5 py-0.5 text-xs gap-1.5",
  };

  const variants = {
    default:
      "bg-black/5 text-[var(--text-secondary)] border-[var(--border-subtle)]",
    outline:
      "border-[var(--border-subtle)] text-[var(--text-secondary)] bg-transparent",
    cobalt:
      "bg-[#365CFF]/10 text-[#365CFF] border-[#365CFF]/30 font-semibold",
    lime:
      "bg-[#D8F36A] text-[#121311] border-[#C9E55B] font-bold",
    positive:
      "bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/30 font-semibold",
    negative:
      "bg-rose-900/10 text-rose-700 dark:text-rose-400 border-rose-600/30 font-semibold",
    warning:
      "bg-amber-900/10 text-amber-800 dark:text-amber-400 border-amber-600/30 font-semibold",
    healthy:
      "bg-emerald-800/10 text-emerald-800 dark:text-emerald-300 border-emerald-700/40 font-bold",
    watch:
      "bg-amber-800/10 text-amber-800 dark:text-amber-300 border-amber-700/40 font-bold",
    "at-risk":
      "bg-rose-800/10 text-rose-800 dark:text-rose-300 border-rose-700/40 font-bold",
    provenance:
      "bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border-[var(--border-subtle)] text-[10px]",
  };

  return (
    <span
      className={cn(base, sizeClasses[size], variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
