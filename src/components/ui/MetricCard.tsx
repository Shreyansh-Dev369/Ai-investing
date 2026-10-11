import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { DataProvenance } from "@/types";
import { DataProvenanceBadge } from "./DataProvenanceBadge";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeText?: string;
  subtext?: string;
  provenance?: DataProvenance;
  provenanceSource?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  changeText,
  subtext,
  provenance,
  provenanceSource,
  icon,
  className,
}: MetricCardProps) {
  const isPositive = change !== undefined ? change > 0 : undefined;
  const isNegative = change !== undefined ? change < 0 : undefined;

  return (
    <div
      className={cn(
        "border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between hover:border-[var(--border-strong)] transition-colors rounded-xs group",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] font-medium">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {provenance && (
            <DataProvenanceBadge
              type={provenance}
              source={provenanceSource}
              showIcon={false}
              className="text-[8px] py-0 px-1"
            />
          )}
          {icon && <div className="text-[var(--text-muted)]">{icon}</div>}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)] num-tabular">
          {value}
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center text-xs font-mono font-bold num-tabular px-1.5 py-0.5 rounded-xs border",
              isPositive && "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
              isNegative && "text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
              !isPositive && !isNegative && "text-stone-500 bg-black/5 border-black/10"
            )}
          >
            {isPositive && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
            {isNegative && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3 mr-0.5" />}
            <span>
              {isPositive ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
        )}
        {changeText && !change && (
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {changeText}
          </span>
        )}
      </div>

      {subtext && (
        <div className="text-[11px] text-[var(--text-secondary)] mt-3 pt-2 border-t border-[var(--border-subtle)]/60 font-sans leading-snug">
          {subtext}
        </div>
      )}
    </div>
  );
}
