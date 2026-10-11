"use client";

import React from "react";
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
  X,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex md:hidden bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-4/5 max-w-xs h-full bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] p-4 flex flex-col justify-between animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xs tracking-tight text-[var(--text-primary)]">
                AI INVESTMENT OS
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/60 font-semibold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Public Marketing Portal</span>
          </Link>
          <div className="text-[10px] font-mono text-[var(--text-muted)] px-2">
            AI Investment Intelligence v2.4 (Enterprise)
          </div>
        </div>
      </div>
    </div>
  );
}
