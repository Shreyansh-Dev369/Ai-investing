"use client";

import React, { useState } from "react";
import { X, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useWorkspace } from "@/context/WorkspaceContext";

export function DemoDataBanner() {
  const { isDemoMode } = useWorkspace();
  const [collapsed, setCollapsed] = useState(false);

  if (!isDemoMode) return null;

  if (collapsed) {
    return (
      <div className="bg-amber-950/80 border-b border-amber-800/60 px-4 py-1.5 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold tracking-wider font-mono text-[11px] uppercase">
            Demo Environment Active
          </span>
          <span className="text-amber-400/80 hidden sm:inline">
            — Simulated data & SEC historical filings in sandbox mode
          </span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="text-amber-300 underline hover:text-amber-200 cursor-pointer text-xs"
        >
          Expand Details
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Environment Notice" className="bg-amber-950/90 border-b border-amber-700/70 px-4 py-2.5 text-xs text-amber-200 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1 rounded bg-amber-900/60 text-amber-300 shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <span className="font-mono font-bold tracking-wider text-amber-300 mr-2 uppercase text-[11px] px-1.5 py-0.5 rounded bg-amber-900/80 border border-amber-700/80">
              DEMO DATA ENVIRONMENT
            </span>
            <span className="text-amber-200">
              External market feeds and broker connections are in simulated demonstration mode. Numbers are computed from point-in-time SEC EDGAR filings and internal mathematical models.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <Link
            href="/app/settings"
            className="inline-flex items-center gap-1 font-medium text-amber-300 hover:text-amber-100 hover:underline"
          >
            <span>Connect Live Feeds</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 text-amber-400 hover:text-amber-200 rounded hover:bg-amber-900/40 cursor-pointer"
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
