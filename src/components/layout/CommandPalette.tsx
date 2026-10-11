"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Calculator,
  ShieldCheck,
  Cpu,
  Globe2,
  Users2,
  Filter,
  X,
  ArrowRight,
  PieChart,
  Settings,
} from "lucide-react";
import { MOCK_SECURITIES } from "@/data/mockData";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn, formatCurrency } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { setActiveResearchTicker } = useWorkspace();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(); // toggle if already open or trigger parent
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSecurities = MOCK_SECURITIES.filter(
    (s) =>
      s.ticker.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.sector.toLowerCase().includes(query.toLowerCase())
  );

  const navigationCommands = [
    { label: "Overview Command Center", href: "/app", icon: LayoutDashboard },
    { label: "AI Discovery Screener", href: "/app/screener", icon: Filter },
    { label: "Investment Committee", href: "/app/committee", icon: Users2 },
    { label: "Valuation Laboratory (DCF)", href: "/app/valuation", icon: Calculator },
    { label: "Thesis Health Monitor", href: "/app/thesis", icon: ShieldCheck },
    { label: "Quantitative Strategy Lab", href: "/app/quant", icon: Cpu },
    { label: "Market Intelligence", href: "/app/market", icon: Globe2 },
    { label: "Portfolio Intelligence & Risk", href: "/app/portfolio", icon: PieChart },
    { label: "Execute Order Ticket / Paper Sandbox", href: "/app/portfolio", icon: ShieldCheck },
    { label: "Broker Registry & Provenance Settings", href: "/app/settings", icon: Settings },
  ].filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelectSecurity = (ticker: string) => {
    setActiveResearchTicker(ticker);
    router.push(`/app/research?ticker=${ticker}`);
    onClose();
  };

  const handleSelectNav = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[var(--border-subtle)]">
          <Search className="h-4 w-4 text-[var(--text-muted)] mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search securities (NVDA, MSFT), models, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
          {/* Securities Section */}
          {filteredSecurities.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Securities Universe
              </div>
              <div className="space-y-1">
                {filteredSecurities.slice(0, 5).map((sec) => (
                  <button
                    key={sec.ticker}
                    onClick={() => handleSelectSecurity(sec.ticker)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-[var(--bg-surface-elevated)] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="font-mono font-bold text-[var(--text-primary)] px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                        {sec.ticker}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">
                          {sec.name}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {sec.sector} · {sec.industry}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="font-mono font-semibold text-[var(--text-primary)] num-tabular">
                          {formatCurrency(sec.price)}
                        </div>
                        <div
                          className={cn(
                            "text-[10px] font-mono",
                            sec.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
                          )}
                        >
                          {sec.changePercent >= 0 ? "+" : ""}
                          {sec.changePercent.toFixed(2)}%
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Commands */}
          {navigationCommands.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Quick Navigation
              </div>
              <div className="space-y-1">
                {navigationCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.href}
                      onClick={() => handleSelectNav(cmd.href)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-[var(--bg-surface-elevated)] transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-[var(--text-muted)] group-hover:text-emerald-400" />
                        <span className="font-medium text-[var(--text-primary)]">
                          {cmd.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]">
                        Jump
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredSecurities.length === 0 && navigationCommands.length === 0 && (
            <div className="p-6 text-center text-xs text-[var(--text-muted)]">
              No matching securities or commands found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/50 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px]">
              ↑↓
            </kbd>
            <span>to navigate</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px]">
              ESC
            </kbd>
            <span>to dismiss</span>
          </div>
          <span className="font-mono text-[10px]">AI INVESTMENT INTELLIGENCE OS</span>
        </div>
      </div>
    </div>
  );
}
