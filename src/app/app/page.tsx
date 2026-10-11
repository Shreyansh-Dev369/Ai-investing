"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { AreaLineChart } from "@/components/charts/AreaLineChart";
import { Sparkline } from "@/components/charts/Sparkline";
import { MOCK_SECURITIES, MOCK_MACRO_INDICATORS } from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function CommandCenterPage() {
  const { portfolio, watchlist, theses, setActiveResearchTicker } = useWorkspace();

  const watchlistedSecurities = MOCK_SECURITIES.filter((s) => watchlist.includes(s.ticker));
  const activeWatches = theses.filter((t) => t.status === "WATCH" || t.status === "AT_RISK");

  return (
    <div className="space-y-8">
      {/* Editorial Dispatch Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF] animate-pulse" />
            <span>DISPATCH REF: AGY-EXEC-01</span>
            <span>·</span>
            <span>08:30 EST TRADING MEMORANDUM</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              AUDITED PORTFOLIO NAV
            </span>
            <span>MKT STATUS: ACTIVE</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Executive Intelligence Briefing
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Consolidated portfolio posture, active alpha attribution, and continuous thesis verification across core mandates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/app/research"
              className="px-3 py-1.5 text-xs font-mono border border-[var(--hairline)] bg-[var(--bg-surface)] hover:border-[#365CFF] hover:text-[#365CFF] transition-colors"
            >
              MEMORANDUM ARCHIVE →
            </Link>
            <Link
              href="/app/portfolio"
              className="px-3 py-1.5 text-xs font-mono bg-[#111210] dark:bg-[#F4F1E9] text-[#F4F1E9] dark:text-[#111210] hover:bg-[#365CFF] dark:hover:bg-[#365CFF] dark:hover:text-white transition-colors"
            >
              ALLOCATIONS
            </Link>
          </div>
        </div>
      </div>

      {/* Three Core Questions: Swiss Broadsheet Triptych */}
      <div className="border border-[var(--hairline)] bg-[var(--bg-surface)] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--hairline)]">
        {/* Pillar 01 */}
        <div className="p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[var(--text-muted)] uppercase mb-2">
              <span>01 / SITUATION</span>
              <span className="text-[#365CFF] font-semibold">ALPHA +72 BPS</span>
            </div>
            <div className="font-serif text-lg text-[var(--text-primary)] leading-snug">
              What is happening across the portfolio?
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
              Consolidated NAV is <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">+{formatPercent(portfolio.dayChangePercent)}</span> today, outperforming S&P 500 benchmark. Cash reserve stands at {portfolio.cashPercentage}%.
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--hairline)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span>SPY BETA: {portfolio.beta1Y}</span>
            <Link href="/app/portfolio" className="text-[#365CFF] hover:underline flex items-center gap-1">
              Risk breakdown <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Pillar 02 */}
        <div className="p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[var(--text-muted)] uppercase mb-2">
              <span>02 / MATERIAL DISRUPTION</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">{activeWatches.length} ON WATCH</span>
            </div>
            <div className="font-serif text-lg text-[var(--text-primary)] leading-snug">
              What has fundamentally changed?
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
              <span className="font-mono font-semibold text-[var(--text-primary)]">ASML</span> Q3 Net Bookings fell to €3.9B, trailing the €5.0B runway assumption. Moat intact, but backlog cycle extended.
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--hairline)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span>TRIPWIRE: ACTIVE</span>
            <Link href="/app/thesis" className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
              Tripwire register <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Pillar 03 */}
        <div className="p-5 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[var(--text-muted)] uppercase mb-2">
              <span>03 / ACTIONABLE INQUIRY</span>
              <span className="text-[#365CFF] font-semibold">REVALUATION READY</span>
            </div>
            <div className="font-serif text-lg text-[var(--text-primary)] leading-snug">
              What should you investigate next?
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
              Stress-test the Gordon Growth DCF terminal growth assumptions for ASML and review the Investment Committee dissenting perspective on hyperscaler capex.
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--hairline)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span>DCF SENSITIVITY: 2D</span>
            <Link href="/app/valuation?ticker=ASML" className="text-[#365CFF] hover:underline flex items-center gap-1">
              Run DCF model <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top Metric Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Portfolio NAV"
          value={formatCurrency(portfolio.totalValue, "$", 0)}
          change={portfolio.dayChangePercent}
          subtext={`+$${portfolio.dayChangeDollar.toLocaleString()} intraday change`}
          provenance="CALCULATED_METRIC"
          provenanceSource="Broker Ledger"
        />

        <MetricCard
          label="Active Alpha (vs SPY 1Y)"
          value={formatPercent(portfolio.alpha1Y, true)}
          subtext={`Beta 1Y: ${portfolio.beta1Y} · R²: 0.88`}
          provenance="CALCULATED_METRIC"
          provenanceSource="Regression Engine"
        />

        <MetricCard
          label="Risk-Adjusted (Sharpe 1Y)"
          value={portfolio.sharpeRatio1Y.toFixed(2)}
          subtext={`Sortino: ${portfolio.sortinoRatio1Y.toFixed(2)} · Rf: 4.5%`}
          provenance="CALCULATED_METRIC"
          provenanceSource="Daily Returns"
        />

        <MetricCard
          label="Cash & T-Bill Reserves"
          value={formatCurrency(portfolio.cashBalance, "$", 0)}
          subtext={`${portfolio.cashPercentage}% allocation · Yielding 4.6%`}
          provenance="VERIFIED_EXTERNAL"
          provenanceSource="Treasury Reserve"
        />
      </div>

      {/* Main Grid: Chart & Holdings on Left, Alerts & Catalysts on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Area Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  FIGURE 1.0 · CUMULATIVE RETURN TRAJECTORY
                </div>
                <CardTitle className="font-serif text-lg font-normal mt-0.5">
                  Portfolio Performance & Benchmark
                </CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Trailing historical NAV vs. S&P 500 Index (normalized to 100)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/app/portfolio"
                  className="text-xs font-mono text-[#365CFF] hover:underline inline-flex items-center gap-1"
                >
                  Risk Breakdown →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <AreaLineChart
                data={portfolio.performanceHistory.map((p) => ({
                  date: p.date,
                  value: p.portfolio,
                  benchmark: p.benchmark,
                }))}
                primaryLabel="Fund Portfolio"
                benchmarkLabel="S&P 500 (SPY)"
                height={240}
              />
            </CardContent>
          </Card>

          {/* Core Portfolio Allocations Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  SCHEDULE 1.1 · EQUITY ALLOCATIONS
                </div>
                <CardTitle className="font-serif text-lg font-normal mt-0.5">
                  Core Portfolio Allocations
                </CardTitle>
              </div>
              <Link href="/app/portfolio" className="text-xs font-mono text-[#365CFF] hover:underline">
                Rebalance Holdings →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="p-3.5 pl-5">Security</th>
                      <th className="p-3.5">Weight</th>
                      <th className="p-3.5 text-right">Price</th>
                      <th className="p-3.5 text-right">Day Change</th>
                      <th className="p-3.5 text-right">Unrealized Gain</th>
                      <th className="p-3.5 text-right pr-5">Investigation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--hairline)] num-tabular">
                    {portfolio.holdings.slice(0, 5).map((h) => (
                      <tr
                        key={h.ticker}
                        className="hover:bg-[var(--bg-surface-elevated)]/60 transition-colors"
                      >
                        <td className="p-3.5 pl-5">
                          <Link
                            href={`/app/research?ticker=${h.ticker}`}
                            onClick={() => setActiveResearchTicker(h.ticker)}
                            className="flex items-center gap-2 group"
                          >
                            <span className="font-mono font-bold text-[var(--text-primary)] group-hover:text-[#365CFF]">
                              {h.ticker}
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)] truncate max-w-[140px]">
                              {h.name}
                            </span>
                          </Link>
                        </td>
                        <td className="p-3.5 font-mono text-[var(--text-secondary)]">
                          {h.weight}%
                        </td>
                        <td className="p-3.5 text-right font-mono font-semibold text-[var(--text-primary)]">
                          {formatCurrency(h.currentPrice)}
                        </td>
                        <td className="p-3.5 text-right font-mono">
                          <span
                            className={`font-semibold ${
                              h.dayChangePercent >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {formatPercent(h.dayChangePercent, true)}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            +{formatPercent(h.unrealizedPlPercent)}
                          </span>
                        </td>
                        <td className="p-3.5 text-right pr-5">
                          <Link
                            href={`/app/research?ticker=${h.ticker}`}
                            onClick={() => setActiveResearchTicker(h.ticker)}
                            className="text-[11px] font-mono text-[#365CFF] hover:underline"
                          >
                            Research →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-8">
          {/* Active Thesis Health Alerts */}
          <Card className="border-[var(--hairline)]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#365CFF]" />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    SURVEILLANCE
                  </div>
                  <CardTitle className="font-serif text-lg font-normal">Thesis Register</CardTitle>
                </div>
              </div>
              <Link href="/app/thesis" className="text-xs font-mono text-[#365CFF] hover:underline">
                View All ({theses.length}) →
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {theses.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[var(--text-primary)]">
                      {t.ticker}
                    </span>
                    <Badge
                      variant={
                        t.status === "HEALTHY"
                          ? "healthy"
                          : t.status === "WATCH"
                          ? "watch"
                          : "at-risk"
                      }
                      size="xs"
                    >
                      {t.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {t.originalThesis}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--hairline)]/60">
                    <span>Verified: {t.lastEvaluated}</span>
                    <Link
                      href="/app/thesis"
                      className="text-[#365CFF] hover:underline font-semibold"
                    >
                      {t.tripwires.length} Tripwires →
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Watchlist Movers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  UNIVERSE WATCH
                </div>
                <CardTitle className="font-serif text-lg font-normal">Priority Watchlist</CardTitle>
              </div>
              <Link href="/app/screener" className="text-xs font-mono text-[#365CFF] hover:underline">
                Screener →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--hairline)] text-xs">
                {watchlistedSecurities.slice(0, 4).map((sec) => (
                  <div
                    key={sec.ticker}
                    className="p-3.5 px-4 flex items-center justify-between hover:bg-[var(--bg-surface-elevated)]/30 transition-colors"
                  >
                    <div>
                      <div className="font-mono font-bold text-[var(--text-primary)]">
                        {sec.ticker}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] truncate max-w-[120px]">
                        {sec.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkline data={sec.sparkline} width={64} height={20} />
                      <div className="text-right num-tabular">
                        <div className="font-mono font-semibold text-[var(--text-primary)]">
                          {formatCurrency(sec.price)}
                        </div>
                        <div
                          className={`font-mono text-[10px] ${
                            sec.changePercent >= 0
                              ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                              : "text-rose-600 dark:text-rose-400 font-semibold"
                          }`}
                        >
                          {formatPercent(sec.changePercent, true)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Macro Indicators Bar */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  MACRO REGIME
                </div>
                <CardTitle className="font-serif text-lg font-normal">Economic Rates</CardTitle>
              </div>
              <Link href="/app/market" className="text-xs font-mono text-[#365CFF] hover:underline">
                Briefing →
              </Link>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              {MOCK_MACRO_INDICATORS.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">{m.name}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">{m.source}</div>
                  </div>
                  <div className="text-right font-mono num-tabular">
                    <div className="font-bold text-[var(--text-primary)]">
                      {m.currentValue}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      Prev: {m.previousValue}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
