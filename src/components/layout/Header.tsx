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

  const routeNames: Record<string, { title: string; subtitle: string }> = {
    "/app": { title: "Command Center", subtitle: "Portfolio health, catalyst feed & alpha decomposition" },
    "/app/screener": { title: "Discovery Screener", subtitle: "Multi-factor quantitative and fundamental security discovery" },
    "/app/research": { title: "Security Research", subtitle: "Institutional company audit, financial statements & valuation" },
    "/app/committee": { title: "Investment Committee", subtitle: "Multi-perspective debate & adversarial thesis review" },
    "/app/valuation": { title: "Valuation Laboratory", subtitle: "Discounted Cash Flow, WACC analysis & sensitivity matrix" },
    "/app/portfolio": { title: "Portfolio Intelligence", subtitle: "Risk decomposition, factor exposure & correlation structure" },
    "/app/thesis": { title: "Thesis Health Monitor", subtitle: "Continuous tracking of assumptions, KPIs & tripwire alerts" },
    "/app/quant": { title: "Quantitative Strategy Lab", subtitle: "Point-in-time backtesting, risk metrics & factor simulations" },
    "/app/market": { title: "Market Intelligence", subtitle: "Macroeconomic indicators, yield curve & sourced catalysts" },
    "/app/copilot": { title: "Research Copilot", subtitle: "Natural language contextual financial intelligence" },
    "/app/settings": { title: "Settings & Feeds", subtitle: "Broker integrations, data provider connections & audit log" },
  };

  const currentRoute = routeNames[pathname] || {
    title: "AI Investment Intelligence",
    subtitle: "Research-First Investment Operating System",
  };

  return (
    <>
      <header className="h-14 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 flex items-center justify-between gap-4 z-20 shrink-0">
        {/* Left: Mobile menu toggle + Contextual title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="p-1.5 rounded md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)] tracking-tight">
                {currentRoute.title}
              </span>
              <span className="hidden lg:inline-block text-[11px] text-[var(--text-muted)]">
                — {currentRoute.subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Global portfolio chip & tools */}
        <div className="flex items-center gap-2.5">
          {/* Quick Portfolio Chip */}
          <Link
            href="/app/portfolio"
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors text-xs"
          >
            <span className="text-[11px] text-[var(--text-muted)]">NAV:</span>
            <span className="font-mono font-bold text-[var(--text-primary)] num-tabular">
              {formatCurrency(portfolio.totalValue, "$", 0)}
            </span>
            <span
              className={`font-mono text-[11px] font-semibold num-tabular ${
                portfolio.dayChangePercent >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {formatPercent(portfolio.dayChangePercent, true)}
            </span>
          </Link>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="hidden md:inline">Quick Jump...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)]">
              Ctrl+K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
            title="Tripwires & Alerts"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-sky-400" />
            )}
          </button>

          {/* Demo status tag */}
          {isDemoMode && (
            <Link
              href="/app/settings"
              className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/50 text-amber-400 border border-amber-800/60 font-mono text-[10px]"
              title="Click to manage live API keys"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>DEMO MODE</span>
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
