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
    { num: "01", label: "Command Center", href: "/app", icon: LayoutDashboard },
    { num: "02", label: "Discovery Screener", href: "/app/screener", icon: Filter },
    { num: "03", label: "Security Research", href: "/app/research", icon: Search },
    { num: "04", label: "Investment Committee", href: "/app/committee", icon: Users2 },
    { num: "05", label: "Valuation Laboratory", href: "/app/valuation", icon: Calculator },
    { num: "06", label: "Portfolio Intelligence", href: "/app/portfolio", icon: PieChart },
    { num: "07", label: "Thesis Health Monitor", href: "/app/thesis", icon: ShieldCheck, badge: "Live" },
    { num: "08", label: "Quantitative Lab", href: "/app/quant", icon: Cpu },
    { num: "09", label: "Market Intelligence", href: "/app/market", icon: Globe2 },
    { num: "10", label: "Research Copilot", href: "/app/copilot", icon: MessageSquareCode },
    { num: "11", label: "Settings & Feeds", href: "/app/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "relative hidden md:flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all duration-200 select-none z-30 shrink-0",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/40">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-7 w-7 rounded-xs bg-[#111210] dark:bg-[#F4F1E9] text-[#F4F1E9] dark:text-[#111210] flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-black/10">
            AI
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-xs tracking-tight text-[var(--text-primary)] leading-tight uppercase font-mono">
                INVESTMENT OS
              </span>
              <span className="text-[9px] text-[var(--text-muted)] font-mono tracking-widest leading-none">
                SWISS RESEARCH DESK
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Nav List with numbered modules */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {!isCollapsed && (
          <div className="px-2 pb-2 text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
            Research Apparatus
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
                "flex items-center gap-2.5 px-2.5 py-2 rounded-xs text-xs font-mono transition-all group relative border",
                isActive
                  ? "bg-[#365CFF] text-white border-[#365CFF] font-semibold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border-transparent"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={cn(
                "text-[9px] font-mono shrink-0",
                isActive ? "text-white/80" : "text-[var(--text-muted)]"
              )}>
                {item.num}
              </span>
              <Icon
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                )}
              />
              {!isCollapsed && (
                <span className="truncate flex-1 font-sans text-xs tracking-tight">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className={cn(
                  "text-[8px] font-mono px-1 py-0.2 rounded-xs uppercase tracking-wider font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-[#D8F36A] text-[#121311]"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Environment Status & Theme */}
      <div className="p-2 border-t border-[var(--border-subtle)] space-y-1 bg-[var(--bg-surface-elevated)]/30 font-mono text-[10px]">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors",
            isCollapsed && "justify-center"
          )}
          title="Public Research Portal"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          {!isCollapsed && <span>Public Portal (/)</span>}
        </Link>

        <button
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-colors cursor-pointer",
            isCollapsed && "justify-center"
          )}
          title={`Switch between Editorial Paper and Dark Ink`}
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5 shrink-0 text-amber-500" /> : <Moon className="h-3.5 w-3.5 shrink-0 text-[#365CFF]" />}
          {!isCollapsed && <span>{theme === "dark" ? "Editorial Paper Mode" : "Dark Ink Mode"}</span>}
        </button>

        {!isCollapsed && isDemoMode && (
          <div className="px-2 py-1 rounded-xs bg-[#D8F36A]/20 border border-[#D8F36A]/40 flex items-center justify-between text-[9px] text-[var(--text-primary)]">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[#365CFF] animate-pulse" />
              SANDBOX SIM
            </span>
            <Link href="/app/settings" className="underline hover:text-[#365CFF]">
              FEEDS
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
