"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DrawdownChartProps {
  data: { date: string; drawdown: number }[];
  height?: number;
  className?: string;
}

export function DrawdownChart({
  data,
  height = 140,
  className,
}: DrawdownChartProps) {
  if (!data || data.length < 2) return null;

  const svgWidth = 800;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 10;
  const paddingBottom = 25;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const minDd = Math.min(...data.map((d) => d.drawdown), -10); // at least -10%
  const maxDd = 0; // 0% peak
  const range = maxDd - minDd || 1;

  const getX = (i: number) => paddingLeft + (i / (data.length - 1)) * chartW;
  const getY = (v: number) => paddingTop + ((maxDd - v) / range) * chartH;

  const points = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.drawdown).toFixed(1)}`);
  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `M ${getX(0)},${getY(0)} L ${points.join(" L ")} L ${getX(data.length - 1)},${getY(0)} Z`;

  return (
    <div className={cn("w-full flex flex-col", className)}>
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
        <span className="font-medium text-[var(--text-secondary)]">Historical Drawdown Profile</span>
        <span className="font-mono text-rose-400 font-semibold num-tabular">
          Peak Underwater: {minDd.toFixed(1)}%
        </span>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${svgWidth} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="drawdownGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* 0% baseline */}
          <line
            x1={paddingLeft}
            y1={getY(0)}
            x2={svgWidth - paddingRight}
            y2={getY(0)}
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
          <text
            x={paddingLeft - 6}
            y={getY(0) + 3}
            fill="var(--text-muted)"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            0%
          </text>

          {/* min tick */}
          <line
            x1={paddingLeft}
            y1={getY(minDd)}
            x2={svgWidth - paddingRight}
            y2={getY(minDd)}
            stroke="var(--border-subtle)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <text
            x={paddingLeft - 6}
            y={getY(minDd) + 3}
            fill="#F43F5E"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="end"
          >
            {minDd.toFixed(0)}%
          </text>

          {/* Area & line */}
          <path d={areaPath} fill="url(#drawdownGrad)" />
          <path
            d={linePath}
            fill="none"
            stroke="#F43F5E"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
