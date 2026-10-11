"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Search,
  Users2,
  Calculator,
  PieChart,
  Cpu,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  FileText,
  Activity,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { AreaLineChart } from "@/components/charts/AreaLineChart";
import { MOCK_PORTFOLIO } from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function MarketingHomePage() {
  const [activePreviewTab, setActivePreviewTab] = useState<"command" | "valuation" | "committee" | "thesis">("command");

  const previewTabs = [
    { id: "command", label: "Command Center", icon: Activity },
    { id: "valuation", label: "Valuation Lab", icon: Calculator },
    { id: "committee", label: "Investment Committee", icon: Users2 },
    { id: "thesis", label: "Thesis Health Monitor", icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col selection:bg-teal-500 selection:text-black">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)]/80 bg-[var(--bg-base)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
                  AI INVESTMENT
                </span>
                <span className="text-[10px] text-emerald-400 font-mono tracking-widest leading-none">
                  INTELLIGENCE
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[var(--text-secondary)]">
              <a href="#workflow" className="hover:text-[var(--text-primary)] transition-colors">
                Workflow
              </a>
              <a href="#capabilities" className="hover:text-[var(--text-primary)] transition-colors">
                Capabilities
              </a>
              <a href="#committee" className="hover:text-[var(--text-primary)] transition-colors">
                Committee
              </a>
              <a href="#provenance" className="hover:text-[var(--text-primary)] transition-colors">
                Data Provenance
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/app">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="primary" size="sm" className="text-xs">
                <span>Launch Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Editorial Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 border-b border-[var(--border-subtle)]/40 overflow-hidden">
        {/* Subtle background mesh glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] mb-6 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-[var(--text-primary)]">Next-Generation Investment Operating System</span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="font-mono text-emerald-400 text-[11px]">v2.4 Sandbox Live</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15] mb-6">
            Institutional Research. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              Uncompromising Data Integrity.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-8">
            Unify security discovery, company financial deep-dives, interactive DCF valuation, portfolio risk decomposition, and continuous thesis health monitoring in one professional platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/app">
              <Button variant="primary" size="lg" className="text-sm font-semibold shadow-md">
                <span>Open Terminal Workspace</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/app/screener">
              <Button variant="secondary" size="lg" className="text-sm">
                <span>Explore Screener Universe</span>
              </Button>
            </Link>
          </div>

          {/* Key metrics bar */}
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]/70">
              <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Securities Analyzed</div>
              <div className="text-xl font-bold text-[var(--text-primary)] num-tabular mt-0.5">8,400+</div>
              <div className="text-[11px] text-emerald-400 mt-1">SEC EDGAR Point-in-Time</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]/70">
              <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Valuation Accuracy</div>
              <div className="text-xl font-bold text-[var(--text-primary)] num-tabular mt-0.5">Gordon DCF</div>
              <div className="text-[11px] text-sky-400 mt-1">Dynamic 2D Sensitivity</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]/70">
              <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Committee Depth</div>
              <div className="text-xl font-bold text-[var(--text-primary)] num-tabular mt-0.5">5 Perspectives</div>
              <div className="text-[11px] text-purple-400 mt-1">Adversarial Debate Built-in</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]/70">
              <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Data Provenance</div>
              <div className="text-xl font-bold text-[var(--text-primary)] num-tabular mt-0.5">100% Explicit</div>
              <div className="text-[11px] text-amber-400 mt-1">Zero Hallucinated Numbers</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Art-Directed Product Preview */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Crafted for Rigorous Investment Decision-Making
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            Switch between core platform modules below to see real live components rendered directly in your browser.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg max-w-xl mx-auto mb-6 overflow-x-auto">
          {previewTabs.map((t) => {
            const Icon = t.icon;
            const active = activePreviewTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActivePreviewTab(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-[var(--bg-surface)] text-emerald-400 border border-[var(--border-strong)] shadow-xs font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Preview Canvas */}
        <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl p-4 sm:p-6 overflow-hidden">
          {activePreviewTab === "command" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">Portfolio NAV</span>
                    <Badge variant="healthy" size="xs">Alpha Active</Badge>
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-primary)] num-tabular mt-1">
                    {formatCurrency(MOCK_PORTFOLIO.totalValue)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[var(--text-muted)] block">1D Movement</span>
                    <span className="text-emerald-400 font-bold">+{formatPercent(MOCK_PORTFOLIO.dayChangePercent)} (+${MOCK_PORTFOLIO.dayChangeDollar.toLocaleString()})</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">Sharpe 1Y</span>
                    <span className="text-sky-400 font-bold">{MOCK_PORTFOLIO.sharpeRatio1Y}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">Max Drawdown</span>
                    <span className="text-rose-400 font-bold">-{MOCK_PORTFOLIO.maxDrawdown1Y}%</span>
                  </div>
                </div>
              </div>

              {/* Area Line Chart Preview */}
              <AreaLineChart
                data={MOCK_PORTFOLIO.performanceHistory.map((p) => ({
                  date: p.date,
                  value: p.portfolio,
                  benchmark: p.benchmark,
                }))}
                primaryLabel="Fund Portfolio"
                benchmarkLabel="S&P 500 (SPY)"
                height={200}
                isPercent={false}
              />

              {/* Top Holdings Preview */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center justify-between">
                  <span>Core Active Positions</span>
                  <Link href="/app/portfolio" className="text-emerald-400 hover:underline text-[11px]">
                    View all 7 holdings →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {MOCK_PORTFOLIO.holdings.slice(0, 3).map((h) => (
                    <div
                      key={h.ticker}
                      className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-xs text-[var(--text-primary)]">{h.ticker}</div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate max-w-[120px]">{h.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-semibold text-[var(--text-primary)] num-tabular">
                          {formatCurrency(h.currentPrice)}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400 num-tabular">
                          +{formatPercent(h.unrealizedPlPercent)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === "valuation" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    NVIDIA Corporation (NASDAQ: NVDA) — DCF Valuation Bridge
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Model: Gordon Growth Terminal Value + 5-Year High-Growth Stage
                  </p>
                </div>
                <Badge variant="info">Model Estimate</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-[11px] text-[var(--text-muted)]">Implied Fair Value</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono num-tabular mt-0.5">$148.50</div>
                  <div className="text-[10px] text-emerald-400 mt-1">+7.4% vs $138.25 Spot</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-[11px] text-[var(--text-muted)]">Modeled WACC</div>
                  <div className="text-xl font-bold text-[var(--text-primary)] font-mono num-tabular mt-0.5">9.5%</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">CAPM Beta 1.68 · Rf 4.08%</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-[11px] text-[var(--text-muted)]">Terminal Growth (g)</div>
                  <div className="text-xl font-bold text-[var(--text-primary)] font-mono num-tabular mt-0.5">3.5%</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">Long-term GDP baseline</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-[11px] text-[var(--text-muted)]">Operating Margin</div>
                  <div className="text-xl font-bold text-[var(--text-primary)] font-mono num-tabular mt-0.5">58.0%</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">Normalized Blackwell run rate</div>
                </div>
              </div>

              <div className="p-3 rounded bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center justify-between">
                <span>Interactive sliders and 2D WACC matrix available in workspace.</span>
                <Link href="/app/valuation" className="text-emerald-400 font-medium hover:underline">
                  Launch Valuation Lab →
                </Link>
              </div>
            </div>
          )}

          {activePreviewTab === "committee" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    Investment Committee Review — NVIDIA Corporation
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Consensus Verdict: OVERWEIGHT (Score: 82/100) · 5 Independent Perspectives
                  </p>
                </div>
                <Badge variant="healthy">Consensus Overweight</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-emerald-800/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-emerald-400">Fundamental Analyst</span>
                    <Badge variant="positive" size="xs">STRONG BUY (88%)</Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Blackwell order backlog is fully committed for 12 months with non-cancellable terms. Enterprise inference adoption growing 2.4x faster than training demand.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-amber-800/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-amber-400">Bear-Case Adversary</span>
                    <Badge variant="warning" size="xs">CAUTION (74%)</Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Customer concentration risk: 4 hyperscalers drive 38% of revenue. If end-user AI ROI stalls, a 25-35% CapEx cut would trigger an acute semiconductor bullwhip effect.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center justify-between">
                <span>Preserves genuine disagreements rather than manufacturing artificial consensus.</span>
                <Link href="/app/committee" className="text-emerald-400 font-medium hover:underline">
                  Read Full Committee Debate →
                </Link>
              </div>
            </div>
          )}

          {activePreviewTab === "thesis" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    Continuous Thesis Health Monitoring
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Tracks whether your original investment rationale remains verified by filings
                  </p>
                </div>
                <Badge variant="watch">1 Security on Watch</Badge>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="text-xs font-bold font-mono text-[var(--text-primary)]">NVDA · NVIDIA Corporation</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">Data Center revenue +28.3% ahead of original assumption</div>
                    </div>
                  </div>
                  <Badge variant="healthy" size="xs">HEALTHY</Badge>
                </div>

                <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-amber-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold font-mono text-[var(--text-primary)]">ASML · ASML Holding N.V.</div>
                      <div className="text-[11px] text-amber-300">Quarterly bookings of €3.9B below €5.0B assumption threshold</div>
                    </div>
                  </div>
                  <Badge variant="watch" size="xs">WATCH</Badge>
                </div>
              </div>

              <div className="p-3 rounded bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center justify-between">
                <span>Tripwire alerts are derived strictly from published financial filings and disclosures.</span>
                <Link href="/app/thesis" className="text-emerald-400 font-medium hover:underline">
                  Open Thesis Monitor →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Research Workflow Section */}
      <section id="workflow" className="py-16 px-4 sm:px-6 bg-[var(--bg-surface)]/50 border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              The 5-Step Institutional Workflow
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
              From systematic discovery to adversarial thesis surveillance, maintain rigorous decision trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "Filter 8,000+ equities across ROIC, FCF yield, debt leverage, and quantitative factor metrics.",
                icon: Search,
                link: "/app/screener",
              },
              {
                step: "02",
                title: "Investigate",
                desc: "Audit 5-year financial statements, forensic accounting checks (Beneish M-Score), and segment risks.",
                icon: FileText,
                link: "/app/research",
              },
              {
                step: "03",
                title: "Value",
                desc: "Stress-test discounted cash flow assumptions with live 2D sensitivity matrices across WACC & terminal growth.",
                icon: Calculator,
                link: "/app/valuation",
              },
              {
                step: "04",
                title: "Debate",
                desc: "Synthesize 5 distinct committee perspectives, contrasting fundamental bulls against bear-case adversaries.",
                icon: Users2,
                link: "/app/committee",
              },
              {
                step: "05",
                title: "Monitor",
                desc: "Establish explicit thesis tripwires that trigger immediate alerts when filing metrics diverge.",
                icon: ShieldCheck,
                link: "/app/thesis",
              },
            ].map((w, idx) => {
              const Icon = w.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {w.step}
                      </span>
                      <Icon className="h-4 w-4 text-[var(--text-muted)] group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                      {w.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {w.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]/50">
                    <Link
                      href={w.link}
                      className="text-[11px] font-medium text-emerald-400 group-hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Product Capabilities Modules */}
      <section id="capabilities" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Platform Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            Integrated quantitative tools replacing fragmented spreadsheets and siloed terminals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-[var(--border-strong)] transition-all">
            <CardHeader>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 w-fit mb-2">
                <PieChart className="h-4 w-4" />
              </div>
              <CardTitle>Portfolio Intelligence</CardTitle>
              <CardDescription>
                Decompose risk into sector, geography, and factor exposures. Measure 1Y Sharpe, Sortino downside deviation, and cross-asset correlation matrices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/portfolio" className="text-xs text-emerald-400 font-medium hover:underline inline-flex items-center gap-1">
                <span>View Portfolio Analytics</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-[var(--border-strong)] transition-all">
            <CardHeader>
              <div className="p-2 rounded bg-sky-950/40 border border-sky-800/50 text-sky-400 w-fit mb-2">
                <Cpu className="h-4 w-4" />
              </div>
              <CardTitle>Quantitative Strategy Lab</CardTitle>
              <CardDescription>
                Backtest point-in-time factor strategies (Dual Momentum, Quality Compounder, Low Volatility) with modeled transaction slippage and trade history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/quant" className="text-xs text-emerald-400 font-medium hover:underline inline-flex items-center gap-1">
                <span>Run Quant Backtests</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-[var(--border-strong)] transition-all">
            <CardHeader>
              <div className="p-2 rounded bg-purple-950/40 border border-purple-800/50 text-purple-400 w-fit mb-2">
                <Sparkles className="h-4 w-4" />
              </div>
              <CardTitle>Research Copilot</CardTitle>
              <CardDescription>
                Contextual AI assistant answering natural language questions about portfolio concentration, thesis tripwires, and DCF sensitivity with exact source citations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/copilot" className="text-xs text-emerald-400 font-medium hover:underline inline-flex items-center gap-1">
                <span>Launch Research Copilot</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. Data Provenance & Methodology Section */}
      <section id="provenance" className="py-16 px-4 sm:px-6 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/60 text-[11px] font-mono mb-2">
                <CheckCircle2 className="h-3 w-3" />
                <span>FINANCIAL DATA INTEGRITY STANDARD</span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Data Provenance & Scientific Rigor
              </h2>
            </div>
            <Link href="/app/settings">
              <Button variant="outline" size="sm" className="text-xs">
                <span>Inspect Data Providers</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <div className="font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>1. Verified External Data</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Raw company financials and statement items are sourced point-in-time from SEC Form 10-K and 10-Q filings with explicit filing dates and period timestamps.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <div className="font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>2. Calculated Mathematical Metrics</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Ratios such as Sharpe, Sortino, ROIC, and HHI Concentration follow standardized quantitative formulas with transparent inputs and zero synthetic substitutions.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <div className="font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span>3. Model-Generated Estimates</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                DCF target valuations and scenario projections are clearly tagged as estimates with full disclosure of discount rate and terminal assumptions.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <div className="font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>4. Demo & Sandbox Environment</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                When live broker connections or streaming feeds are unconfigured, the application maintains a prominent DEMO DATA banner to prevent mistaken execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Primary Call To Action */}
      <section className="py-20 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
          Experience Research-First Investing
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed mb-8">
          Launch the complete investment workspace now. Screen securities, audit valuation models, inspect committee debates, and track your active theses.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/app">
            <Button variant="primary" size="lg" className="text-sm font-semibold">
              <span>Launch Terminal Workspace</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Link href="/app/valuation">
            <Button variant="secondary" size="lg" className="text-sm">
              <span>Test Valuation Laboratory</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* 8. Institutional Footer */}
      <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12 px-4 sm:px-6 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>AI INVESTMENT INTELLIGENCE</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed mb-4">
              Research-first Investment Operating System designed for professional investors, quantitative analysts, and independent allocators.
            </p>
            <div className="font-mono text-[11px] text-[var(--text-muted)]">
              Sandbox Environment: Active · SEC EDGAR Integration Ready
            </div>
          </div>

          <div>
            <div className="font-semibold text-[var(--text-primary)] mb-3">Workspace</div>
            <ul className="space-y-2">
              <li><Link href="/app" className="hover:text-[var(--text-primary)]">Command Center</Link></li>
              <li><Link href="/app/screener" className="hover:text-[var(--text-primary)]">Discovery Screener</Link></li>
              <li><Link href="/app/research" className="hover:text-[var(--text-primary)]">Security Research</Link></li>
              <li><Link href="/app/valuation" className="hover:text-[var(--text-primary)]">Valuation Lab</Link></li>
              <li><Link href="/app/portfolio" className="hover:text-[var(--text-primary)]">Portfolio Analytics</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-[var(--text-primary)] mb-3">Intelligence</div>
            <ul className="space-y-2">
              <li><Link href="/app/committee" className="hover:text-[var(--text-primary)]">Investment Committee</Link></li>
              <li><Link href="/app/thesis" className="hover:text-[var(--text-primary)]">Thesis Health Monitor</Link></li>
              <li><Link href="/app/quant" className="hover:text-[var(--text-primary)]">Quantitative Lab</Link></li>
              <li><Link href="/app/market" className="hover:text-[var(--text-primary)]">Market Intelligence</Link></li>
              <li><Link href="/app/copilot" className="hover:text-[var(--text-primary)]">Research Copilot</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-[var(--text-primary)] mb-3">Disclosures</div>
            <ul className="space-y-2">
              <li><a href="#provenance" className="hover:text-[var(--text-primary)]">Data Provenance</a></li>
              <li><Link href="/app/settings" className="hover:text-[var(--text-primary)]">Broker Sandboxes</Link></li>
              <li><span className="text-[var(--text-muted)]">Not Investment Advice</span></li>
              <li><span className="text-[var(--text-muted)]">Model Disclaimers</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[var(--border-subtle)]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 AI Investment Intelligence Platform. All rights reserved.
          </div>
          <div className="text-[10px] text-[var(--text-muted)] max-w-xl text-center sm:text-right">
            Disclosures: This platform is an analytical software tool for financial research. Modeled valuations, committee debate syntheses, and quantitative simulations are estimates and do not constitute registered investment advice or performance guarantees.
          </div>
        </div>
      </footer>
    </div>
  );
}
