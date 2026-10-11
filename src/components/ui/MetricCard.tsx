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
        "rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between hover:border-[var(--border-strong)] transition-colors shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-[var(--text-secondary)] tracking-tight">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {provenance && (
            <DataProvenanceBadge
              type={provenance}
              source={provenanceSource}
              showIcon={false}
              className="text-[9px] py-0 px-1.5"
            />
          )}
          {icon && <div className="text-[var(--text-muted)]">{icon}</div>}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold tracking-tight text-[var(--text-primary)] num-tabular">
          {value}
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center text-xs font-semibold num-tabular px-1.5 py-0.5 rounded",
              isPositive && "text-emerald-400 bg-emerald-950/40",
              isNegative && "text-rose-400 bg-rose-950/40",
              !isPositive && !isNegative && "text-slate-400 bg-slate-800/40"
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
          <span className="text-xs font-medium text-[var(--text-muted)]">
            {changeText}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[11px] text-[var(--text-muted)] mt-2 leading-tight">
          {subtext}
        </p>
      )}
    </div>
  );
}
