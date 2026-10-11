"use client";

import React, { useState, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { calculateDCF } from "@/lib/dcf";
import { DCFInputs } from "@/types";
import { MOCK_SECURITIES } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { SensitivityHeatmap } from "@/components/charts/SensitivityHeatmap";

export default function ValuationLaboratoryPage() {
  const { activeResearchTicker, setActiveResearchTicker } = useWorkspace();

  const currentSecurity =
    MOCK_SECURITIES.find((s) => s.ticker === activeResearchTicker) || MOCK_SECURITIES[0];

  // Default baseline inputs for NVDA
  const defaultInputs: DCFInputs = {
    forecastYears: 5,
    revenueGrowthRates: [45, 30, 20, 15, 10],
    operatingMargin: 60.0,
    taxRate: 15.0,
    reinvestmentRate: 6.0,
    wacc: 9.5,
    terminalGrowthRate: 3.5,
    currentRevenue: 112.8, // $B
    netDebt: -24.3, // Net cash of $24.3B
    sharesOutstanding: 24.5, // 24.5B shares post-split
  };

  const [inputs, setInputs] = useState<DCFInputs>(defaultInputs);
  const [activeScenario, setActiveScenario] = useState<"base" | "bull" | "bear" | "custom">("base");

  const handleApplyScenario = (type: "base" | "bull" | "bear") => {
    setActiveScenario(type);
    if (type === "base") {
      setInputs(defaultInputs);
    } else if (type === "bull") {
      setInputs({
        ...defaultInputs,
        revenueGrowthRates: [60, 42, 28, 20, 15],
        operatingMargin: 66.0,
        wacc: 9.0,
        terminalGrowthRate: 4.0,
      });
    } else if (type === "bear") {
      setInputs({
        ...defaultInputs,
        revenueGrowthRates: [25, 12, 6, 4, 3],
        operatingMargin: 48.0,
        wacc: 10.5,
        terminalGrowthRate: 2.5,
      });
    }
  };

  const handleReset = () => {
    handleApplyScenario("base");
  };

  // Run mathematical DCF engine
  const dcfOutput = useMemo(() => {
    return calculateDCF(inputs, currentSecurity.price);
  }, [inputs, currentSecurity.price]);

  const tickers = ["NVDA", "MSFT", "ASML", "LLY", "TSM"];

  return (
    <div className="space-y-6">
      {/* Page Title & Ticker Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Valuation Laboratory
            </h1>
            <DataProvenanceBadge type="MODEL_ESTIMATE" source="Discounted Cash Flow" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Gordon Growth DCF engine with live 2D WACC and terminal growth sensitivity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] font-medium">Security:</span>
          {tickers.map((t) => (
            <button
              key={t}
              onClick={() => setActiveResearchTicker(t)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer border ${
                activeResearchTicker === t
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-700"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t}
            </button>
          ))}
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs gap-1">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Primary Output Valuation Bridge Banner */}
      <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
              {currentSecurity.ticker} ({currentSecurity.name}) · Implied Intrinsic Value
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400 num-tabular">
                ${dcfOutput.impliedPerShare.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-[var(--text-secondary)]">per share</span>
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  dcfOutput.upsideDownside >= 0
                    ? "text-emerald-400 bg-emerald-950/50"
                    : "text-rose-400 bg-rose-950/50"
                }`}
              >
                {dcfOutput.upsideDownside >= 0 ? "+" : ""}
                {dcfOutput.upsideDownside.toFixed(1)}% vs ${currentSecurity.price.toFixed(2)} Spot
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed max-w-xl">
              Outputs represent theoretical estimates derived from specified discount rates and reinvestment parameters. Subject to input sensitivity.
            </p>
          </div>

          {/* Quick Bridge Components */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono num-tabular shrink-0">
            <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] block">PV of 5Y FCF</span>
              <span className="font-bold text-[var(--text-primary)]">${dcfOutput.sumPvFcf.toFixed(1)}B</span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] block">PV of Terminal Val</span>
              <span className="font-bold text-[var(--text-primary)]">${dcfOutput.pvTerminalValue.toFixed(1)}B</span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] block">Enterprise Value</span>
              <span className="font-bold text-emerald-400">${dcfOutput.enterpriseValue.toFixed(1)}B</span>
            </div>
          </div>
        </div>

        {/* Scenario Switcher Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[var(--border-subtle)]/70">
          <span className="text-xs text-[var(--text-muted)] font-medium mr-1">Preset Scenarios:</span>
          <button
            onClick={() => handleApplyScenario("base")}
            className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer border ${
              activeScenario === "base"
                ? "bg-emerald-950/50 text-emerald-300 border-emerald-700 font-semibold"
                : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            Consensus Base Case
          </button>
          <button
            onClick={() => handleApplyScenario("bull")}
            className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer border ${
              activeScenario === "bull"
                ? "bg-emerald-950/50 text-emerald-300 border-emerald-700 font-semibold"
                : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            Bull Case (Blackwell & Inference Surge)
          </button>
          <button
            onClick={() => handleApplyScenario("bear")}
            className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer border ${
              activeScenario === "bear"
                ? "bg-rose-950/50 text-rose-300 border-rose-700 font-semibold"
                : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            Bear Case (Hyperscale CapEx Digestion)
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Controls on Left, Projection Table & Sensitivity on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column (1 span) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Model Assumptions & Drivers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {/* WACC */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">WACC (Discount Rate):</span>
                  <span className="font-mono font-bold text-emerald-400">{inputs.wacc.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="6.5"
                  max="14.0"
                  step="0.5"
                  value={inputs.wacc}
                  onChange={(e) => {
                    setActiveScenario("custom");
                    setInputs({ ...inputs, wacc: Number(e.target.value) });
                  }}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Terminal Growth */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Terminal Growth Rate (g):</span>
                  <span className="font-mono font-bold text-emerald-400">{inputs.terminalGrowthRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.5"
                  step="0.25"
                  value={inputs.terminalGrowthRate}
                  onChange={(e) => {
                    setActiveScenario("custom");
                    setInputs({ ...inputs, terminalGrowthRate: Number(e.target.value) });
                  }}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Operating Margin */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Normalized Operating Margin:</span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">{inputs.operatingMargin}%</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="75"
                  step="1"
                  value={inputs.operatingMargin}
                  onChange={(e) => {
                    setActiveScenario("custom");
                    setInputs({ ...inputs, operatingMargin: Number(e.target.value) });
                  }}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Reinvestment Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Reinvestment Rate (% Rev):</span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">{inputs.reinvestmentRate}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={inputs.reinvestmentRate}
                  onChange={(e) => {
                    setActiveScenario("custom");
                    setInputs({ ...inputs, reinvestmentRate: Number(e.target.value) });
                  }}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Revenue Growth Rates */}
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                <span className="font-semibold text-[var(--text-primary)] block">
                  Projected Revenue Growth YoY:
                </span>
                {inputs.revenueGrowthRates.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[var(--text-muted)]">Year {idx + 1}:</span>
                    <input
                      type="number"
                      value={g}
                      onChange={(e) => {
                        setActiveScenario("custom");
                        const next = [...inputs.revenueGrowthRates];
                        next[idx] = Number(e.target.value);
                        setInputs({ ...inputs, revenueGrowthRates: next });
                      }}
                      className="w-16 p-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-right text-[var(--text-primary)]"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outputs Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projected Cash Flow Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">5-Year Projected Cash Flow Breakdown ($B)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[11px] text-[var(--text-muted)] font-medium">
                      <th className="p-2.5 pl-4">Metric</th>
                      {[1, 2, 3, 4, 5].map((y) => (
                        <th key={y} className="p-2.5 text-right font-mono">
                          Year {y}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]/40 num-tabular">
                    <tr>
                      <td className="p-2.5 pl-4 text-[var(--text-secondary)]">Revenue ($B)</td>
                      {dcfOutput.projectedRevenues.map((r, i) => (
                        <td key={i} className="p-2.5 text-right font-mono text-[var(--text-primary)]">
                          ${r.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 pl-4 text-[var(--text-secondary)]">Operating Income (EBIT)</td>
                      {dcfOutput.projectedEbit.map((e, i) => (
                        <td key={i} className="p-2.5 text-right font-mono text-[var(--text-primary)]">
                          ${e.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 pl-4 font-semibold text-[var(--text-primary)]">Free Cash Flow</td>
                      {dcfOutput.projectedFcf.map((f, i) => (
                        <td key={i} className="p-2.5 text-right font-mono font-semibold text-emerald-400">
                          ${f.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 pl-4 text-[var(--text-muted)] text-[11px]">PV Discounted FCF</td>
                      {dcfOutput.presentValueFcf.map((pv, i) => (
                        <td key={i} className="p-2.5 text-right font-mono text-sky-400 text-[11px]">
                          ${pv.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 2D Sensitivity Matrix */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">2D Valuation Sensitivity Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <SensitivityHeatmap
                matrix={dcfOutput.sensitivityMatrix}
                currentPrice={currentSecurity.price}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
