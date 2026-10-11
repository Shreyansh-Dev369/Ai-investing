import React from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 90,
  height = 24,
  color,
  className,
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="bg-slate-800/20 rounded" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Calculate points with padding
  const paddingY = 2;
  const h = height - paddingY * 2;
  const stepX = width / (data.length - 1);

  const points = data
    .map((val, idx) => {
      const x = (idx * stepX).toFixed(1);
      const y = (height - paddingY - ((val - min) / range) * h).toFixed(1);
      return `${x},${y}`;
    })
    .join(" ");

  const isUp = data[data.length - 1] >= data[0];
  const strokeColor = color || (isUp ? "#10B981" : "#F43F5E");

  return (
    <svg
      width={width}
      height={height}
      className={cn("overflow-visible shrink-0", className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
