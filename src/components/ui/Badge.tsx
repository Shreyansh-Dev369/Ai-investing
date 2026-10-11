import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "outline"
    | "positive"
    | "negative"
    | "warning"
    | "info"
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
    "inline-flex items-center font-medium rounded transition-colors select-none";

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-[10px] gap-1",
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variants = {
    default:
      "bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
    outline:
      "border border-[var(--border-strong)] text-[var(--text-secondary)] bg-transparent",
    positive:
      "bg-emerald-950/50 text-emerald-400 border border-emerald-800/60",
    negative:
      "bg-rose-950/50 text-rose-400 border border-rose-800/60",
    warning:
      "bg-amber-950/50 text-amber-400 border border-amber-800/60",
    info:
      "bg-sky-950/50 text-sky-400 border border-sky-800/60",
    healthy:
      "bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 font-semibold",
    watch:
      "bg-amber-950/60 text-amber-300 border border-amber-700/60 font-semibold",
    "at-risk":
      "bg-rose-950/60 text-rose-300 border border-rose-700/60 font-semibold",
    provenance:
      "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] text-[11px] font-mono",
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
