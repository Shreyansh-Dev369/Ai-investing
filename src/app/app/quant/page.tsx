"use client";

import React, { useState } from "react";
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
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>DISPATCH: QUANTITATIVE LAB</span>
            <span>·</span>
            <span>POINT-IN-TIME FACTOR SIMULATION</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              SLIPPAGE MODELED: 15 BPS
            </span>
            <DataProvenanceBadge type="CALCULATED_METRIC" source="Backtest Simulation Engine" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Quantitative Strategy Lab
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Point-in-time factor simulation with modeled transaction costs, turnover limits, and systematic drawdown rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleRunBacktest}
              isLoading={isRunning}
              className="text-xs font-mono gap-1.5"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Run Simulation</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Strategy Class Presets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["Dual Momentum", "Quality Compounder", "Deep Value FCF", "Low Volatility Min-Var"] as const).map(
          (sc) => {
            const isSelected = config.strategyClass === sc;
            return (
              <button
                key={sc}
                onClick={() => handleStrategyClassChange(sc)}
                className={`p-4 text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[var(--bg-surface-elevated)] border-[#365CFF] shadow-xs"
                    : "bg-[var(--bg-surface)] border-[var(--hairline)] hover:border-[var(--text-secondary)]"
                }`}
              >
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  FACTOR ENGINE
                </div>
                <div className="font-semibold text-xs text-[var(--text-primary)] mt-1">{sc}</div>
                <div className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-1">
                  Systematic Mandate
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* Main Grid: Parameters on Left, Output Curves on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Parameters Column (1 span) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                SIMULATION PARAMETERS
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                Strategy Config
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              {/* Benchmark */}
              <div>
                <label className="block font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                  Benchmark
                </label>
                <select
                  value={config.benchmark}
                  onChange={(e) =>
                    setConfig({ ...config, benchmark: e.target.value as QuantStrategyConfig["benchmark"] })
                  }
                  className="w-full h-8 px-2.5 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[#365CFF]"
                >
                  <option value="S&P 500 (SPY)">S&P 500 (SPY)</option>
                  <option value="MSCI World (URTH)">MSCI World (URTH)</option>
                  <option value="Nasdaq 100 (QQQ)">Nasdaq 100 (QQQ)</option>
                </select>
              </div>

              {/* Rebalance Frequency */}
              <div>
                <label className="block font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                  Rebalance Frequency
                </label>
                <select
                  value={config.rebalanceFrequency}
                  onChange={(e) =>
                    setConfig({ ...config, rebalanceFrequency: e.target.value as QuantStrategyConfig["rebalanceFrequency"] })
                  }
                  className="w-full h-8 px-2.5 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[#365CFF]"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Semi-Annually">Semi-Annually</option>
                </select>
              </div>

              {/* Lookback Window */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-secondary)]">Lookback Period:</span>
                  <span className="font-bold text-[#365CFF]">
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
                  className="w-full accent-[#365CFF] cursor-pointer"
                />
              </div>

              {/* Slippage & Costs */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-secondary)]">Slippage & Costs:</span>
                  <span className="font-bold text-[#365CFF]">
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
                  className="w-full accent-[#365CFF] cursor-pointer"
                />
              </div>

              {/* Stop Loss Filter */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-secondary)]">Max Drawdown Stop:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
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
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-[var(--hairline)]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunBacktest}
                  className="w-full text-xs font-mono"
                >
                  Recalculate Model
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Point in Time Disclosure */}
          <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[11px] text-[var(--text-secondary)] space-y-2 leading-relaxed">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
              <span>Backtest Methodology & Constraints</span>
            </span>
            <p>{backtestResult.limitationsDisclaimer}</p>
          </div>
        </div>

        {/* Results & Equity Curve Column (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Simulation Performance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono tracking-wider block">
                Total Return
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 num-tabular mt-1 block">
                +{backtestResult.totalReturnPct}%
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                Bench: +{backtestResult.benchmarkReturnPct}%
              </span>
            </div>

            <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono tracking-wider block">
                Sharpe Ratio
              </span>
              <span className="text-2xl font-bold font-mono text-[#365CFF] num-tabular mt-1 block">
                {backtestResult.sharpeRatio}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                Sortino: {backtestResult.sortinoRatio}
              </span>
            </div>

            <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono tracking-wider block">
                Max Drawdown
              </span>
              <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 num-tabular mt-1 block">
                -{backtestResult.maxDrawdownPct}%
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                Calmar: {backtestResult.calmarRatio}
              </span>
            </div>

            <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono tracking-wider block">
                Win Rate
              </span>
              <span className="text-2xl font-bold font-mono text-[var(--text-primary)] num-tabular mt-1 block">
                {backtestResult.winRatePct}%
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                Turnover: {backtestResult.turnoverAnnualPct}%
              </span>
            </div>
          </div>

          {/* Equity Curve Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  FIGURE 8.1 · CUMULATIVE WEALTH INDEX
                </div>
                <CardTitle className="font-serif text-lg font-normal mt-0.5">
                  Cumulative Equity Curve ($100k Base)
                </CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Simulated point-in-time growth of $100,000 initial capital vs {config.benchmark}
                </p>
              </div>
              <Badge variant="provenance">
                {backtestResult.startDate} to {backtestResult.endDate}
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <AreaLineChart
                data={backtestResult.equityCurve.map((e) => ({
                  date: e.date,
                  value: e.strategy,
                  benchmark: e.benchmark,
                }))}
                primaryLabel={config.name}
                benchmarkLabel={config.benchmark}
                height={220}
                isCurrency={true}
              />
            </CardContent>
          </Card>

          {/* Underwater Drawdown Chart */}
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                FIGURE 8.2 · UNDERWATER RISK PROFILE
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                Drawdown Series vs Peak High-Water Mark
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <DrawdownChart
                data={backtestResult.equityCurve.map((e) => ({
                  date: e.date,
                  drawdown: -e.drawdown,
                }))}
                height={140}
              />
            </CardContent>
          </Card>

          {/* Rebalance Trade Log Table */}
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                SCHEDULE 8.3 · EXECUTION AUDIT TRAIL
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                Recent Rebalance Trade Ledger
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse num-tabular">
                  <thead>
                    <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="p-3.5 pl-5">Date</th>
                      <th className="p-3.5">Security</th>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5 text-right">Target Weight</th>
                      <th className="p-3.5 text-right">Exec Price</th>
                      <th className="p-3.5 text-right pr-5">Realized P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--hairline)]">
                    {backtestResult.tradeHistory.slice(0, 6).map((t, i) => (
                      <tr key={i} className="hover:bg-[var(--bg-surface-elevated)]/40 transition-colors">
                        <td className="p-3.5 pl-5 font-mono text-[var(--text-muted)]">{t.date}</td>
                        <td className="p-3.5 font-mono font-bold text-[var(--text-primary)]">
                          {t.ticker}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-mono font-bold border ${
                              t.action === "BUY"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                            }`}
                          >
                            {t.action}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono text-[var(--text-secondary)]">
                          {t.weight}%
                        </td>
                        <td className="p-3.5 text-right font-mono font-semibold text-[var(--text-primary)]">
                          ${t.price}
                        </td>
                        <td className="p-3.5 text-right pr-5 font-mono">
                          {t.pnlPct !== undefined ? (
                            <span
                              className={`font-semibold ${
                                t.pnlPct >= 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
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
