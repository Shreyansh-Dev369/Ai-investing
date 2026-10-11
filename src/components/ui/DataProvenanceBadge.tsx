import React from "react";
import { DataProvenance } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Calculator, Sparkles, Database } from "lucide-react";

interface DataProvenanceBadgeProps {
  type: DataProvenance;
  source?: string;
  timestamp?: string;
  className?: string;
  showIcon?: boolean;
}

export function DataProvenanceBadge({
  type,
  source,
  timestamp,
  className,
  showIcon = true,
}: DataProvenanceBadgeProps) {
  const configs: Record<
    DataProvenance,
    { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    VERIFIED_EXTERNAL: {
      label: "Verified Source",
      bg: "bg-emerald-950/40",
      text: "text-emerald-400",
      border: "border-emerald-800/50",
      icon: CheckCircle2,
    },
    CALCULATED_METRIC: {
      label: "Calculated Metric",
      bg: "bg-sky-950/40",
      text: "text-sky-400",
      border: "border-sky-800/50",
      icon: Calculator,
    },
    MODEL_ESTIMATE: {
      label: "Model Estimate",
      bg: "bg-purple-950/40",
      text: "text-purple-300",
      border: "border-purple-800/50",
      icon: Sparkles,
    },
    DEMO_DATA: {
      label: "Sample / Demo",
      bg: "bg-amber-950/40",
      text: "text-amber-400",
      border: "border-amber-800/50",
      icon: Database,
    },
  };

  const config = configs[type] || configs.DEMO_DATA;
  const IconComponent = config.icon;

  return (
    <span
      title={source ? `Source: ${source}${timestamp ? ` (${timestamp})` : ""}` : config.label}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border select-none transition-colors",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showIcon && <IconComponent className="h-3 w-3 shrink-0" />}
      <span>{config.label}</span>
      {source && <span className="opacity-75 font-sans truncate max-w-[120px]">· {source}</span>}
    </span>
  );
}
