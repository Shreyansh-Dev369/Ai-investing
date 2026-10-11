import React from "react";
import { DataProvenance } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Calculator, Sparkles, Database, Clock, Activity, FileSpreadsheet, PlayCircle } from "lucide-react";

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
      bg: "bg-[#D8F36A]/20",
      text: "text-[#4d5e0b] dark:text-[#D8F36A]",
      border: "border-[#B5D638]/40",
      icon: Database,
    },
    LIVE_FEED: {
      label: "LIVE TICK FEED",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      icon: Activity,
    },
    DELAYED_15M: {
      label: "15M DELAYED FEED",
      bg: "bg-amber-500/10",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-500/30",
      icon: Clock,
    },
    HISTORICAL_FILING: {
      label: "HISTORICAL 10-K",
      bg: "bg-slate-500/10",
      text: "text-slate-700 dark:text-slate-300",
      border: "border-slate-500/30",
      icon: FileSpreadsheet,
    },
    SIMULATED_BACKTEST: {
      label: "BACKTEST SIMULATION",
      bg: "bg-sky-500/10",
      text: "text-sky-600 dark:text-sky-400",
      border: "border-sky-500/30",
      icon: PlayCircle,
    },
    SANDBOX_DEMO: {
      label: "PAPER SANDBOX",
      bg: "bg-lime-500/15",
      text: "text-lime-700 dark:text-lime-400",
      border: "border-lime-500/30",
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
      <span>{source ? `${config.label} · ${source}` : config.label}</span>
      {timestamp && <span className="opacity-75">({timestamp})</span>}
    </span>
  );
}
