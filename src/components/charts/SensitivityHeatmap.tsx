"use client";

import React from "react";
import { cn, formatCurrency } from "@/lib/utils";

interface SensitivityHeatmapProps {
  matrix: {
    wacc: number;
    terminalGrowth: number;
    impliedPrice: number;
  }[][];
  currentPrice: number;
  className?: string;
}

export function SensitivityHeatmap({
  matrix,
  currentPrice,
  className,
}: SensitivityHeatmapProps) {
  if (!matrix || matrix.length === 0) return null;

  const growthHeaders = matrix[0].map((item) => item.terminalGrowth);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center justify-between">
        <span>DCF Implied Price Matrix (WACC vs. Terminal Growth Rate)</span>
        <span className="text-[11px] font-normal text-[var(--text-muted)]">
          Current Price: <strong className="text-[var(--text-primary)]">{formatCurrency(currentPrice)}</strong>
        </span>
      </div>

      <table className="w-full text-center border-collapse text-xs num-tabular">
        <thead>
          <tr>
            <th className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] text-[11px] font-medium">
              WACC \ g
            </th>
            {growthHeaders.map((g) => (
              <th
                key={g}
                className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono text-[11px]"
              >
                {g.toFixed(1)}%
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rIdx) => {
            const rowWacc = row[0].wacc;
            return (
              <tr key={rIdx}>
                <td className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono text-[11px] font-semibold">
                  {rowWacc.toFixed(1)}%
                </td>
                {row.map((cell, cIdx) => {
                  const upside = currentPrice > 0 ? ((cell.impliedPrice - currentPrice) / currentPrice) * 100 : 0;
                  
                  let cellBg = "bg-slate-900/30 text-slate-300";
                  if (upside >= 15) {
                    cellBg = "bg-emerald-950/70 text-emerald-300 font-semibold";
                  } else if (upside > 0) {
                    cellBg = "bg-emerald-950/40 text-emerald-400";
                  } else if (upside > -10) {
                    cellBg = "bg-amber-950/40 text-amber-300";
                  } else {
                    cellBg = "bg-rose-950/60 text-rose-300 font-medium";
                  }

                  return (
                    <td
                      key={cIdx}
                      className={cn(
                        "p-2.5 border border-[var(--border-subtle)] font-mono transition-colors hover:brightness-125 cursor-default",
                        cellBg
                      )}
                      title={`WACC: ${cell.wacc}%, Growth: ${cell.terminalGrowth}% -> Implied: $${cell.impliedPrice.toFixed(2)} (${upside > 0 ? "+" : ""}${upside.toFixed(1)}%)`}
                    >
                      <div>${cell.impliedPrice.toFixed(2)}</div>
                      <div className="text-[9px] opacity-80">
                        {upside > 0 ? "+" : ""}
                        {upside.toFixed(0)}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
