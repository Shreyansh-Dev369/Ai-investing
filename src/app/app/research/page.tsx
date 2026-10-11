"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Calculator,
  Users2,
  CheckCircle2,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MOCK_SECURITIES, MOCK_RESEARCH_NVDA } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { AreaLineChart } from "@/components/charts/AreaLineChart";
import { formatCurrency, formatPercent } from "@/lib/utils";

import { Suspense } from "react";

function SecurityResearchContent() {
  const searchParams = useSearchParams();
  const tickerFromUrl = searchParams.get("ticker");

  const {
    activeResearchTicker,
    setActiveResearchTicker,
    watchlist,
    toggleWatchlist,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<"overview" | "financials" | "forensic" | "peers">("overview");
  const [researchNotes, setResearchNotes] = useState(
    "Blackwell B200 deployment remains on schedule. CoWoS packaging allocation secured with TSMC. Monitoring customer concentration across top 4 hyperscalers (currently 38%)."
  );
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    if (tickerFromUrl && tickerFromUrl !== activeResearchTicker) {
      setActiveResearchTicker(tickerFromUrl);
    }
  }, [tickerFromUrl, activeResearchTicker, setActiveResearchTicker]);

  const currentSecurity =
    MOCK_SECURITIES.find((s) => s.ticker === activeResearchTicker) || MOCK_SECURITIES[0];

  const detail = MOCK_RESEARCH_NVDA;
  const isSavedToWatchlist = watchlist.includes(currentSecurity.ticker);

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const tickersList = ["NVDA", "MSFT", "ASML", "LLY", "TSM", "GOOGL"];

  return (
    <div className="space-y-8">
      {/* Editorial Memo Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>ARCHIVE REF: SEC-{currentSecurity.ticker}-2026</span>
            <span>·</span>
            <span>EQUITY RESEARCH MEMORANDUM</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              AUDITED 10-K FILING
            </span>
            <DataProvenanceBadge
              type="VERIFIED_EXTERNAL"
              source="SEC Form 10-K"
              timestamp="FY2025"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs px-2 py-0.5 bg-[#365CFF]/10 text-[#365CFF] border border-[#365CFF]/30">
                {detail.exchange}:{currentSecurity.ticker}
              </span>
              <Badge
                variant={
                  currentSecurity.thesisStatus === "HEALTHY"
                    ? "healthy"
                    : currentSecurity.thesisStatus === "WATCH"
                    ? "watch"
                    : "at-risk"
                }
                size="xs"
              >
                Thesis: {currentSecurity.thesisStatus}
              </Badge>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight mt-1.5">
              {currentSecurity.name}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              {detail.description}
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/app/valuation?ticker=${currentSecurity.ticker}`}>
              <Button variant="outline" size="sm" className="text-xs font-mono gap-1.5">
                <Calculator className="h-3.5 w-3.5 text-[#365CFF]" />
                <span>DCF Model</span>
              </Button>
            </Link>
            <Link href={`/app/committee?ticker=${currentSecurity.ticker}`}>
              <Button variant="outline" size="sm" className="text-xs font-mono gap-1.5">
                <Users2 className="h-3.5 w-3.5 text-[#365CFF]" />
                <span>Committee Debrief</span>
              </Button>
            </Link>
            <button
              onClick={() => toggleWatchlist(currentSecurity.ticker)}
              className={`p-2 border border-[var(--hairline)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer ${
                isSavedToWatchlist ? "text-amber-500" : "text-[var(--text-muted)]"
              }`}
              title={isSavedToWatchlist ? "Saved to watchlist" : "Add to watchlist"}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Security Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 border border-[var(--hairline)] bg-[var(--bg-surface)] text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mr-1">
            COVERAGE TICKER:
          </span>
          {tickersList.map((t) => (
            <button
              key={t}
              onClick={() => setActiveResearchTicker(t)}
              className={`px-3 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer border ${
                activeResearchTicker === t
                  ? "bg-[#111210] dark:bg-[#F4F1E9] text-[#F4F1E9] dark:text-[#111210] border-transparent"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--hairline)] hover:border-[#365CFF] hover:text-[#365CFF]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--text-muted)]">
          <span>HQ: {detail.headquarters}</span>
          <span>·</span>
          <span>CEO: {detail.ceo}</span>
        </div>
      </div>

      {/* Pricing & Key Fundamentals Schedule */}
      <div className="border border-[var(--hairline)] bg-[var(--bg-surface)] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[var(--hairline)] num-tabular">
        <div className="p-4 space-y-1">
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            SPOT QUOTE
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
            {formatCurrency(currentSecurity.price)}
          </div>
          <div
            className={`font-mono text-xs font-semibold ${
              currentSecurity.changePercent >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formatPercent(currentSecurity.changePercent, true)}
          </div>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            MARKET CAP
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
            ${currentSecurity.marketCap}B
          </div>
          <div className="text-[11px] font-mono text-[var(--text-muted)]">Large-Cap Tech</div>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            TRAILING P/E
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
            {currentSecurity.peRatio}x
          </div>
          <div className="text-[11px] font-mono text-[var(--text-muted)]">Forward: 28.4x</div>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            ROIC (MOAT)
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {currentSecurity.roic}%
          </div>
          <div className="text-[11px] font-mono text-[var(--text-muted)]">WACC: 9.5%</div>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            FCF YIELD
          </div>
          <div className="text-xl font-bold font-mono text-[#365CFF]">
            {currentSecurity.fcfYield}%
          </div>
          <div className="text-[11px] font-mono text-[var(--text-muted)]">FCF/EV: 3.1%</div>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            REV GROWTH
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            +{currentSecurity.revenueGrowth}%
          </div>
          <div className="text-[11px] font-mono text-[var(--text-muted)]">YoY Trailing</div>
        </div>
      </div>

      {/* Historical Performance Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              FIGURE 2.0 · TRAILING TRAJECTORY
            </div>
            <CardTitle className="font-serif text-lg font-normal mt-0.5">
              {currentSecurity.ticker} Relative Price Trajectory
            </CardTitle>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Historical adjusted close indexed against S&P 500 benchmark
            </p>
          </div>
          <Badge variant="provenance">Adjusted Close · Splits Included</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <AreaLineChart
            data={[
              { date: "2024-01", value: 54.0, benchmark: 100 },
              { date: "2024-04", value: 88.0, benchmark: 107 },
              { date: "2024-07", value: 124.0, benchmark: 114 },
              { date: "2024-10", value: 138.25, benchmark: 120 },
              { date: "2025-01", value: 142.0, benchmark: 125 },
              { date: "2025-04", value: 132.0, benchmark: 126 },
              { date: "2025-07", value: 154.0, benchmark: 132 },
              { date: "2025-10", value: 172.0, benchmark: 139 },
              { date: "2026-01", value: 185.0, benchmark: 144 },
              { date: "2026-04", value: 198.0, benchmark: 148 },
            ]}
            primaryLabel={`${currentSecurity.ticker} Price`}
            benchmarkLabel="S&P 500 (SPY)"
            height={220}
            isCurrency={true}
          />
        </CardContent>
      </Card>

      {/* Swiss Numbered Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--hairline)] overflow-x-auto text-xs font-mono">
        {[
          { id: "overview", label: "01. SCENARIOS & THESIS" },
          { id: "financials", label: "02. FINANCIAL STATEMENTS (5-YR)" },
          { id: "forensic", label: "03. FORENSIC ACCOUNTING AUDIT" },
          { id: "peers", label: "04. PEER MULTIPLES" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as "overview" | "financials" | "forensic" | "peers")}
            className={`px-4 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === t.id
                ? "border-[#365CFF] text-[#365CFF] font-semibold bg-[var(--bg-surface)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Scenarios & Thesis */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Bull, Base, Bear Scenarios Broadsheet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bull Case */}
            <div className="border border-[var(--hairline)] bg-[var(--bg-surface)] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Bull Case ({detail.bullCase.probability}% Prob)
                </span>
                <span className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 num-tabular">
                  ${detail.bullCase.targetPrice.toFixed(2)}
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                {detail.bullCase.catalysts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">■</span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Base Case */}
            <div className="border border-[var(--hairline)] bg-[var(--bg-surface)] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
                <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wide">
                  Base Case ({detail.baseCase.probability}% Prob)
                </span>
                <span className="font-mono text-lg font-bold text-[var(--text-primary)] num-tabular">
                  ${detail.baseCase.targetPrice.toFixed(2)}
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                {detail.baseCase.catalysts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-[var(--text-muted)] shrink-0 mt-0.5">■</span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bear Case */}
            <div className="border border-[var(--hairline)] bg-[var(--bg-surface)] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  Bear Case ({detail.bearCase.probability}% Prob)
                </span>
                <span className="font-mono text-lg font-bold text-rose-600 dark:text-rose-400 num-tabular">
                  ${detail.bearCase.targetPrice.toFixed(2)}
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                {detail.bearCase.catalysts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">■</span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Research Notes & Thesis Editor */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  ANALYST LOG
                </div>
                <CardTitle className="font-serif text-lg font-normal">
                  Investigative Notes & Conviction
                </CardTitle>
              </div>
              <div className="flex items-center gap-3">
                {notesSaved && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                  </span>
                )}
                <Button variant="primary" size="sm" onClick={handleSaveNotes} className="text-xs font-mono">
                  Save Notes
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <textarea
                value={researchNotes}
                onChange={(e) => setResearchNotes(e.target.value)}
                rows={3}
                placeholder="Record qualitative conviction, catalyst dates, and thesis assumptions..."
                className="w-full p-4 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#365CFF] leading-relaxed font-sans"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Financial Statements */}
      {activeTab === "financials" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                AUDITED SCHEDULE · GAAP STATEMENTS
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                5-Year Financial Statement History
              </CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Amounts in Billions USD ($B) · SEC Form 10-K Filings
              </p>
            </div>
            <DataProvenanceBadge type="VERIFIED_EXTERNAL" source="SEC EDGAR" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Financial Metric ($B)</th>
                    {detail.financialHistory.map((f) => (
                      <th key={f.year} className="p-3.5 text-right font-mono">
                        {f.year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--hairline)] num-tabular">
                  <tr>
                    <td className="p-3.5 pl-5 font-semibold text-[var(--text-primary)]">Total Revenue</td>
                    {detail.financialHistory.map((f) => (
                      <td key={f.year} className="p-3.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        ${f.revenue.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-5 text-[var(--text-secondary)]">Gross Profit</td>
                    {detail.financialHistory.map((f) => (
                      <td key={f.year} className="p-3.5 text-right font-mono text-[var(--text-primary)]">
                        ${f.grossProfit.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-5 text-[var(--text-secondary)]">Operating Income</td>
                    {detail.financialHistory.map((f) => (
                      <td key={f.year} className="p-3.5 text-right font-mono text-[var(--text-primary)]">
                        ${f.operatingIncome.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-5 text-[var(--text-secondary)]">Operating Margin %</td>
                    {detail.financialHistory.map((f) => (
                      <td key={f.year} className="p-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        {f.operatingMargin.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-5 font-semibold text-[var(--text-primary)]">Free Cash Flow</td>
                    {detail.financialHistory.map((f) => (
                      <td key={f.year} className="p-3.5 text-right font-mono font-semibold text-[#365CFF]">
                        ${f.freeCashFlow.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-5 text-[var(--text-secondary)]">Cash & Short-Term Equiv</td>
                    {detail.financialHistory.map((f) => (
                      <td key={f.year} className="p-3.5 text-right font-mono text-[var(--text-primary)]">
                        ${f.cashAndEquivalents.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 pl-5 text-[var(--text-secondary)]">Total Debt (Short & Long)</td>
                    {detail.financialHistory.map((f) => (
                      <td key={f.year} className="p-3.5 text-right font-mono text-[var(--text-muted)]">
                        ${f.totalDebt.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Forensic Accounting Audit */}
      {activeTab === "forensic" && (
        <div className="space-y-6">
          <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)] flex items-center justify-between text-xs">
            <div>
              <span className="font-mono font-bold text-[var(--text-primary)] uppercase tracking-wide">
                Algorithmic Forensic Accounting Screening
              </span>
              <p className="text-[var(--text-secondary)] text-xs mt-0.5">
                Automated tests for aggressive revenue recognition, Sloan accrual distortion, and DSO divergence.
              </p>
            </div>
            <DataProvenanceBadge type="CALCULATED_METRIC" source="Forensic Engine" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detail.forensicChecks.map((fc, i) => (
              <div
                key={i}
                className="p-5 border border-[var(--hairline)] bg-[var(--bg-surface)] space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[var(--text-primary)]">{fc.metric}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[var(--text-primary)] font-semibold">{fc.score}</span>
                    <Badge
                      variant={fc.status === "PASS" ? "positive" : "warning"}
                      size="xs"
                    >
                      {fc.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{fc.detail}</p>
                <div className="text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--hairline)]">
                  Source: {fc.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Peer Multiples */}
      {activeTab === "peers" && (
        <Card>
          <CardHeader className="border-b border-[var(--hairline)] pb-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              SCHEDULE 4.0 · RELATIVE VALUATION
            </div>
            <CardTitle className="font-serif text-lg font-normal mt-0.5">
              Industry Peer Valuation Multiples
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Ticker</th>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5 text-right">P/E</th>
                    <th className="p-3.5 text-right">EV/EBITDA</th>
                    <th className="p-3.5 text-right">YoY Rev Growth</th>
                    <th className="p-3.5 text-right pr-5">FCF Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--hairline)] num-tabular">
                  {detail.comparables.map((c) => (
                    <tr key={c.ticker} className="hover:bg-[var(--bg-surface-elevated)]/40">
                      <td className="p-3.5 pl-5 font-mono font-bold text-[#365CFF]">{c.ticker}</td>
                      <td className="p-3.5 text-[var(--text-primary)]">{c.name}</td>
                      <td className="p-3.5 text-right font-mono text-[var(--text-primary)]">{c.pe}x</td>
                      <td className="p-3.5 text-right font-mono text-[var(--text-primary)]">{c.evEbitda}x</td>
                      <td className="p-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400">+{c.revGrowth}%</td>
                      <td className="p-3.5 text-right pr-5 font-mono text-[#365CFF]">{c.fcfYield}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SecurityResearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[var(--text-muted)] font-mono">Loading Security Research Dossier...</div>}>
      <SecurityResearchContent />
    </Suspense>
  );
}
