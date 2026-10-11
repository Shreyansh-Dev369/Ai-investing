"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Info,
  DollarSign,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { PortfolioHolding } from "@/types";
import { MOCK_SECURITIES } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { AreaLineChart } from "@/components/charts/AreaLineChart";
import { DrawdownChart } from "@/components/charts/DrawdownChart";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function PortfolioIntelligencePage() {
  const {
    portfolio,
    addHolding,
    removeHolding,
    resetPortfolioToSample,
    clearPortfolioToEmpty,
    setActiveResearchTicker,
  } = useWorkspace();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTicker, setNewTicker] = useState("GOOGL");
  const [newShares, setNewShares] = useState("100");
  const [newCostBasis, setNewCostBasis] = useState("160");

  const isEmpty = portfolio.holdings.length === 0;

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const sec = MOCK_SECURITIES.find((s) => s.ticker === newTicker);
    const sharesNum = parseFloat(newShares) || 10;
    const costBasisNum = parseFloat(newCostBasis) || (sec ? sec.price : 100);
    const curPrice = sec ? sec.price : costBasisNum;
    const curVal = sharesNum * curPrice;
    const unPl = curVal - sharesNum * costBasisNum;
    const unPlPct = ((curPrice - costBasisNum) / costBasisNum) * 100;

    const holding: PortfolioHolding = {
      ticker: newTicker,
      name: sec ? sec.name : newTicker,
      sector: sec ? sec.sector : "Technology",
      assetClass: "Equity",
      shares: sharesNum,
      costBasis: costBasisNum,
      currentPrice: curPrice,
      currentValue: curVal,
      unrealizedPl: unPl,
      unrealizedPlPercent: unPlPct,
      weight: 10,
      riskContribution: 10,
      dayChangePercent: sec ? sec.changePercent : 0.5,
    };

    addHolding(holding);
    setIsAddModalOpen(false);
  };

  // Correlation matrix data for core holdings
  const correlationMatrix = [
    { ticker: "NVDA", NVDA: 1.0, MSFT: 0.68, ASML: 0.76, LLY: 0.22, TSM: 0.82 },
    { ticker: "MSFT", NVDA: 0.68, MSFT: 1.0, ASML: 0.59, LLY: 0.31, TSM: 0.64 },
    { ticker: "ASML", NVDA: 0.76, MSFT: 0.59, ASML: 1.0, LLY: 0.18, TSM: 0.79 },
    { ticker: "LLY", NVDA: 0.22, MSFT: 0.31, ASML: 0.18, LLY: 1.0, TSM: 0.25 },
    { ticker: "TSM", NVDA: 0.82, MSFT: 0.64, ASML: 0.79, LLY: 0.25, TSM: 1.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Portfolio Intelligence & Risk
            </h1>
            <DataProvenanceBadge type="CALCULATED_METRIC" source="Risk Engine" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Holdings allocation, factor exposures, risk decomposition, and cross-asset correlation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEmpty ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={resetPortfolioToSample}
              className="text-xs gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Load Sample Holdings</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={clearPortfolioToEmpty}
              className="text-xs text-[var(--text-muted)]"
              title="Test empty portfolio experience"
            >
              <span>Test Empty State</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Position</span>
          </Button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Portfolio Value"
          value={formatCurrency(portfolio.totalValue, "$", 0)}
          change={isEmpty ? undefined : portfolio.dayChangePercent}
          subtext={isEmpty ? "Unallocated cash" : `+$${portfolio.dayChangeDollar.toLocaleString()} today`}
          provenance="CALCULATED_METRIC"
        />

        <MetricCard
          label="Unrealized Gain / Loss"
          value={isEmpty ? "$0.00" : `+$${portfolio.totalUnrealizedPl.toLocaleString()}`}
          subtext={isEmpty ? "No active positions" : `+${portfolio.totalUnrealizedPlPercent.toFixed(1)}% total return`}
          provenance="CALCULATED_METRIC"
        />

        <MetricCard
          label="Sharpe Ratio (1Y)"
          value={isEmpty ? "—" : portfolio.sharpeRatio1Y.toFixed(2)}
          subtext={isEmpty ? "Need 10+ daily observations" : `Sortino: ${portfolio.sortinoRatio1Y.toFixed(2)} · Rf: 4.5%`}
          provenance="CALCULATED_METRIC"
        />

        <MetricCard
          label="Max Drawdown (1Y)"
          value={isEmpty ? "0.0%" : `-${portfolio.maxDrawdown1Y}%`}
          subtext={isEmpty ? "No volatility" : `Annualized Vol: ${portfolio.annualizedVol1Y}%`}
          provenance="CALCULATED_METRIC"
        />
      </div>

      {/* Empty State Banner if 0 holdings */}
      {isEmpty && (
        <div className="p-8 rounded-xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-strong)] text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto">
            <PieChart className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Portfolio is currently unallocated
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            You have $100,000 in unallocated cash reserves. Add individual stock holdings or click below to restore sample institutional allocations.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={resetPortfolioToSample} className="text-xs">
              Load Realistic Institutional Portfolio
            </Button>
          </div>
        </div>
      )}

      {/* Main Content when holdings exist */}
      {!isEmpty && (
        <>
          {/* Holdings Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Current Position Holdings</CardTitle>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Weights recalculated continuously based on live mark-to-market valuations
                </p>
              </div>
              <Badge variant="provenance">{portfolio.holdings.length} Positions</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[11px] text-[var(--text-muted)] font-medium">
                      <th className="p-3 pl-4">Security</th>
                      <th className="p-3">Sector</th>
                      <th className="p-3 text-right">Shares</th>
                      <th className="p-3 text-right">Avg Cost</th>
                      <th className="p-3 text-right">Market Price</th>
                      <th className="p-3 text-right">Position Value</th>
                      <th className="p-3 text-right">Weight</th>
                      <th className="p-3 text-right">Risk %</th>
                      <th className="p-3 text-right">Unrealized P&L</th>
                      <th className="p-3 text-center pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]/40 num-tabular">
                    {portfolio.holdings.map((h) => (
                      <tr key={h.ticker} className="hover:bg-[var(--bg-surface-elevated)]/40">
                        <td className="p-3 pl-4">
                          <Link
                            href={`/app/research?ticker=${h.ticker}`}
                            onClick={() => setActiveResearchTicker(h.ticker)}
                            className="font-mono font-bold text-[var(--text-primary)] hover:text-emerald-400"
                          >
                            {h.ticker}
                          </Link>
                          <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[130px]">
                            {h.name}
                          </div>
                        </td>
                        <td className="p-3 text-[var(--text-secondary)] text-[11px]">
                          {h.sector}
                        </td>
                        <td className="p-3 text-right font-mono text-[var(--text-primary)]">
                          {h.shares.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono text-[var(--text-secondary)]">
                          {formatCurrency(h.costBasis)}
                        </td>
                        <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                          {formatCurrency(h.currentPrice)}
                        </td>
                        <td className="p-3 text-right font-mono font-semibold text-[var(--text-primary)]">
                          {formatCurrency(h.currentValue, "$", 0)}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-400">
                          {h.weight}%
                        </td>
                        <td className="p-3 text-right font-mono text-purple-400">
                          {h.riskContribution}%
                        </td>
                        <td className="p-3 text-right">
                          <div className="font-mono font-semibold text-emerald-400">
                            +{formatCurrency(h.unrealizedPl, "$", 0)}
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400">
                            +{h.unrealizedPlPercent.toFixed(1)}%
                          </div>
                        </td>
                        <td className="p-3 text-center pr-4">
                          <button
                            onClick={() => removeHolding(h.ticker)}
                            className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer transition-colors"
                            title="Sell / Remove holding"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Allocation & Risk Decomposition Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sector Allocation Breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sector Allocation Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {portfolio.sectorAllocations.map((sec) => (
                  <div key={sec.sector} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[var(--text-primary)]">{sec.sector}</span>
                      <span className="font-mono text-emerald-400 font-semibold num-tabular">
                        {sec.weight}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--bg-surface-elevated)] overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${sec.weight}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                  <span>HHI Concentration Index: <strong>1,842</strong></span>
                  <span className="text-amber-400">Moderately Concentrated</span>
                </div>
              </CardContent>
            </Card>

            {/* Historical Drawdown Profile */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Portfolio Drawdown Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <DrawdownChart
                  data={[
                    { date: "2024-01", drawdown: 0 },
                    { date: "2024-03", drawdown: -2.1 },
                    { date: "2024-05", drawdown: -4.8 },
                    { date: "2024-07", drawdown: 0 },
                    { date: "2024-09", drawdown: -11.8 },
                    { date: "2024-11", drawdown: -3.4 },
                    { date: "2025-01", drawdown: 0 },
                    { date: "2025-03", drawdown: -5.2 },
                    { date: "2025-06", drawdown: 0 },
                    { date: "2025-09", drawdown: -2.5 },
                    { date: "2025-12", drawdown: 0 },
                    { date: "2026-03", drawdown: 0 },
                  ]}
                  height={150}
                />
              </CardContent>
            </Card>
          </div>

          {/* Holdings Correlation Matrix */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Cross-Asset Correlation Structure</CardTitle>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Pairwise return correlations over 252 trading days (-1.0 to +1.0)
                  </p>
                </div>
                <DataProvenanceBadge type="CALCULATED_METRIC" source="Covariance Matrix" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs border-collapse num-tabular">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[11px] text-[var(--text-muted)] font-semibold">
                      <th className="p-2.5 text-left pl-4">Asset</th>
                      {correlationMatrix.map((c) => (
                        <th key={c.ticker} className="p-2.5 font-mono">
                          {c.ticker}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]/40">
                    {correlationMatrix.map((row) => (
                      <tr key={row.ticker}>
                        <td className="p-2.5 text-left pl-4 font-mono font-bold text-[var(--text-primary)]">
                          {row.ticker}
                        </td>
                        {correlationMatrix.map((col) => {
                          const val = (row as any)[col.ticker] as number;
                          let bg = "bg-transparent";
                          if (val === 1.0) bg = "bg-slate-800/20 text-[var(--text-muted)]";
                          else if (val >= 0.7) bg = "bg-rose-950/40 text-rose-300 font-semibold";
                          else if (val <= 0.3) bg = "bg-emerald-950/40 text-emerald-300 font-semibold";

                          return (
                            <td key={col.ticker} className={`p-2.5 font-mono ${bg}`}>
                              {val.toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add Holding Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
              Add Portfolio Position
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Enter trade details to add a new security holding.
            </p>

            <form onSubmit={handleAddHolding} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Security Ticker</label>
                <select
                  value={newTicker}
                  onChange={(e) => {
                    setNewTicker(e.target.value);
                    const sec = MOCK_SECURITIES.find((s) => s.ticker === e.target.value);
                    if (sec) setNewCostBasis(sec.price.toString());
                  }}
                  className="w-full h-9 px-3 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                >
                  {MOCK_SECURITIES.map((s) => (
                    <option key={s.ticker} value={s.ticker}>
                      {s.ticker} — {s.name} (${s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Quantity of Shares</label>
                <input
                  type="number"
                  value={newShares}
                  onChange={(e) => setNewShares(e.target.value)}
                  className="w-full h-9 px-3 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Cost Basis Price ($/share)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCostBasis}
                  onChange={(e) => setNewCostBasis(e.target.value)}
                  className="w-full h-9 px-3 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Add to Portfolio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
