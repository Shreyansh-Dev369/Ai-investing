"use client";

import React, { useState, useMemo } from "react";
import {
  Play,
  ShieldAlert,
} from "lucide-react";
import { QuantStrategyConfig, QuantBacktestResult } from "@/types";
import { runBacktestSimulation } from "@/lib/quant";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { AreaLineChart } from "@/components/charts/AreaLineChart";
import { DrawdownChart } from "@/components/charts/DrawdownChart";

export default function QuantitativeLabPage() {
  const [config, setConfig] = useState<QuantStrategyConfig>({
    id: "strat-dual-momentum",
    name: "Systematic Dual Momentum",
    strategyClass: "Dual Momentum",
    description: "Combines 12-month relative momentum across equity universe with absolute trend-following cash risk-off filter.",
    rebalanceFrequency: "Monthly",
    lookbackPeriodMonths: 12,
    benchmark: "S&P 500 (SPY)",
    slippageBps: 15,
    cashAllocationPct: 5,
    stopLossPct: 8,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [backtestResult, setBacktestResult] = useState<QuantBacktestResult>(() =>
    runBacktestSimulation(config, 3)
  );

  const handleRunBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runBacktestSimulation(config, 3);
      setBacktestResult(res);
      setIsRunning(false);
    }, 400);
  };

  const handleStrategyClassChange = (strategyClass: QuantStrategyConfig["strategyClass"]) => {
    let desc = "";
    if (strategyClass === "Dual Momentum") {
      desc = "Combines 12-month relative momentum with absolute trend-following cash risk-off filter.";
    } else if (strategyClass === "Quality Compounder") {
      desc = "Selects top-quintile ROIC companies with low balance sheet leverage and stable operating margins.";
    } else if (strategyClass === "Deep Value FCF") {
      desc = "Screens for highest free cash flow yield with interest coverage ratio > 4.0x.";
    } else {
      desc = "Constructs minimum-variance weights to minimize portfolio annualized drawdown.";
    }

    const nextConfig: QuantStrategyConfig = {
      ...config,
      strategyClass,
      name: `${strategyClass} Engine`,
      description: desc,
    };
    setConfig(nextConfig);
    setBacktestResult(runBacktestSimulation(nextConfig, 3));
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Quantitative Strategy Lab
            </h1>
            <DataProvenanceBadge type="CALCULATED_METRIC" source="Backtest Simulation Engine" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Point-in-time factor simulation with modeled transaction costs, slippage, and drawdown limits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunBacktest}
            isLoading={isRunning}
            className="text-xs gap-1.5"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run Experiment</span>
          </Button>
        </div>
      </div>

      {/* Strategy Class Presets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["Dual Momentum", "Quality Compounder", "Deep Value FCF", "Low Volatility Min-Var"] as const).map(
          (sc) => {
            const isSelected = config.strategyClass === sc;
            return (
              <button
                key={sc}
                onClick={() => handleStrategyClassChange(sc)}
                className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[var(--bg-surface-elevated)] border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30"
                    : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="font-semibold text-xs text-[var(--text-primary)]">{sc}</div>
                <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                  Factor Model
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* Main Grid: Parameters on Left, Output Curves on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters Column (1 span) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Strategy Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {/* Benchmark */}
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Benchmark</label>
                <select
                  value={config.benchmark}
                  onChange={(e) =>
                    setConfig({ ...config, benchmark: e.target.value as QuantStrategyConfig["benchmark"] })
                  }
                  className="w-full h-8 px-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                >
                  <option value="S&P 500 (SPY)">S&P 500 (SPY)</option>
                  <option value="MSCI World (URTH)">MSCI World (URTH)</option>
                  <option value="Nasdaq 100 (QQQ)">Nasdaq 100 (QQQ)</option>
                </select>
              </div>

              {/* Rebalance Frequency */}
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Rebalance Frequency</label>
                <select
                  value={config.rebalanceFrequency}
                  onChange={(e) =>
                    setConfig({ ...config, rebalanceFrequency: e.target.value as QuantStrategyConfig["rebalanceFrequency"] })
                  }
                  className="w-full h-8 px-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Semi-Annually">Semi-Annually</option>
                </select>
              </div>

              {/* Lookback Window */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Lookback Period:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {config.lookbackPeriodMonths} Months
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="18"
                  step="3"
                  value={config.lookbackPeriodMonths}
                  onChange={(e) =>
                    setConfig({ ...config, lookbackPeriodMonths: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Slippage & Costs */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Slippage & Costs:</span>
                  <span className="font-mono font-bold text-sky-400">
                    {config.slippageBps} bps
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={config.slippageBps}
                  onChange={(e) =>
                    setConfig({ ...config, slippageBps: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Stop Loss Filter */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Max Drawdown Stop:</span>
                  <span className="font-mono font-bold text-rose-400">
                    {config.stopLossPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="2"
                  value={config.stopLossPct}
                  onChange={(e) =>
                    setConfig({ ...config, stopLossPct: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRunBacktest}
                  className="w-full text-xs"
                >
                  Recalculate Model
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Point in Time Disclosure */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] space-y-1.5 leading-relaxed">
            <span className="font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Backtest Methodology & Constraints</span>
            </span>
            <p>{backtestResult.limitationsDisclaimer}</p>
          </div>
        </div>

        {/* Results & Equity Curve Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Simulation Performance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">
                Total Return
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400 num-tabular">
                +{backtestResult.totalReturnPct}%
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                Bench: +{backtestResult.benchmarkReturnPct}%
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">
                Sharpe Ratio
              </span>
              <span className="text-xl font-bold font-mono text-sky-400 num-tabular">
                {backtestResult.sharpeRatio}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                Sortino: {backtestResult.sortinoRatio}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">
                Max Drawdown
              </span>
              <span className="text-xl font-bold font-mono text-rose-400 num-tabular">
                -{backtestResult.maxDrawdownPct}%
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                Calmar: {backtestResult.calmarRatio}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono block">
                Win Rate
              </span>
              <span className="text-xl font-bold font-mono text-[var(--text-primary)] num-tabular">
                {backtestResult.winRatePct}%
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                Turnover: {backtestResult.turnoverAnnualPct}%
              </span>
            </div>
          </div>

          {/* Equity Curve Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Cumulative Equity Curve ($100k Base)</CardTitle>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Point-in-time growth of $100,000 initial capital vs {config.benchmark}
                </p>
              </div>
              <Badge variant="provenance">
                {backtestResult.startDate} to {backtestResult.endDate}
              </Badge>
            </CardHeader>
            <CardContent>
              <AreaLineChart
                data={backtestResult.equityCurve.map((e) => ({
                  date: e.date,
                  value: e.strategy,
                  benchmark: e.benchmark,
                }))}
                primaryLabel={config.name}
                benchmarkLabel={config.benchmark}
                height={210}
                isCurrency={true}
              />
            </CardContent>
          </Card>

          {/* Underwater Drawdown Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Drawdown Series vs Peak High-Water Mark</CardTitle>
            </CardHeader>
            <CardContent>
              <DrawdownChart
                data={backtestResult.equityCurve.map((e) => ({
                  date: e.date,
                  drawdown: -e.drawdown,
                }))}
                height={120}
              />
            </CardContent>
          </Card>

          {/* Rebalance Trade Log Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Rebalance Trade Ledger</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse num-tabular">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[11px] text-[var(--text-muted)] font-medium">
                      <th className="p-2.5 pl-4">Date</th>
                      <th className="p-2.5">Security</th>
                      <th className="p-2.5">Action</th>
                      <th className="p-2.5 text-right">Target Weight</th>
                      <th className="p-2.5 text-right">Exec Price</th>
                      <th className="p-2.5 text-right pr-4">Realized P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]/40">
                    {backtestResult.tradeHistory.slice(0, 6).map((t, i) => (
                      <tr key={i} className="hover:bg-[var(--bg-surface-elevated)]/30">
                        <td className="p-2.5 pl-4 font-mono text-[var(--text-muted)]">{t.date}</td>
                        <td className="p-2.5 font-mono font-bold text-[var(--text-primary)]">
                          {t.ticker}
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              t.action === "BUY"
                                ? "bg-emerald-950/50 text-emerald-400"
                                : "bg-rose-950/50 text-rose-400"
                            }`}
                          >
                            {t.action}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-mono text-[var(--text-secondary)]">
                          {t.weight}%
                        </td>
                        <td className="p-2.5 text-right font-mono font-semibold text-[var(--text-primary)]">
                          ${t.price}
                        </td>
                        <td className="p-2.5 text-right pr-4 font-mono">
                          {t.pnlPct !== undefined ? (
                            <span
                              className={
                                t.pnlPct >= 0 ? "text-emerald-400" : "text-rose-400"
                              }
                            >
                              {t.pnlPct >= 0 ? "+" : ""}
                              {t.pnlPct}%
                            </span>
                          ) : (
                            <span className="text-[var(--text-muted)]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
