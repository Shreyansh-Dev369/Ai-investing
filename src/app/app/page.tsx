"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
  Calendar,
  Layers,
  ChevronRight,
  DollarSign,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { AreaLineChart } from "@/components/charts/AreaLineChart";
import { Sparkline } from "@/components/charts/Sparkline";
import { MOCK_SECURITIES, MOCK_NEWS_CATALYSTS, MOCK_MACRO_INDICATORS } from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function CommandCenterPage() {
  const { portfolio, watchlist, theses, setActiveResearchTicker } = useWorkspace();

  const watchlistedSecurities = MOCK_SECURITIES.filter((s) => watchlist.includes(s.ticker));
  const activeWatches = theses.filter((t) => t.status === "WATCH" || t.status === "AT_RISK");

  return (
    <div className="space-y-6">
      {/* Three Core Questions Banner */}
      <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded bg-emerald-950/60 text-emerald-400 shrink-0">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">1. What is happening?</div>
            <div className="font-semibold text-[var(--text-primary)] mt-0.5">
              Portfolio NAV is <span className="text-emerald-400 font-mono">+{formatPercent(portfolio.dayChangePercent)}</span> today
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Outperforming S&P 500 by +72 bps. Cash reserve at {portfolio.cashPercentage}%.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-[var(--border-subtle)]/60 pt-3 md:pt-0 md:pl-4">
          <div className="p-1 rounded bg-amber-950/60 text-amber-400 shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">2. What has materially changed?</div>
            <div className="font-semibold text-[var(--text-primary)] mt-0.5">
              <span className="text-amber-400 font-mono">ASML</span> Net Bookings fell to €3.9B
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Below €5.0B thesis assumption. Status marked as amber WATCH.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-[var(--border-subtle)]/60 pt-3 md:pt-0 md:pl-4">
          <div className="p-1 rounded bg-sky-950/60 text-sky-400 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">3. What should I investigate?</div>
            <div className="font-semibold text-[var(--text-primary)] mt-0.5">
              <Link href="/app/valuation" className="text-sky-400 hover:underline">
                Re-evaluate ASML DCF floor →
              </Link>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Review updated Investment Committee debate & risk sensitivities.
            </div>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Portfolio NAV"
          value={formatCurrency(portfolio.totalValue, "$", 0)}
          change={portfolio.dayChangePercent}
          subtext={`+$${portfolio.dayChangeDollar.toLocaleString()} today`}
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
          label="Cash & Reserves"
          value={formatCurrency(portfolio.cashBalance, "$", 0)}
          subtext={`${portfolio.cashPercentage}% allocation · T-Bills yielding 4.6%`}
          provenance="VERIFIED_EXTERNAL"
          provenanceSource="Treasury Reserve"
        />
      </div>

      {/* Main Grid: Chart & Holdings on Left, Alerts & Catalysts on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Area Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Portfolio Performance & Benchmark</CardTitle>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Trailing historical NAV vs. S&P 500 Index (normalized to 100)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/app/portfolio">
                  <span className="text-xs text-emerald-400 font-medium hover:underline inline-flex items-center gap-1">
                    Risk Breakdown →
                  </span>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <AreaLineChart
                data={portfolio.performanceHistory.map((p) => ({
                  date: p.date,
                  value: p.portfolio,
                  benchmark: p.benchmark,
                }))}
                primaryLabel="Fund Portfolio"
                benchmarkLabel="S&P 500 (SPY)"
                height={230}
              />
            </CardContent>
          </Card>

          {/* Top Holdings Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Core Portfolio Allocations</CardTitle>
              <Link href="/app/portfolio" className="text-xs text-emerald-400 hover:underline">
                Manage Holdings →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/50 text-[11px] text-[var(--text-muted)] font-medium">
                      <th className="p-3 pl-4">Asset</th>
                      <th className="p-3">Weight</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Day Change</th>
                      <th className="p-3 text-right">Total Gain/Loss</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]/40 num-tabular">
                    {portfolio.holdings.slice(0, 5).map((h) => (
                      <tr
                        key={h.ticker}
                        className="hover:bg-[var(--bg-surface-elevated)]/40 transition-colors"
                      >
                        <td className="p-3 pl-4">
                          <Link
                            href={`/app/research?ticker=${h.ticker}`}
                            onClick={() => setActiveResearchTicker(h.ticker)}
                            className="flex items-center gap-2 group"
                          >
                            <span className="font-mono font-bold text-[var(--text-primary)] group-hover:text-emerald-400">
                              {h.ticker}
                            </span>
                            <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[140px]">
                              {h.name}
                            </span>
                          </Link>
                        </td>
                        <td className="p-3 font-mono font-medium text-[var(--text-secondary)]">
                          {h.weight}%
                        </td>
                        <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                          {formatCurrency(h.currentPrice)}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`font-mono text-xs font-semibold ${
                              h.dayChangePercent >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {formatPercent(h.dayChangePercent, true)}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-mono text-emerald-400 font-semibold">
                            +{formatPercent(h.unrealizedPlPercent)}
                          </span>
                        </td>
                        <td className="p-3 text-right pr-4">
                          <Link
                            href={`/app/research?ticker=${h.ticker}`}
                            onClick={() => setActiveResearchTicker(h.ticker)}
                            className="text-[11px] text-emerald-400 hover:underline font-medium"
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
        <div className="space-y-6">
          {/* Active Thesis Health Alerts */}
          <Card className="border-amber-900/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <CardTitle>Thesis Health Status</CardTitle>
              </div>
              <Link href="/app/thesis" className="text-xs text-emerald-400 hover:underline">
                View All →
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {theses.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1.5"
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
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {t.originalThesis}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
                    <span>Evaluated {t.lastEvaluated}</span>
                    <Link
                      href="/app/thesis"
                      className="text-emerald-400 hover:underline font-medium"
                    >
                      Tripwires ({t.tripwires.length}) →
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Watchlist Movements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Watchlist Movers</CardTitle>
              <Link href="/app/screener" className="text-xs text-emerald-400 hover:underline">
                Screener →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border-subtle)]/40 text-xs">
                {watchlistedSecurities.slice(0, 4).map((sec) => (
                  <div
                    key={sec.ticker}
                    className="p-3 px-4 flex items-center justify-between hover:bg-[var(--bg-surface-elevated)]/30 transition-colors"
                  >
                    <div>
                      <div className="font-mono font-bold text-[var(--text-primary)]">
                        {sec.ticker}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">{sec.name}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkline data={sec.sparkline} width={64} height={20} />
                      <div className="text-right num-tabular">
                        <div className="font-mono font-semibold text-[var(--text-primary)]">
                          {formatCurrency(sec.price)}
                        </div>
                        <div
                          className={`font-mono text-[10px] ${
                            sec.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Macro Context</CardTitle>
              <Link href="/app/market" className="text-xs text-emerald-400 hover:underline">
                Market Intel →
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              {MOCK_MACRO_INDICATORS.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">{m.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{m.source}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-400 num-tabular">
                      {m.currentValue}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] num-tabular">
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
