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
      label: "SEC / VERIFIED",
      bg: "bg-[#16864A]/10",
      text: "text-[#16864A] dark:text-[#22C55E]",
      border: "border-[#16864A]/30",
      icon: CheckCircle2,
    },
    CALCULATED_METRIC: {
      label: "CALCULATED FORMULA",
      bg: "bg-[#365CFF]/10",
      text: "text-[#365CFF]",
      border: "border-[#365CFF]/30",
      icon: Calculator,
    },
    MODEL_ESTIMATE: {
      label: "MODEL ESTIMATE",
      bg: "bg-[#9333EA]/10",
      text: "text-[#9333EA] dark:text-[#C084FC]",
      border: "border-[#9333EA]/30",
      icon: Sparkles,
    },
    DEMO_DATA: {
      label: "SANDBOX SIMULATION",
      bg: "bg-[#D8F36A]/30",
      text: "text-[#121311] dark:text-[#D8F36A]",
      border: "border-[#B5D638]",
      icon: Database,
    },
  };

  const config = configs[type] || configs.DEMO_DATA;
  const IconComponent = config.icon;

  return (
    <span
      title={source ? `Source: ${source}${timestamp ? ` (${timestamp})` : ""}` : config.label}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[9px] font-mono uppercase tracking-wider border select-none transition-colors",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showIcon && <IconComponent className="h-2.5 w-2.5 shrink-0" />}
      <span>{config.label}</span>
      {source && <span className="opacity-75 font-mono truncate max-w-[130px]">· {source}</span>}
    </span>
  );
}
