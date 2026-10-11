"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users2,
  Calculator,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AreaLineChart } from "@/components/charts/AreaLineChart";
import { MOCK_PORTFOLIO } from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function MarketingHomePage() {
  const [activePreviewTab, setActivePreviewTab] = useState<"command" | "valuation" | "committee" | "thesis">("command");

  const previewTabs = [
    { id: "command", label: "01. Executive Briefing", icon: Activity },
    { id: "valuation", label: "02. DCF Valuation Lab", icon: Calculator },
    { id: "committee", label: "03. Investment Committee", icon: Users2 },
    { id: "thesis", label: "04. Thesis Surveillance", icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--paper-base)] text-[#121311] flex flex-col selection:bg-[#365CFF] selection:text-white font-sans">
      {/* 1. Header Masthead */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--hairline)] bg-[var(--paper-base)]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-6 w-6 rounded-xs bg-[#111210] text-[#F4F1E9] flex items-center justify-center font-mono font-bold text-xs tracking-tighter">
                AI
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs font-mono uppercase tracking-wider text-[#121311] leading-tight">
                  AI INVESTMENT INTELLIGENCE
                </span>
                <span className="text-[9px] text-[var(--stone-muted)] font-mono tracking-widest leading-none">
                  RESEARCH DESK // ISSUE 04.2
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-[var(--stone-muted)] uppercase tracking-wider">
              <a href="#apparatus" className="hover:text-[#121311] transition-colors">
                Apparatus
              </a>
              <a href="#methodology" className="hover:text-[#121311] transition-colors">
                Methodology
              </a>
              <a href="#committee" className="hover:text-[#121311] transition-colors">
                Committee
              </a>
              <a href="#provenance" className="hover:text-[#121311] transition-colors">
                Data Provenance
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/app">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs font-mono">
                Terminal Login
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="cobalt" size="sm" className="text-xs font-mono">
                <span>Launch Workspace</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Editorial Broadsheet Hero (Asymmetric Swiss Composition) */}
      <section className="border-b border-[var(--hairline)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Bold Typography & Rationale (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--hairline)]">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-xs bg-black/5 border border-[var(--hairline)] text-[10px] font-mono uppercase tracking-widest text-[var(--stone-muted)] mb-6">
                <span>RESEARCH DESK // DISPATCH NO. 04.2</span>
                <span>·</span>
                <span className="text-[#365CFF] font-bold">POINT-IN-TIME FIDELITY</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal tracking-tight text-[#111210] leading-[1.08] mb-6">
                The Capital Allocation <br className="hidden sm:inline" />
                <span className="italic font-serif">Apparatus.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#464841] max-w-xl leading-relaxed mb-8 font-sans">
                A serious research instrument for professional allocators. We unite verified point-in-time SEC EDGAR filings, mathematical Gordon DCF models, adversarial investment committee debate, and continuous thesis surveillance.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/app">
                  <Button variant="primary" size="lg" className="text-xs font-mono font-bold tracking-wider uppercase">
                    <span>Open Terminal Workspace (v2.4)</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
                <Link href="/app/screener">
                  <Button variant="outline" size="lg" className="text-xs font-mono tracking-wider uppercase">
                    <span>Screener Universe</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Micro provenance stamps */}
            <div className="mt-12 pt-6 border-t border-[var(--hairline)] grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <div className="text-[10px] text-[var(--stone-muted)] uppercase">Coverage Universe</div>
                <div className="text-base font-bold text-[#111210] num-tabular mt-0.5">8,400+</div>
                <div className="text-[10px] text-[var(--stone-muted)] mt-0.5">SEC Point-in-Time</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--stone-muted)] uppercase">Model Engine</div>
                <div className="text-base font-bold text-[#365CFF] num-tabular mt-0.5">Gordon DCF</div>
                <div className="text-[10px] text-[var(--stone-muted)] mt-0.5">2D Sensitivity Matrix</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--stone-muted)] uppercase">Committee Inquiry</div>
                <div className="text-base font-bold text-[#111210] num-tabular mt-0.5">5 Perspectives</div>
                <div className="text-[10px] text-[var(--stone-muted)] mt-0.5">Adversarial Consensus</div>
              </div>
            </div>
          </div>

          {/* Right Column: Specimen Research Document Box (5 cols) */}
          <div className="lg:col-span-5 bg-[var(--paper-surface)] p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)] text-xs font-mono">
                <span className="text-[10px] text-[var(--stone-muted)] uppercase tracking-wider">
                  ACTIVE RESEARCH SPECIMEN // NASDAQ: NVDA
                </span>
                <span className="px-1.5 py-0.2 rounded-xs bg-[#D8F36A] text-[#121311] text-[9px] font-bold border border-[#C9E55B]">
                  LIVE ARCHIVE
                </span>
              </div>

              {/* Ticker dossier header */}
              <div className="p-4 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-mono font-bold text-[#111210]">NVDA</span>
                    <span className="text-xs text-[var(--stone-muted)] ml-2">NVIDIA Corporation</span>
                  </div>
                  <div className="text-right num-tabular font-mono">
                    <span className="text-base font-bold text-[#111210]">$138.25</span>
                    <span className="text-xs text-emerald-700 ml-1.5 font-semibold">+3.09%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-2 border-t border-[var(--hairline)] text-center">
                  <div>
                    <span className="text-[var(--stone-muted)] block">CAP</span>
                    <span className="font-bold text-[#111210]">$3.38T</span>
                  </div>
                  <div>
                    <span className="text-[var(--stone-muted)] block">ROIC</span>
                    <span className="font-bold text-emerald-700">68.4%</span>
                  </div>
                  <div>
                    <span className="text-[var(--stone-muted)] block">FCF YLD</span>
                    <span className="font-bold text-[#365CFF]">2.85%</span>
                  </div>
                </div>
              </div>

              {/* Valuation Implied Bridge */}
              <div className="p-4 rounded-xs bg-[#111210] text-[#F4F1E9] space-y-2 border border-[#111210]">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[var(--stone-light)] uppercase tracking-wider">DCF Implied Fair Value</span>
                  <span className="text-[#D8F36A] font-bold">WACC: 9.5% · g: 3.5%</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-mono font-bold text-white num-tabular">$148.50</span>
                  <span className="text-xs font-mono font-bold text-[#D8F36A]">+7.4% vs Spot</span>
                </div>
                <div className="text-[10px] text-[#A3A69C] leading-snug">
                  Consensus Base Case assumes Blackwell shipment volume sustains 58% operating margins.
                </div>
              </div>

              {/* Active Thesis Health */}
              <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)] flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[var(--stone-muted)] uppercase block">Thesis Surveillance</span>
                  <span className="font-semibold text-[#111210]">Hyperscaler CapEx Monitored</span>
                </div>
                <span className="px-2 py-0.5 rounded-xs bg-emerald-700/10 text-emerald-800 border border-emerald-700/30 text-[10px] font-mono font-bold">
                  HEALTHY (0 BREACHES)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--hairline)] flex items-center justify-between text-[11px] font-mono text-[var(--stone-muted)]">
              <span>EDGAR 10-K / Q2 FY26 AUDITED</span>
              <Link href="/app/research" className="text-[#365CFF] hover:underline font-bold">
                Inspect Full Dossier →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Analytical Workbench Showcase */}
      <section id="apparatus" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[var(--hairline)]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--stone-muted)] block mb-1">
              SYSTEM ARCHITECTURE // APPARATUS
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#111210]">
              Interactive Analytical Instruments
            </h2>
          </div>
          <p className="text-xs text-[var(--stone-muted)] font-mono max-w-md">
            Switch between core platform modules below. Live reactive components rendered directly from application source.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
          {previewTabs.map((t) => {
            const Icon = t.icon;
            const active = activePreviewTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActivePreviewTab(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-mono transition-colors whitespace-nowrap cursor-pointer border ${
                  active
                    ? "bg-[#111210] text-[#F4F1E9] border-[#111210] font-bold"
                    : "bg-[var(--paper-surface)] text-[var(--stone-muted)] border-[var(--hairline)] hover:text-[#121311]"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Preview Canvas */}
        <div className="border border-[var(--hairline)] bg-[var(--paper-surface)] p-6 sm:p-8 rounded-xs shadow-xs">
          {activePreviewTab === "command" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--hairline)] pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--stone-muted)]">
                    PORTFOLIO NET ASSET VALUE
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#111210] num-tabular mt-1">
                    {formatCurrency(MOCK_PORTFOLIO.totalValue)}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs font-mono num-tabular">
                  <div>
                    <span className="text-[10px] text-[var(--stone-muted)] block uppercase">1D Alpha vs SPY</span>
                    <span className="text-emerald-700 font-bold">+{formatPercent(MOCK_PORTFOLIO.dayChangePercent)} (+${MOCK_PORTFOLIO.dayChangeDollar.toLocaleString()})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--stone-muted)] block uppercase">Sharpe Ratio</span>
                    <span className="text-[#365CFF] font-bold">{MOCK_PORTFOLIO.sharpeRatio1Y}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--stone-muted)] block uppercase">Max Drawdown</span>
                    <span className="text-rose-700 font-bold">-{MOCK_PORTFOLIO.maxDrawdown1Y}%</span>
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
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--stone-muted)] mb-3 flex items-center justify-between">
                  <span>Core Active Positions</span>
                  <Link href="/app/portfolio" className="text-[#365CFF] hover:underline">
                    View Complete Ledger (7 Positions) →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {MOCK_PORTFOLIO.holdings.slice(0, 3).map((h) => (
                    <div
                      key={h.ticker}
                      className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-xs text-[#111210]">{h.ticker}</div>
                        <div className="text-[11px] text-[var(--stone-muted)] truncate max-w-[120px]">{h.name}</div>
                      </div>
                      <div className="text-right num-tabular font-mono">
                        <div className="text-xs font-semibold text-[#111210]">
                          {formatCurrency(h.currentPrice)}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold">
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
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                <div>
                  <h4 className="text-sm font-mono font-bold text-[#111210] uppercase">
                    Gordon Growth DCF Valuation Model // NASDAQ: NVDA
                  </h4>
                  <p className="text-xs text-[var(--stone-muted)] font-sans">
                    Multi-stage discount engine with 2D WACC and terminal growth sensitivity.
                  </p>
                </div>
                <Badge variant="cobalt" size="xs">Model Estimate</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)]">
                  <div className="text-[10px] font-mono text-[var(--stone-muted)] uppercase">Implied Fair Value</div>
                  <div className="text-2xl font-mono font-bold text-[#111210] num-tabular mt-0.5">$148.50</div>
                  <div className="text-[10px] font-mono text-emerald-700 mt-0.5">+7.4% vs $138.25 Spot</div>
                </div>
                <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)]">
                  <div className="text-[10px] font-mono text-[var(--stone-muted)] uppercase">Modeled WACC</div>
                  <div className="text-2xl font-mono font-bold text-[#365CFF] num-tabular mt-0.5">9.5%</div>
                  <div className="text-[10px] font-mono text-[var(--stone-muted)] mt-0.5">Rf: 4.08% · Beta: 1.68</div>
                </div>
                <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)]">
                  <div className="text-[10px] font-mono text-[var(--stone-muted)] uppercase">Terminal Growth (g)</div>
                  <div className="text-2xl font-mono font-bold text-[#111210] num-tabular mt-0.5">3.5%</div>
                  <div className="text-[10px] font-mono text-[var(--stone-muted)] mt-0.5">Long-Term GDP Floor</div>
                </div>
                <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)]">
                  <div className="text-[10px] font-mono text-[var(--stone-muted)] uppercase">Operating Margin</div>
                  <div className="text-2xl font-mono font-bold text-[#111210] num-tabular mt-0.5">58.0%</div>
                  <div className="text-[10px] font-mono text-[var(--stone-muted)] mt-0.5">Normalized Run Rate</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xs bg-[#111210] text-[#F4F1E9] text-xs font-mono flex items-center justify-between border border-[#111210]">
                <span>2D Sensitivity Matrix across 7 WACC steps is active in the analytical workspace.</span>
                <Link href="/app/valuation" className="text-[#D8F36A] font-bold hover:underline">
                  Launch Valuation Laboratory →
                </Link>
              </div>
            </div>
          )}

          {activePreviewTab === "committee" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                <div>
                  <h4 className="text-sm font-mono font-bold text-[#111210] uppercase">
                    Investment Committee Minutes // NVIDIA Corporation
                  </h4>
                  <p className="text-xs text-[var(--stone-muted)] font-sans">
                    Consensus Verdict: OVERWEIGHT (Score: 82/100) · 5 Independent Inquiries
                  </p>
                </div>
                <Badge variant="lime" size="xs">Overweight (82/100)</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)]">
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="font-bold text-[#111210]">01. Fundamental Analyst</span>
                    <Badge variant="positive" size="xs">STRONG BUY (88%)</Badge>
                  </div>
                  <p className="text-[#464841] leading-relaxed font-sans text-xs">
                    Blackwell order backlog is fully committed for 12 months with non-cancellable terms. Enterprise inference adoption growing 2.4x faster than training demand.
                  </p>
                </div>

                <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)]">
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="font-bold text-[#111210]">04. Bear-Case Adversary</span>
                    <Badge variant="warning" size="xs">CAUTION (74%)</Badge>
                  </div>
                  <p className="text-[#464841] leading-relaxed font-sans text-xs">
                    Customer concentration risk: 4 hyperscalers drive 38% of revenue. If end-user AI ROI stalls, a 25-35% CapEx cut triggers acute semiconductor bullwhip effect.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] text-xs font-mono text-[#111210] border border-[var(--hairline)] flex items-center justify-between">
                <span>Preserves genuine disagreements rather than manufacturing artificial consensus.</span>
                <Link href="/app/committee" className="text-[#365CFF] font-bold hover:underline">
                  Read Full Committee Debate →
                </Link>
              </div>
            </div>
          )}

          {activePreviewTab === "thesis" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                <div>
                  <h4 className="text-sm font-mono font-bold text-[#111210] uppercase">
                    Continuous Thesis Health Surveillance Register
                  </h4>
                  <p className="text-xs text-[var(--stone-muted)] font-sans">
                    Verifies whether original investment assumptions remain supported by filed 10-Q reports.
                  </p>
                </div>
                <Badge variant="watch" size="xs">1 Security on Watch</Badge>
              </div>

              <div className="space-y-2">
                <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    <div>
                      <div className="text-xs font-mono font-bold text-[#111210]">NVDA · NVIDIA Corporation</div>
                      <div className="text-[11px] text-[var(--stone-muted)]">Data Center revenue +28.3% ahead of original assumption</div>
                    </div>
                  </div>
                  <Badge variant="healthy" size="xs">HEALTHY</Badge>
                </div>

                <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-amber-600/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
                    <div>
                      <div className="text-xs font-mono font-bold text-[#111210]">ASML · ASML Holding N.V.</div>
                      <div className="text-[11px] text-amber-800">Quarterly bookings of €3.9B below €5.0B assumption threshold</div>
                    </div>
                  </div>
                  <Badge variant="watch" size="xs">AMBER WATCH</Badge>
                </div>
              </div>

              <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] text-xs font-mono text-[#111210] border border-[var(--hairline)] flex items-center justify-between">
                <span>Tripwire alerts are derived strictly from published financial filings and disclosures.</span>
                <Link href="/app/thesis" className="text-[#365CFF] font-bold hover:underline">
                  Open Thesis Monitor →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Research Workflow Broadsheet (Editorial 5-Step Column Grid) */}
      <section id="methodology" className="py-16 px-4 sm:px-6 bg-[var(--paper-surface)] border-y border-[var(--hairline)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 pb-4 border-b border-[var(--hairline)]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--stone-muted)] block mb-1">
              THE ALLOCATION LIFECYCLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#111210]">
              The 5-Phase Institutional Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 border-l border-[var(--hairline)]">
            {[
              {
                step: "01",
                title: "DISCOVERY",
                desc: "Screen 8,000+ equities across ROIC, free cash flow yield, debt leverage, and factor revisions.",
                link: "/app/screener",
              },
              {
                step: "02",
                title: "AUDIT",
                desc: "5-year financial statement history, Beneish M-Score forensic red flags, and customer concentration.",
                link: "/app/research",
              },
              {
                step: "03",
                title: "VALUATION",
                desc: "Stress-test discounted cash flow assumptions with live 2D sensitivity across WACC and terminal growth.",
                link: "/app/valuation",
              },
              {
                step: "04",
                title: "COMMITTEE",
                desc: "Synthesize 5 distinct analytical inquiries, preserving genuine disagreement points rather than false consensus.",
                link: "/app/committee",
              },
              {
                step: "05",
                title: "SURVEILLANCE",
                desc: "Establish explicit thesis tripwires that trigger immediate amber alerts when filings diverge from targets.",
                link: "/app/thesis",
              },
            ].map((w, idx) => (
              <div
                key={idx}
                className="p-6 border-r border-b md:border-b-0 border-[var(--hairline)] flex flex-col justify-between group hover:bg-[var(--paper-elevated)] transition-colors"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#365CFF] block mb-4">
                    PHASE {w.step}
                  </span>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111210] mb-2">
                    {w.title}
                  </h3>
                  <p className="text-xs text-[#52544C] leading-relaxed font-sans">
                    {w.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-[var(--hairline)]">
                  <Link
                    href={w.link}
                    className="text-[10px] font-mono font-bold text-[#365CFF] group-hover:underline inline-flex items-center gap-1"
                  >
                    <span>EXPLORE APPARATUS</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Data Provenance & Scientific Rigor Manifesto */}
      <section id="provenance" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--stone-muted)] block">
              TAXONOMY & INTEGRITY STANDARD
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#111210]">
              The Four Categories of Financial Data
            </h2>
            <p className="text-xs text-[#52544C] leading-relaxed font-sans">
              Financial interfaces are worthless if figures are fabricated. Every number on this platform belongs to an explicit provenance classification.
            </p>
            <div className="pt-2">
              <Link href="/app/settings">
                <Button variant="outline" size="sm" className="text-xs font-mono">
                  Inspect Data Integrations →
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xs bg-[var(--paper-surface)] border border-[var(--hairline)] space-y-1.5">
              <div className="font-bold text-[#111210] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-700" />
                <span>1. VERIFIED EXTERNAL DATA</span>
              </div>
              <p className="text-[11px] text-[var(--stone-muted)] font-sans leading-relaxed">
                Raw company financials sourced point-in-time from SEC Form 10-K and 10-Q filings with explicit period timestamps.
              </p>
            </div>

            <div className="p-4 rounded-xs bg-[var(--paper-surface)] border border-[var(--hairline)] space-y-1.5">
              <div className="font-bold text-[#111210] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#365CFF]" />
                <span>2. CALCULATED FORMULA METRIC</span>
              </div>
              <p className="text-[11px] text-[var(--stone-muted)] font-sans leading-relaxed">
                Ratios like Sharpe, Sortino, ROIC, and HHI follow transparent mathematical definitions with zero synthetic substitutions.
              </p>
            </div>

            <div className="p-4 rounded-xs bg-[var(--paper-surface)] border border-[var(--hairline)] space-y-1.5">
              <div className="font-bold text-[#111210] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-700" />
                <span>3. MODEL ESTIMATE</span>
              </div>
              <p className="text-[11px] text-[var(--stone-muted)] font-sans leading-relaxed">
                DCF target valuations and scenario projections are clearly tagged as estimates with full disclosure of discount parameters.
              </p>
            </div>

            <div className="p-4 rounded-xs bg-[var(--paper-surface)] border border-[var(--hairline)] space-y-1.5">
              <div className="font-bold text-[#111210] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D8F36A] border border-black/30" />
                <span>4. SANDBOX SIMULATION</span>
              </div>
              <p className="text-[11px] text-[var(--stone-muted)] font-sans leading-relaxed">
                When external broker execution feeds are unconfigured, the application maintains a persistent sandbox banner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Primary Call To Action */}
      <section className="py-20 px-4 sm:px-6 bg-[#111210] text-[#F4F1E9] border-t border-[#111210]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A3A69C]">
            CAPITAL ALLOCATION APPARATUS // BUILD 2.4
          </span>
          <h2 className="text-3xl sm:text-5xl font-editorial font-normal tracking-tight text-white">
            Experience Research-First Investing.
          </h2>
          <p className="text-xs sm:text-sm text-[#A3A69C] max-w-xl mx-auto leading-relaxed font-sans">
            Launch the complete investment workspace now. Screen securities, audit valuation models, inspect committee debates, and track active investment theses.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/app">
              <Button variant="cobalt" size="lg" className="text-xs font-mono font-bold uppercase tracking-wider">
                <span>Launch Terminal Workspace</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/app/valuation">
              <Button variant="outline" size="lg" className="text-xs font-mono text-white border-white/30 hover:bg-white/10 uppercase tracking-wider">
                <span>Test Valuation Laboratory</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Institutional Broadsheet Footer */}
      <footer className="border-t border-[var(--hairline)] bg-[var(--paper-base)] py-12 px-4 sm:px-6 text-xs text-[var(--stone-muted)] font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 space-y-3 font-sans">
            <div className="flex items-center gap-2 font-mono font-bold text-xs text-[#111210] uppercase">
              <span className="h-4 w-4 rounded-xs bg-[#111210] text-white flex items-center justify-center text-[10px]">AI</span>
              <span>AI INVESTMENT INTELLIGENCE</span>
            </div>
            <p className="text-xs text-[#52544C] max-w-sm leading-relaxed">
              Research-first Investment Operating System designed for professional allocators, quantitative analysts, and independent asset managers.
            </p>
            <div className="font-mono text-[10px] text-[var(--stone-muted)]">
              Sandbox Environment Active · SEC EDGAR Integration Ready
            </div>
          </div>

          <div>
            <div className="font-bold text-[#111210] uppercase text-[10px] mb-3">Workspace</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/app" className="hover:text-[#111210]">01. Command Center</Link></li>
              <li><Link href="/app/screener" className="hover:text-[#111210]">02. Discovery Screener</Link></li>
              <li><Link href="/app/research" className="hover:text-[#111210]">03. Security Research</Link></li>
              <li><Link href="/app/valuation" className="hover:text-[#111210]">04. Valuation Lab</Link></li>
              <li><Link href="/app/portfolio" className="hover:text-[#111210]">05. Portfolio Risk</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-[#111210] uppercase text-[10px] mb-3">Intelligence</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/app/committee" className="hover:text-[#111210]">06. Committee Dossier</Link></li>
              <li><Link href="/app/thesis" className="hover:text-[#111210]">07. Thesis Monitor</Link></li>
              <li><Link href="/app/quant" className="hover:text-[#111210]">08. Quantitative Lab</Link></li>
              <li><Link href="/app/market" className="hover:text-[#111210]">09. Market Briefing</Link></li>
              <li><Link href="/app/copilot" className="hover:text-[#111210]">10. Research Copilot</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-[#111210] uppercase text-[10px] mb-3">Disclosures</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#provenance" className="hover:text-[#111210]">Data Provenance</a></li>
              <li><Link href="/app/settings" className="hover:text-[#111210]">Broker Sandboxes</Link></li>
              <li><span>Not Investment Advice</span></li>
              <li><span>Model Sensitivity</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[var(--hairline)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <div>
            © 2026 AI Investment Intelligence. Swiss Editorial Publication Format.
          </div>
          <div className="max-w-md text-right text-[var(--stone-muted)] font-sans text-[10px]">
            Disclaimer: Modeled valuations, committee debate syntheses, and quantitative backtests are theoretical estimations and do not constitute registered investment advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
