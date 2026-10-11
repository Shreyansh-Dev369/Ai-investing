"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users2,
  Calculator,
  Activity,
  Terminal,
  Sparkles,
  Sliders,
  CheckCircle2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AreaLineChart } from "@/components/charts/AreaLineChart";
import { MOCK_PORTFOLIO } from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ApparatusPreloader } from "@/components/ui/ApparatusPreloader";
import { OrderModal } from "@/components/trading/OrderModal";
import { BROKER_REGISTRY } from "@/lib/brokerRegistry";

export default function MarketingHomePage() {
  const [forceShowPreloader, setForceShowPreloader] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"command" | "valuation" | "committee" | "thesis" | "extension">("command");

  // Interactive Live DCF Model state
  const [growthRate, setGrowthRate] = useState<number>(25); // %
  const [waccRate, setWaccRate] = useState<number>(9.5); // %
  const [marginRate, setMarginRate] = useState<number>(58); // %

  // Dynamic DCF Implied Calculation
  const dcfCalculation = useMemo(() => {
    // Current NVDA Base Metrics: $138.25 spot, 24.6B shares, Base Revenue $120B
    const spotPrice = 138.25;
    const baseRev = 120; // $B
    const shares = 24.6; // B shares
    const terminalGrowth = 0.035; // 3.5%

    // Project 5 years
    let sumPvFcf = 0;
    let projRev = baseRev;
    for (let yr = 1; yr <= 5; yr++) {
      projRev = projRev * (1 + growthRate / 100);
      const fcf = projRev * (marginRate / 100) * 0.78; // Operating cash flow after 22% tax/reinvestment
      const discountFactor = Math.pow(1 + waccRate / 100, yr);
      sumPvFcf += fcf / discountFactor;
    }

    const yr5Fcf = projRev * (marginRate / 100) * 0.78;
    const terminalVal = (yr5Fcf * (1 + terminalGrowth)) / Math.max(0.01, (waccRate / 100) - terminalGrowth);
    const pvTerminalVal = terminalVal / Math.pow(1 + waccRate / 100, 5);

    const enterpriseVal = sumPvFcf + pvTerminalVal;
    const equityVal = enterpriseVal + 28 - 10; // +$28B net cash/debt adjustment
    const impliedPrice = Math.max(10, Math.round((equityVal / shares) * 100) / 100);
    const upsidePct = Math.round(((impliedPrice - spotPrice) / spotPrice) * 1000) / 10;

    return {
      impliedPrice,
      upsidePct,
      enterpriseVal: Math.round(enterpriseVal),
      isUndervalued: upsidePct > 0,
    };
  }, [growthRate, waccRate, marginRate]);

  // Active broker selection showcase
  const [selectedBrokerRegion, setSelectedBrokerRegion] = useState<"ALL" | "IN" | "US">("ALL");

  const filteredBrokers = useMemo(() => {
    if (selectedBrokerRegion === "IN") return BROKER_REGISTRY.filter((b) => b.supportedRegions[0].includes("India"));
    if (selectedBrokerRegion === "US") return BROKER_REGISTRY.filter((b) => b.supportedRegions[0].includes("United States") || b.supportedRegions[0].includes("Global"));
    return BROKER_REGISTRY;
  }, [selectedBrokerRegion]);

  const previewTabs = [
    { id: "command", label: "01. Executive Briefing", icon: Activity },
    { id: "valuation", label: "02. DCF Valuation Lab", icon: Calculator },
    { id: "committee", label: "03. Investment Committee", icon: Users2 },
    { id: "thesis", label: "04. Thesis Surveillance", icon: ShieldCheck },
    { id: "extension", label: "05. Browser Companion (MV3)", icon: Sparkles },
  ] as const;

  const tickerTapeSecurities = [
    { ticker: "NVDA", price: "$128.40", change: "+3.12%", dcf: "$144.20", upside: "+12.3%", status: "HEALTHY" },
    { ticker: "MSFT", price: "$442.10", change: "+1.45%", dcf: "$485.00", upside: "+9.7%", status: "HEALTHY" },
    { ticker: "ASML", price: "$760.30", change: "-1.82%", dcf: "$840.00", upside: "+10.5%", status: "WATCH" },
    { ticker: "TSM", price: "$188.50", change: "+2.65%", dcf: "$220.00", upside: "+16.7%", status: "HEALTHY" },
    { ticker: "TCS.NS", price: "₹4,210.00", change: "+1.25%", dcf: "₹4,680.00", upside: "+11.2%", status: "HEALTHY" },
    { ticker: "LLY", price: "$884.20", change: "+2.10%", dcf: "$960.00", upside: "+8.6%", status: "HEALTHY" },
    { ticker: "GOOGL", price: "$164.20", change: "+0.85%", dcf: "$195.00", upside: "+18.8%", status: "HEALTHY" },
    { ticker: "AAPL", price: "$224.50", change: "+1.15%", dcf: "$242.00", upside: "+7.8%", status: "HEALTHY" },
  ];

  return (
    <div className="min-h-screen bg-[var(--paper-base)] text-[#121311] flex flex-col selection:bg-[#365CFF] selection:text-white font-sans">
      {/* 0. Sovereign Preloader */}
      <ApparatusPreloader
        forceShow={forceShowPreloader}
        onComplete={() => setForceShowPreloader(false)}
      />

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

            <nav className="hidden md:flex items-center gap-5 text-xs font-mono text-[var(--stone-muted)] uppercase tracking-wider">
              <a href="#apparatus" className="hover:text-[#121311] transition-colors">
                Apparatus
              </a>
              <a href="#dcf-sandbox" className="hover:text-[#121311] transition-colors">
                DCF Engine
              </a>
              <a href="#extension" className="hover:text-[#365CFF] transition-colors flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
                Companion MV3
              </a>
              <a href="#brokers" className="hover:text-[#121311] transition-colors">
                Broker Gateways
              </a>
              <a href="#provenance" className="hover:text-[#121311] transition-colors">
                Data Provenance
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Replay Preloader Trigger */}
            <button
              type="button"
              onClick={() => setForceShowPreloader(true)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xs border border-[var(--hairline)] hover:border-[#111210] text-[10px] font-mono text-[var(--stone-muted)] hover:text-[#111210] transition-colors cursor-pointer"
              title="Re-run terminal calibration sequence"
            >
              <Terminal className="h-3 w-3 text-[#365CFF]" />
              <span>Boot Telemetry</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-[var(--hairline)] bg-[var(--paper-surface)] hover:bg-[var(--paper-elevated)] text-xs font-mono text-[#111210] transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span>Order Slip (Sandbox)</span>
            </button>

            <Link href="/app">
              <Button variant="cobalt" size="sm" className="text-xs font-mono shadow-sm">
                <span>Launch Workspace</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Real-Time Editorial Ticker Tape */}
      <div className="border-b border-[var(--hairline)] bg-[#111210] text-[#F4F1E9] overflow-x-auto scrollbar-none py-2 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center gap-6 shrink-0 whitespace-nowrap">
          <div className="flex items-center gap-1.5 text-[10px] text-[#D8F36A] font-bold uppercase tracking-wider shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D8F36A] animate-ping" />
            <span>COVERAGE SPECIMENS:</span>
          </div>

          <div className="flex items-center gap-6 divide-x divide-[#2A2D27]">
            {tickerTapeSecurities.map((item) => (
              <Link
                key={item.ticker}
                href={`/app/research?ticker=${item.ticker}`}
                className="pl-6 first:pl-0 flex items-center gap-2 hover:text-[#D8F36A] transition-colors"
              >
                <span className="font-bold text-white">{item.ticker}</span>
                <span className="text-[#A3A69C]">{item.price}</span>
                <span className={item.change.startsWith("+") ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                  {item.change}
                </span>
                <span className="text-[10px] text-[#365CFF] bg-[#365CFF]/10 px-1 py-0.2 rounded border border-[#365CFF]/30">
                  DCF {item.dcf} ({item.upside})
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Editorial Broadsheet Hero (Asymmetric Swiss Composition) */}
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
                A serious research instrument for professional allocators. We unite verified point-in-time SEC EDGAR filings, mathematical Gordon DCF models, adversarial investment committee debate, safe broker execution, and continuous browser-wide surveillance.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/app">
                  <Button variant="primary" size="lg" className="text-xs font-mono font-bold tracking-wider uppercase">
                    <span>Open Terminal Workspace (v2.4)</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="px-4 py-2.5 rounded-xs border border-[var(--hairline)] bg-[var(--paper-surface)] hover:bg-[var(--paper-elevated)] text-xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>Simulate Order Ticket</span>
                </button>
                <a
                  href="#extension"
                  className="px-4 py-2.5 rounded-xs border border-[#365CFF]/30 bg-[#365CFF]/5 hover:bg-[#365CFF]/10 text-xs font-mono font-bold text-[#365CFF] tracking-wider uppercase transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Get Extension (MV3)</span>
                </a>
              </div>
            </div>

            {/* Micro provenance stamps */}
            <div className="mt-12 pt-6 border-t border-[var(--hairline)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
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
                <div className="text-[10px] text-[var(--stone-muted)] uppercase">Broker Gateways</div>
                <div className="text-base font-bold text-emerald-700 num-tabular mt-0.5">4 Active</div>
                <div className="text-[10px] text-[var(--stone-muted)] mt-0.5">Groww, Alpaca, IBKR</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--stone-muted)] uppercase">Browser Extension</div>
                <div className="text-base font-bold text-[#111210] num-tabular mt-0.5">Manifest V3</div>
                <div className="text-[10px] text-[var(--stone-muted)] mt-0.5">Yahoo, Groww, SEC</div>
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
              <Link href="/app/research?ticker=NVDA" className="text-[#365CFF] hover:underline font-bold">
                Inspect Full Dossier →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Live DCF Model Sandbox on the Landing Page */}
      <section id="dcf-sandbox" className="py-16 px-4 sm:px-6 bg-[#111210] text-[#F4F1E9] border-b border-[#111210]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2A2D27] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-xs bg-[#D8F36A]/10 text-[#D8F36A] border border-[#D8F36A]/30 text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                <Calculator className="h-3.5 w-3.5" />
                <span>LIVE MATHEMATICAL SOLVER</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-editorial font-normal text-white">
                Interactive Intrinsic DCF Valuation Sandbox
              </h2>
            </div>
            <p className="text-xs text-[#A3A69C] font-mono max-w-md leading-relaxed">
              Adjust parameters below to see how changes in revenue growth, WACC, and operating margin recalibrate fair value in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls: Sliders (5 cols) */}
            <div className="lg:col-span-5 space-y-6 bg-[#181916] p-6 rounded-xs border border-[#2A2D27]">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2D27] text-xs font-mono">
                <span className="text-[#A3A69C] uppercase font-bold flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#365CFF]" /> Parameter Sensitivity
                </span>
                <span className="text-[10px] text-[#D8F36A]">RECALCULATING LIVE</span>
              </div>

              {/* Slider 1: Revenue Growth */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A3A69C]">YoY Revenue Growth Rate</span>
                  <span className="text-[#D8F36A] font-bold num-tabular">{growthRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(parseInt(e.target.value))}
                  className="w-full accent-[#365CFF] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#7E8079]">
                  <span>Conservative: 10%</span>
                  <span>Hypergrowth: 50%</span>
                </div>
              </div>

              {/* Slider 2: WACC Discount Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A3A69C]">Discount Rate (WACC)</span>
                  <span className="text-[#365CFF] font-bold num-tabular">{waccRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="7.5"
                  max="13.0"
                  step="0.1"
                  value={waccRate}
                  onChange={(e) => setWaccRate(parseFloat(e.target.value))}
                  className="w-full accent-[#365CFF] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#7E8079]">
                  <span>Low Risk: 7.5%</span>
                  <span>High Risk: 13.0%</span>
                </div>
              </div>

              {/* Slider 3: Operating Margin */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A3A69C]">Normalized Operating Margin</span>
                  <span className="text-white font-bold num-tabular">{marginRate}%</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="70"
                  step="1"
                  value={marginRate}
                  onChange={(e) => setMarginRate(parseInt(e.target.value))}
                  className="w-full accent-[#365CFF] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#7E8079]">
                  <span>Cyclical: 35%</span>
                  <span>Monopoly: 70%</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-mono text-[#7E8079] leading-relaxed">
                Formula: <code className="text-[#A3A69C]">Equity Value = Σ PV(FCF 1..5) + [FCF₅·(1+g)] / (WACC - g) + Net Cash</code>
              </div>
            </div>

            {/* Right Output: Real-Time Valuation Bridge (7 cols) */}
            <div className="lg:col-span-7 bg-[#181916] p-6 sm:p-8 rounded-xs border border-[#2A2D27] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#2A2D27] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#7E8079] uppercase tracking-wider block">
                    VALUATION RESULT FOR NVIDIA CORP (NASDAQ: NVDA)
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-mono font-bold text-white num-tabular">
                      ${dcfCalculation.impliedPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-mono text-[#7E8079]">
                      vs $138.25 Spot
                    </span>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-xs font-mono text-sm font-bold border ${
                  dcfCalculation.isUndervalued
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}>
                  {dcfCalculation.upsidePct >= 0 ? "+" : ""}{dcfCalculation.upsidePct}% {dcfCalculation.isUndervalued ? "INTRINSIC UPSIDE" : "OVERVALUED"}
                </div>
              </div>

              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xs bg-[#111210] border border-[#2A2D27]">
                  <span className="text-[#7E8079] text-[10px] block uppercase">Enterprise Value</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">${dcfCalculation.enterpriseVal}B</span>
                </div>
                <div className="p-3 rounded-xs bg-[#111210] border border-[#2A2D27]">
                  <span className="text-[#7E8079] text-[10px] block uppercase">Terminal Growth (g)</span>
                  <span className="text-lg font-bold text-[#D8F36A] mt-0.5 block">3.5% (GDP Floor)</span>
                </div>
                <div className="p-3 rounded-xs bg-[#111210] border border-[#2A2D27] col-span-2 sm:col-span-1">
                  <span className="text-[#7E8079] text-[10px] block uppercase">Equity Shares</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">24.6B Diluted</span>
                </div>
              </div>

              {/* Explanatory Callout */}
              <div className="p-4 rounded-xs bg-[#111210] border border-[#2A2D27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-[#A3A69C] leading-relaxed">
                  Ready to test with full 2D sensitivity across 7 WACC steps and stress-test bear scenarios?
                </div>
                <Link href="/app/valuation?ticker=NVDA">
                  <Button variant="cobalt" size="sm" className="text-xs font-mono whitespace-nowrap">
                    <span>Full Valuation Lab</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Companion Browser Extension Feature Showcase (Chrome MV3) */}
      <section id="extension" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-b border-[var(--hairline)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Description (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-xs bg-[#365CFF]/10 text-[#365CFF] border border-[#365CFF]/30 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>CHROME MANIFEST V3 COMPANION EXTENSION</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-editorial font-normal text-[#111210] leading-tight">
              Institutional Intelligence Everywhere You Browse.
            </h2>

            <p className="text-sm text-[#464841] leading-relaxed font-sans">
              Add continuous fundamental intelligence directly to your browsing workflow. The companion extension recognizes securities on supported financial websites and instantly delivers intrinsic DCF valuations, operational tripwires, and 1-click watchlist sync.
            </p>

            {/* Supported Sites Chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[var(--stone-muted)] uppercase tracking-wider block">
                Automatic Recognition On:
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {["Yahoo Finance", "Groww (IN)", "Google Finance", "TradingView", "SEC EDGAR"].map((site) => (
                  <span key={site} className="px-2.5 py-1 rounded-xs bg-[var(--paper-surface)] border border-[var(--hairline)] text-[#111210] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#365CFF]" />
                    {site}
                  </span>
                ))}
              </div>
            </div>

            {/* Security & Installation Guarantee */}
            <div className="p-4 rounded-xs bg-[var(--paper-surface)] border border-[var(--hairline)] space-y-2 text-xs">
              <div className="font-mono font-bold text-[#111210] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Zero Password Storage & Complete Client Privacy
              </div>
              <p className="text-[#585A52] text-[11px] leading-relaxed font-sans">
                The extension complies strictly with Chrome Web Store MV3 policy (<code className="font-mono">script-src &apos;self&apos;</code>). It runs completely locally, never captures private banking passwords, and never scrapes private account balances.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/app/settings">
                <Button variant="cobalt" size="md" className="text-xs font-mono font-bold">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>How to Install Unpacked Extension</span>
                </Button>
              </Link>
              <Link href="/app">
                <Button variant="outline" size="md" className="text-xs font-mono">
                  <span>Open Web Workspace</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Simulation: Browser Tab with Extension Popup Docked (6 cols) */}
          <div className="lg:col-span-6 bg-[#111210] p-4 sm:p-6 rounded-md shadow-2xl border border-[#2A2D27] text-white space-y-4">
            {/* Fake Browser Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2D27] text-xs font-mono text-[#7E8079]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-[10px] ml-2 text-[#A3A69C] truncate max-w-[200px]">
                  https://finance.yahoo.com/quote/NVDA
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#365CFF] text-white text-[10px] font-bold">
                NVDA ACTIVE
              </span>
            </div>

            {/* Extension Popup Specimen Box */}
            <div className="bg-[var(--paper-base)] text-[#111210] p-4 rounded-sm border border-[var(--hairline)] space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2 font-mono">
                <div className="flex items-center gap-1.5 font-bold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-[#365CFF]" />
                  <span>AI INVESTMENT INTELLIGENCE</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">
                  Recognized: Yahoo Finance
                </span>
              </div>

              {/* Ticker header */}
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold font-mono text-[#365CFF]">NVDA</span>
                  <span className="text-xs text-[#7E8079] ml-1.5">NVIDIA Corporation</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-sm">$128.40</span>
                  <span className="text-emerald-700 text-[10px] font-bold ml-1">+3.12%</span>
                </div>
              </div>

              {/* DCF Gauge in Extension */}
              <div className="p-2.5 rounded bg-[var(--paper-surface)] border border-[var(--hairline)] flex items-center justify-between font-mono text-[11px]">
                <div>
                  <span className="text-[9px] text-[#7E8079] block uppercase">Intrinsic Fair Value</span>
                  <span className="font-bold text-[#111210]">$144.20 / share</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-700/10 text-emerald-800 border border-emerald-700/30 text-[10px] font-bold">
                  +12.3% UPSIDE
                </span>
              </div>

              {/* Thesis text */}
              <p className="text-[11px] text-[#52544C] leading-snug">
                CUDA ecosystem lock-in with Blackwell B200 hyperscaler commitments sustaining 75%+ hardware gross margins.
              </p>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="py-1.5 px-2 rounded bg-[#365CFF] text-white font-bold hover:bg-[#2545d8] transition-colors text-center cursor-pointer"
                >
                  Simulate Order ⚡
                </button>
                <Link
                  href="/app/research?ticker=NVDA"
                  className="py-1.5 px-2 rounded bg-[var(--paper-surface)] border border-[var(--hairline)] text-[#111210] font-bold hover:bg-[var(--paper-elevated)] transition-colors text-center"
                >
                  Full Memo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Multi-Broker Capability Registry Showcase */}
      <section id="brokers" className="py-16 px-4 sm:px-6 bg-[var(--paper-surface)] border-b border-[var(--hairline)]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--hairline)] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--stone-muted)] block mb-1">
                INSTITUTIONAL EXECUTION GATEWAYS
              </span>
              <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#111210]">
                Supported Broker Integrations & Guardrails
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[var(--stone-muted)] uppercase">Filter Region:</span>
              <div className="flex rounded border border-[var(--hairline)] p-0.5 bg-[var(--paper-base)] text-xs font-mono">
                {(["ALL", "US", "IN"] as const).map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setSelectedBrokerRegion(reg)}
                    className={`px-2.5 py-0.5 rounded-xs transition-colors cursor-pointer ${
                      selectedBrokerRegion === reg
                        ? "bg-[#111210] text-white font-bold"
                        : "text-[var(--stone-muted)] hover:text-[#111210]"
                    }`}
                  >
                    {reg === "ALL" ? "All Markets" : reg === "US" ? "US & Global" : "India (NSE/BSE)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Broker Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {filteredBrokers.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-xs bg-[var(--paper-base)] border border-[var(--hairline)] flex flex-col justify-between space-y-4 hover:border-[#365CFF] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-bold text-sm text-[#111210]">{b.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 font-bold">
                      {b.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--stone-muted)] font-sans mb-3 leading-relaxed">
                    {b.capabilities.notes}
                  </p>

                  <div className="space-y-1 text-[10px] text-[#52544C] pt-2 border-t border-[var(--hairline)]">
                    <div><strong>Jurisdiction:</strong> {b.capabilities.regulatoryJurisdiction}</div>
                    <div><strong>Auth Mode:</strong> {b.capabilities.authType}</div>
                    <div><strong>Currencies:</strong> {b.currencies.join(", ")}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full py-1.5 rounded-xs bg-[#111210] text-[#F4F1E9] text-[11px] font-bold hover:bg-[#242621] transition-colors text-center cursor-pointer"
                >
                  Test {b.shortName} Sandbox Ticket →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Interactive Analytical Workbench Showcase */}
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

          {activePreviewTab === "extension" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                <div>
                  <h4 className="text-sm font-mono font-bold text-[#111210] uppercase">
                    Browser Extension Telemetry & Ticker Detection
                  </h4>
                  <p className="text-xs text-[var(--stone-muted)] font-sans">
                    Runs inside Chrome / Edge / Brave with zero external script dependencies.
                  </p>
                </div>
                <Badge variant="cobalt" size="xs">Manifest V3</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-4 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)] space-y-1.5">
                  <span className="text-[#365CFF] font-bold">01. Ticker Recognition</span>
                  <p className="text-[#52544C] text-[11px] font-sans">
                    Instantly extracts symbols from Yahoo Finance, Groww, TradingView, Google Finance, and SEC EDGAR.
                  </p>
                </div>
                <div className="p-4 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)] space-y-1.5">
                  <span className="text-emerald-700 font-bold">02. DCF Upside Comparison</span>
                  <p className="text-[#52544C] text-[11px] font-sans">
                    Directly contrasts live market spot quotes with multi-stage discounted cash flow intrinsic estimates.
                  </p>
                </div>
                <div className="p-4 rounded-xs bg-[var(--paper-elevated)] border border-[var(--hairline)] space-y-1.5">
                  <span className="text-[#111210] font-bold">03. 1-Click Sync</span>
                  <p className="text-[#52544C] text-[11px] font-sans">
                    Save discovered securities into your shared research watchlist or jump into the order slip.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xs bg-[#111210] text-[#F4F1E9] text-xs font-mono flex items-center justify-between border border-[#111210]">
                <span>Load extension from the local repository in 3 clicks under Developer mode.</span>
                <a href="#extension" className="text-[#D8F36A] font-bold hover:underline">
                  View Installation Protocol →
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. Data Provenance & Scientific Rigor Manifesto */}
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

      {/* 9. Primary Call To Action */}
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
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className="px-6 py-3 rounded-xs border border-white/30 text-white hover:bg-white/10 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Test Sandbox Order Ticket</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. Institutional Broadsheet Footer */}
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
              <li><button type="button" onClick={() => setForceShowPreloader(true)} className="text-[#365CFF] hover:underline cursor-pointer">Replay Boot Sequence</button></li>
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

      {/* Pre-trade Order Modal on Marketing Page */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        ticker="NVDA"
        companyName="NVIDIA Corporation"
        spotPrice={138.25}
      />
    </div>
  );
}
