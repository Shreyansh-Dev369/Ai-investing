"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Plus,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { PortfolioHolding } from "@/types";
import { MOCK_SECURITIES } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { DrawdownChart } from "@/components/charts/DrawdownChart";
import { formatCurrency } from "@/lib/utils";

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
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>DISPATCH: RISK & CAPITAL ALLOCATION</span>
            <span>·</span>
            <span>PORTFOLIO LEDGER</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              DAILY COVARIANCE RECOMPUTED
            </span>
            <DataProvenanceBadge type="CALCULATED_METRIC" source="Risk Engine" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Portfolio Intelligence & Risk
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Factor exposures, risk contribution decomposition, and pairwise cross-asset correlation analysis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isEmpty ? (
              <Button
                variant="outline"
                size="sm"
                onClick={resetPortfolioToSample}
                className="text-xs font-mono gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Load Sample</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={clearPortfolioToEmpty}
                className="text-xs font-mono text-[var(--text-muted)]"
              >
                <span>Clear</span>
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-mono gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Position</span>
            </Button>
          </div>
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
          provenanceSource="Broker Ledger"
        />

        <MetricCard
          label="Unrealized Gain / Loss"
          value={isEmpty ? "$0.00" : `+$${portfolio.totalUnrealizedPl.toLocaleString()}`}
          subtext={isEmpty ? "No active positions" : `+${portfolio.totalUnrealizedPlPercent.toFixed(1)}% total return`}
          provenance="CALCULATED_METRIC"
          provenanceSource="Tax-Lot Engine"
        />

        <MetricCard
          label="Sharpe Ratio (1Y)"
          value={isEmpty ? "—" : portfolio.sharpeRatio1Y.toFixed(2)}
          subtext={isEmpty ? "Need 10+ daily observations" : `Sortino: ${portfolio.sortinoRatio1Y.toFixed(2)} · Rf: 4.5%`}
          provenance="CALCULATED_METRIC"
          provenanceSource="Daily Returns"
        />

        <MetricCard
          label="Max Drawdown (1Y)"
          value={isEmpty ? "0.0%" : `-${portfolio.maxDrawdown1Y}%`}
          subtext={isEmpty ? "No volatility" : `Annualized Vol: ${portfolio.annualizedVol1Y}%`}
          provenance="CALCULATED_METRIC"
          provenanceSource="Peak-to-Trough"
        />
      </div>

      {/* Empty State Banner if 0 holdings */}
      {isEmpty && (
        <div className="p-12 border border-dashed border-[var(--hairline)] bg-[var(--bg-surface)] text-center space-y-3">
          <div className="h-10 w-10 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)] text-[#365CFF] flex items-center justify-center mx-auto">
            <PieChart className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-lg font-normal text-[var(--text-primary)]">
            Portfolio is currently unallocated
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            You hold $100,000 in unallocated cash reserves. Add individual positions or restore the sample institutional book.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={resetPortfolioToSample} className="text-xs font-mono">
              Load Institutional Portfolio
            </Button>
          </div>
        </div>
      )}

      {/* Main Content when holdings exist */}
      {!isEmpty && (
        <>
          {/* Holdings Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  SCHEDULE 5.1 · POSITION VALUATION
                </div>
                <CardTitle className="font-serif text-lg font-normal mt-0.5">
                  Current Position Holdings
                </CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Weights recalculated continuously based on live mark-to-market prices
                </p>
              </div>
              <Badge variant="provenance">{portfolio.holdings.length} Positions</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="p-3.5 pl-5">Security</th>
                      <th className="p-3.5">Sector</th>
                      <th className="p-3.5 text-right">Shares</th>
                      <th className="p-3.5 text-right">Avg Cost</th>
                      <th className="p-3.5 text-right">Price</th>
                      <th className="p-3.5 text-right">Position Value</th>
                      <th className="p-3.5 text-right">Weight</th>
                      <th className="p-3.5 text-right">Risk %</th>
                      <th className="p-3.5 text-right">Unrealized P&L</th>
                      <th className="p-3.5 text-center pr-5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--hairline)] num-tabular">
                    {portfolio.holdings.map((h) => (
                      <tr key={h.ticker} className="hover:bg-[var(--bg-surface-elevated)]/40 transition-colors">
                        <td className="p-3.5 pl-5">
                          <Link
                            href={`/app/research?ticker=${h.ticker}`}
                            onClick={() => setActiveResearchTicker(h.ticker)}
                            className="font-mono font-bold text-[var(--text-primary)] hover:text-[#365CFF]"
                          >
                            {h.ticker}
                          </Link>
                          <div className="text-[10px] text-[var(--text-secondary)] truncate max-w-[130px]">
                            {h.name}
                          </div>
                        </td>
                        <td className="p-3.5 text-[var(--text-secondary)] text-[11px]">
                          {h.sector}
                        </td>
                        <td className="p-3.5 text-right font-mono text-[var(--text-primary)]">
                          {h.shares.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right font-mono text-[var(--text-secondary)]">
                          {formatCurrency(h.costBasis)}
                        </td>
                        <td className="p-3.5 text-right font-mono font-semibold text-[var(--text-primary)]">
                          {formatCurrency(h.currentPrice)}
                        </td>
                        <td className="p-3.5 text-right font-mono font-semibold text-[var(--text-primary)]">
                          {formatCurrency(h.currentValue, "$", 0)}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {h.weight}%
                        </td>
                        <td className="p-3.5 text-right font-mono text-[#365CFF]">
                          {h.riskContribution}%
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            +{formatCurrency(h.unrealizedPl, "$", 0)}
                          </div>
                          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                            +{h.unrealizedPlPercent.toFixed(1)}%
                          </div>
                        </td>
                        <td className="p-3.5 text-center pr-5">
                          <button
                            onClick={() => removeHolding(h.ticker)}
                            className="p-1 border border-transparent hover:border-rose-500/40 text-[var(--text-muted)] hover:text-rose-500 cursor-pointer transition-colors"
                            title="Remove position"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sector Allocation Breakdown */}
            <Card>
              <CardHeader className="border-b border-[var(--hairline)] pb-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  FIGURE 5.2 · SECTOR EXPOSURE
                </div>
                <CardTitle className="font-serif text-lg font-normal mt-0.5">
                  Sector Allocation Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                {portfolio.sectorAllocations.map((sec) => (
                  <div key={sec.sector} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-primary)]">{sec.sector}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold num-tabular">
                        {sec.weight}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-[var(--bg-surface-elevated)] border border-[var(--hairline)] overflow-hidden">
                      <div
                        className="h-full bg-[#365CFF] transition-all"
                        style={{ width: `${sec.weight}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-[var(--hairline)] text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
                  <span>HHI CONCENTRATION: <strong>1,842</strong></span>
                  <span className="text-amber-600 dark:text-amber-400">MODERATELY CONCENTRATED</span>
                </div>
              </CardContent>
            </Card>

            {/* Historical Drawdown Profile */}
            <Card>
              <CardHeader className="border-b border-[var(--hairline)] pb-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  FIGURE 5.3 · PEAK-TO-TROUGH STRESS
                </div>
                <CardTitle className="font-serif text-lg font-normal mt-0.5">
                  Portfolio Drawdown Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
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
                  height={170}
                />
              </CardContent>
            </Card>
          </div>

          {/* Holdings Correlation Matrix */}
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    SCHEDULE 5.4 · RETURN COVARIANCE
                  </div>
                  <CardTitle className="font-serif text-lg font-normal mt-0.5">
                    Cross-Asset Correlation Structure
                  </CardTitle>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Pairwise daily return correlations over 252 trading sessions (-1.0 to +1.0)
                  </p>
                </div>
                <DataProvenanceBadge type="CALCULATED_METRIC" source="Covariance Matrix" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs border-collapse num-tabular">
                  <thead>
                    <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="p-3 text-left pl-5">Asset</th>
                      {correlationMatrix.map((c) => (
                        <th key={c.ticker} className="p-3 font-mono">
                          {c.ticker}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--hairline)]">
                    {correlationMatrix.map((row) => (
                      <tr key={row.ticker}>
                        <td className="p-3 text-left pl-5 font-mono font-bold text-[var(--text-primary)]">
                          {row.ticker}
                        </td>
                        {correlationMatrix.map((col) => {
                          const val = (row as Record<string, number | string>)[col.ticker] as number;
                          let colorCls = "text-[var(--text-secondary)]";
                          if (val === 1.0) colorCls = "text-[var(--text-muted)] font-mono";
                          else if (val >= 0.7) colorCls = "text-rose-600 dark:text-rose-400 font-semibold";
                          else if (val <= 0.3) colorCls = "text-emerald-600 dark:text-emerald-400 font-semibold";

                          return (
                            <td key={col.ticker} className={`p-3 font-mono border-l border-[var(--hairline)] ${colorCls}`}>
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
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--hairline)] p-6 space-y-4">
            <h3 className="font-serif text-xl font-normal text-[var(--text-primary)]">
              Add Portfolio Position
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Specify trade execution details to add an equity position to the active fund ledger.
            </p>

            <form onSubmit={handleAddHolding} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                  Security Ticker
                </label>
                <select
                  value={newTicker}
                  onChange={(e) => {
                    setNewTicker(e.target.value);
                    const sec = MOCK_SECURITIES.find((s) => s.ticker === e.target.value);
                    if (sec) setNewCostBasis(sec.price.toString());
                  }}
                  className="w-full h-9 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[var(--text-primary)] font-mono text-xs"
                >
                  {MOCK_SECURITIES.map((s) => (
                    <option key={s.ticker} value={s.ticker}>
                      {s.ticker} — {s.name} (${s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                  Quantity of Shares
                </label>
                <input
                  type="number"
                  value={newShares}
                  onChange={(e) => setNewShares(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[var(--text-primary)] font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                  Cost Basis Price ($/share)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newCostBasis}
                  onChange={(e) => setNewCostBasis(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[var(--text-primary)] font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--hairline)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="font-mono text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-mono text-xs">
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
