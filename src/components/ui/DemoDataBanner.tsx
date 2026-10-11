"use client";

import React, { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useWorkspace } from "@/context/WorkspaceContext";

export function DemoDataBanner() {
  const { isDemoMode } = useWorkspace();
  const [collapsed, setCollapsed] = useState(false);

  if (!isDemoMode) return null;

  if (collapsed) {
    return (
      <div className="bg-[#FAF8F3] dark:bg-[#181916] border-b border-[var(--border-subtle)] px-4 py-1 flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D8F36A] border border-black/40 animate-pulse" />
          <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--text-primary)]">
            SANDBOX SIMULATION ACTIVE
          </span>
          <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">
            — SEC EDGAR Historical Archive & Mathematical DCF Models
          </span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="text-[10px] text-[#365CFF] underline hover:text-[#2649E6] cursor-pointer"
        >
          Expand Notice
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Environment Notice" className="bg-[#EDEAE1] dark:bg-[#1C1E1A] border-b border-[var(--border-subtle)] px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-2.5">
          <span className="px-1.5 py-0.5 rounded-xs bg-[#D8F36A] text-[#121311] font-bold text-[9px] uppercase tracking-wider border border-[#C9E55B]">
            DISPATCH // SANDBOX DEMO
          </span>
          <span className="text-[var(--text-primary)] font-sans text-xs">
            Market feeds & execution sandboxes are running in test mode. Figures are derived strictly from SEC EDGAR filings and internal mathematical engines.
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
          <Link
            href="/app/settings"
            className="inline-flex items-center gap-1 font-bold text-[#365CFF] hover:underline"
          >
            <span>Configure Feeds</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            title="Minimize notice"
            aria-label="Minimize demonstration notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
