"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Filter,
  Search,
  Users2,
  Calculator,
  PieChart,
  ShieldCheck,
  Cpu,
  Globe2,
  MessageSquareCode,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/context/WorkspaceContext";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme, isDemoMode } = useWorkspace();

  const navItems = [
    { label: "Command Center", href: "/app", icon: LayoutDashboard },
    { label: "Discovery Screener", href: "/app/screener", icon: Filter },
    { label: "Security Research", href: "/app/research", icon: Search },
    { label: "Investment Committee", href: "/app/committee", icon: Users2 },
    { label: "Valuation Laboratory", href: "/app/valuation", icon: Calculator },
    { label: "Portfolio Intelligence", href: "/app/portfolio", icon: PieChart },
    { label: "Thesis Health Monitor", href: "/app/thesis", icon: ShieldCheck, badge: "Live" },
    { label: "Quantitative Lab", href: "/app/quant", icon: Cpu },
    { label: "Market Intelligence", href: "/app/market", icon: Globe2 },
    { label: "Research Copilot", href: "/app/copilot", icon: MessageSquareCode },
    { label: "Settings & Feeds", href: "/app/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "relative hidden md:flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all duration-200 select-none z-30 shrink-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-[var(--border-subtle)]/70">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-8 w-8 rounded-md bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <TrendingUp className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-tight text-[var(--text-primary)] leading-tight whitespace-nowrap">
                AI INVESTMENT
              </span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-wider">
                INTELLIGENCE OS
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {!isCollapsed && (
          <div className="px-2.5 pb-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Workspace Modules
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all group relative",
                isActive
                  ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-transparent"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-emerald-400" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                )}
              />
              {!isCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Environment Status & Theme */}
      <div className="p-2 border-t border-[var(--border-subtle)]/70 space-y-1.5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors",
            isCollapsed && "justify-center"
          )}
          title="Public Marketing Site"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          {!isCollapsed && <span>Public Portal</span>}
        </Link>

        <button
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer",
            isCollapsed && "justify-center"
          )}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5 shrink-0 text-amber-400" /> : <Moon className="h-3.5 w-3.5 shrink-0 text-sky-400" />}
          {!isCollapsed && <span>{theme === "dark" ? "Light Appearance" : "Dark Obsidian"}</span>}
        </button>

        {!isCollapsed && isDemoMode && (
          <div className="px-2 py-1.5 rounded bg-amber-950/40 border border-amber-800/50 flex items-center justify-between text-[10px] font-mono text-amber-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              DEMO DATA ACTIVE
            </span>
            <Link href="/app/settings" className="underline hover:text-amber-200">
              Feeds
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
