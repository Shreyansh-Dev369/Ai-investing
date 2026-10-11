"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { CommandPalette } from "./CommandPalette";
import { NotificationDrawer } from "./NotificationDrawer";

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  const pathname = usePathname();
  const { portfolio, theme, toggleTheme, notifications, isDemoMode } = useWorkspace();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const routeNames: Record<string, { vol: string; title: string; desc: string }> = {
    "/app": { vol: "VOL. 01", title: "EXECUTIVE BRIEFING & COMMAND", desc: "Portfolio NAV, active alpha & thesis surveillance" },
    "/app/screener": { vol: "VOL. 02", title: "DISCOVERY & FACTOR SCREENER", desc: "Systematic multi-metric equity discovery" },
    "/app/research": { vol: "VOL. 03", title: "EQUITY RESEARCH MEMORANDUM", desc: "Filing audit, financial statements & forensic checks" },
    "/app/committee": { vol: "VOL. 04", title: "INVESTMENT COMMITTEE DOSSIER", desc: "Adversarial 5-perspective synthesis" },
    "/app/valuation": { vol: "VOL. 05", title: "VALUATION LABORATORY", desc: "Gordon growth DCF & 2D sensitivity matrix" },
    "/app/portfolio": { vol: "VOL. 06", title: "PORTFOLIO & RISK INTELLIGENCE", desc: "Factor decomposition & pairwise correlation" },
    "/app/thesis": { vol: "VOL. 07", title: "THESIS HEALTH MONITOR", desc: "Continuous verification & tripwire register" },
    "/app/quant": { vol: "VOL. 08", title: "QUANTITATIVE STRATEGY LAB", desc: "Point-in-time factor backtest apparatus" },
    "/app/market": { vol: "VOL. 09", title: "GLOBAL MARKET BRIEFING", desc: "Sovereign yield curve & macro indicators" },
    "/app/copilot": { vol: "VOL. 10", title: "RESEARCH COPILOT WORKSPACE", desc: "Contextual intelligence grounded in filings" },
    "/app/settings": { vol: "VOL. 11", title: "INTEGRATION & SECURITY SANDBOX", desc: "Broker OAuth & data feed status" },
  };

  const currentRoute = routeNames[pathname] || {
    vol: "VOL. 00",
    title: "AI INVESTMENT INTELLIGENCE",
    desc: "Capital Allocation & Research Instrument",
  };

  return (
    <>
      <header className="h-14 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 sm:px-6 flex items-center justify-between gap-4 z-20 shrink-0">
        {/* Left: Mobile menu toggle + Contextual title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="p-1 rounded-xs md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              <span>{currentRoute.vol}</span>
              <span>{"//"}</span>
              <span className="text-[var(--text-primary)] font-bold">{currentRoute.title}</span>
            </div>
            <span className="hidden xl:inline-block text-[11px] text-[var(--text-secondary)] font-sans">
              {currentRoute.desc}
            </span>
          </div>
        </div>

        {/* Center / Right: Global portfolio chip & tools */}
        <div className="flex items-center gap-2.5 font-mono">
          {/* Quick Portfolio Chip */}
          <Link
            href="/app/portfolio"
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors text-xs num-tabular"
          >
            <span className="text-[10px] text-[var(--text-muted)] uppercase">NAV:</span>
            <span className="font-bold text-[var(--text-primary)]">
              {formatCurrency(portfolio.totalValue, "$", 0)}
            </span>
            <span
              className={`text-[10px] font-bold ${
                portfolio.dayChangePercent >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
              }`}
            >
              {formatPercent(portfolio.dayChangePercent, true)}
            </span>
          </Link>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <Search className="h-3 w-3 text-[var(--text-muted)]" />
            <span className="hidden md:inline font-mono text-[11px]">Command Jump</span>
            <kbd className="hidden md:inline-block px-1 py-0.2 rounded-xs bg-black/5 dark:bg-white/10 border border-[var(--border-subtle)] font-mono text-[9px] text-[var(--text-muted)]">
              Ctrl+K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-1.5 rounded-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors cursor-pointer border border-transparent hover:border-[var(--border-subtle)]"
            title="Tripwires & Alerts"
          >
            <Bell className="h-3.5 w-3.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#365CFF]" />
            )}
          </button>

          {/* Theme Switcher (Paper vs Ink) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 px-2 py-1 rounded-xs border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            title={`Switch to ${theme === "dark" ? "paper" : "ink"} appearance`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-3 w-3 text-amber-500" />
                <span className="hidden sm:inline">PAPER</span>
              </>
            ) : (
              <>
                <Moon className="h-3 w-3 text-[#365CFF]" />
                <span className="hidden sm:inline">INK</span>
              </>
            )}
          </button>

          {/* Demo status tag */}
          {isDemoMode && (
            <Link
              href="/app/settings"
              className="hidden 2xl:flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#D8F36A]/20 text-[var(--text-primary)] border border-[#D8F36A]/60 font-mono text-[9px] font-bold uppercase tracking-wider"
              title="Click to manage live API keys"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#365CFF]" />
              <span>SANDBOX</span>
            </Link>
          )}
        </div>
      </header>

      {/* Modals & Drawers */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
}
