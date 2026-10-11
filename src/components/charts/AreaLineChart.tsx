"use client";

import React, { useState } from "react";
import { cn, formatNumber } from "@/lib/utils";

export interface DataPoint {
  date: string;
  value: number;
  benchmark?: number;
}

interface AreaLineChartProps {
  data: DataPoint[];
  title?: string;
  primaryLabel?: string;
  benchmarkLabel?: string;
  height?: number;
  isCurrency?: boolean;
  isPercent?: boolean;
  className?: string;
}

export function AreaLineChart({
  data,
  primaryLabel = "Portfolio",
  benchmarkLabel = "Benchmark",
  height = 240,
  isCurrency = false,
  isPercent = false,
  className,
}: AreaLineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length < 2) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-lg"
      >
        Insufficient historical observations to generate series.
      </div>
    );
  }

  // Calculate scales
  const allValues = data.flatMap((d) => [d.value, d.benchmark ?? d.value]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const valRange = maxVal - minVal || 1;

  // SVG dimensions
  const svgWidth = 800;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const getX = (i: number) => paddingLeft + (i / (data.length - 1)) * chartW;
  const getY = (v: number) => paddingTop + chartH - ((v - minVal) / valRange) * chartH;

  // Primary path
  const primaryPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.value).toFixed(1)}`);
  const primaryLine = `M ${primaryPoints.join(" L ")}`;
  const primaryArea = `M ${getX(0)},${paddingTop + chartH} L ${primaryPoints.join(" L ")} L ${getX(data.length - 1)},${paddingTop + chartH} Z`;

  // Benchmark path if available
  const hasBenchmark = data.some((d) => d.benchmark !== undefined);
  const benchmarkLine = hasBenchmark
    ? `M ${data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.benchmark ?? d.value).toFixed(1)}`).join(" L ")}`
    : "";

  // Grid lines (4 ticks)
  const ticks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = minVal + pct * valRange;
    const y = getY(val);
    let label = val.toFixed(1);
    if (isCurrency) label = `$${formatNumber(val, 0, true)}`;
    else if (isPercent) label = `${val.toFixed(0)}%`;
    return { val, y, label };
  });

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

  return (
    <div className={cn("w-full flex flex-col select-none", className)}>
      {/* Legend & Active Point readout */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 text-xs border-b border-[var(--border-subtle)]/50 mb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-[var(--text-primary)]">{primaryLabel}</span>
            <span className="font-mono font-semibold text-emerald-400 num-tabular ml-1">
              {isCurrency ? `$${formatNumber(activePoint.value, 2)}` : `${activePoint.value.toFixed(2)}${isPercent ? "%" : ""}`}
            </span>
          </div>

          {hasBenchmark && activePoint.benchmark !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="font-medium text-[var(--text-secondary)]">{benchmarkLabel}</span>
              <span className="font-mono text-slate-300 num-tabular ml-1">
                {isCurrency ? `$${formatNumber(activePoint.benchmark, 2)}` : `${activePoint.benchmark.toFixed(2)}${isPercent ? "%" : ""}`}
              </span>
            </div>
          )}
        </div>

        <div className="text-[11px] font-mono text-[var(--text-muted)]">
          {activePoint.date}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {ticks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={t.y}
                x2={svgWidth - paddingRight}
                y2={t.y}
                stroke="var(--border-subtle)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={t.y + 3}
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {t.label}
              </text>
            </g>
          ))}

          {/* Benchmark line */}
          {hasBenchmark && (
            <path
              d={benchmarkLine}
              fill="none"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Primary area & line */}
          <path d={primaryArea} fill="url(#primaryAreaGrad)" />
          <path
            d={primaryLine}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Date Ticks on X Axis */}
          {data
            .filter((_, i) => i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1)
            .map((d, i) => {
              const origIndex =
                i === 0 ? 0 : i === 1 ? Math.floor(data.length / 2) : data.length - 1;
              const x = getX(origIndex);
              return (
                <text
                  key={i}
                  x={x}
                  y={height - 8}
                  fill="var(--text-muted)"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor={i === 0 ? "start" : i === 1 ? "middle" : "end"}
                >
                  {d.date}
                </text>
              );
            })}

          {/* Crosshair on hover */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={paddingTop + chartH}
                stroke="#38BDF8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].value)}
                r="4"
                fill="#10B981"
                stroke="#0E1118"
                strokeWidth="2"
              />
              {data[hoverIndex].benchmark !== undefined && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(data[hoverIndex].benchmark!)}
                  r="3.5"
                  fill="#94A3B8"
                  stroke="#0E1118"
                  strokeWidth="1.5"
                />
              )}
            </g>
          )}

          {/* Transparent hit boxes for mouse hover */}
          {data.map((_, i) => {
            const barW = chartW / data.length;
            return (
              <rect
                key={i}
                x={getX(i) - barW / 2}
                y={paddingTop}
                width={barW}
                height={chartH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
