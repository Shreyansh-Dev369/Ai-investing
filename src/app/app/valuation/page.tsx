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
    currentRevenue: 112.8,
    netDebt: -24.3,
    sharesOutstanding: 24.5,
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
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>DISPATCH: VALUATION BENCHMARK</span>
            <span>·</span>
            <span>INTRINSIC DISCOUNTED CASH FLOW MODEL</span>
          </div>
          <div className="flex items-center gap-3">
            <DataProvenanceBadge type="MODEL_ESTIMATE" source="Discounted Cash Flow" />
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              2D SENSITIVITY ACTIVE
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Valuation Laboratory
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Gordon Growth multi-stage DCF engine with dynamic 2D WACC and terminal growth sensitivity matrices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-muted)] mr-1">TICKER:</span>
            {tickers.map((t) => (
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
            <Button variant="outline" size="sm" onClick={handleReset} className="text-xs font-mono gap-1 ml-2">
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Intrinsic Valuation Callout Card */}
      <div className="border border-[var(--hairline)] bg-[var(--bg-surface)] p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--hairline)]">
          <div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
              {currentSecurity.ticker} ({currentSecurity.name}) · IMPLIED INTRINSIC VALUE
            </div>
            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="font-serif text-4xl sm:text-5xl font-normal text-[var(--text-primary)] num-tabular">
                ${dcfOutput.impliedPerShare.toFixed(2)}
              </span>
              <span className="text-sm font-mono text-[var(--text-secondary)]">per share</span>
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 border ${
                  dcfOutput.upsideDownside >= 0
                    ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                    : "text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10"
                }`}
              >
                {dcfOutput.upsideDownside >= 0 ? "+" : ""}
                {dcfOutput.upsideDownside.toFixed(1)}% vs ${currentSecurity.price.toFixed(2)} Spot
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed max-w-xl">
              Model outputs reflect Gordon Growth discounting under user-specified cost of capital and reinvestment requirements.
            </p>
          </div>

          {/* Valuation Bridge Components */}
          <div className="grid grid-cols-3 gap-3 text-xs font-mono num-tabular shrink-0">
            <div className="p-3.5 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">PV of 5Y FCF</span>
              <span className="font-bold text-[var(--text-primary)] text-sm">${dcfOutput.sumPvFcf.toFixed(1)}B</span>
            </div>
            <div className="p-3.5 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Terminal Val PV</span>
              <span className="font-bold text-[var(--text-primary)] text-sm">${dcfOutput.pvTerminalValue.toFixed(1)}B</span>
            </div>
            <div className="p-3.5 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Enterprise Val</span>
              <span className="font-bold text-[#365CFF] text-sm">${dcfOutput.enterpriseValue.toFixed(1)}B</span>
            </div>
          </div>
        </div>

        {/* Preset Scenarios Switcher */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
            SCENARIO RUNWAY:
          </span>
          <button
            onClick={() => handleApplyScenario("base")}
            className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer border ${
              activeScenario === "base"
                ? "bg-[#111210] dark:bg-[#F4F1E9] text-[#F4F1E9] dark:text-[#111210] border-transparent font-semibold"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--hairline)] hover:border-[#365CFF]"
            }`}
          >
            Consensus Base Case
          </button>
          <button
            onClick={() => handleApplyScenario("bull")}
            className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer border ${
              activeScenario === "bull"
                ? "bg-emerald-600 text-white border-transparent font-semibold"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--hairline)] hover:border-emerald-500"
            }`}
          >
            Bull Case (Blackwell Surge)
          </button>
          <button
            onClick={() => handleApplyScenario("bear")}
            className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer border ${
              activeScenario === "bear"
                ? "bg-rose-600 text-white border-transparent font-semibold"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--hairline)] hover:border-rose-500"
            }`}
          >
            Bear Case (CapEx Digestion)
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Projection Table & Sensitivity on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column (1 span) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                PARAMETERS
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                Model Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5 text-xs">
              {/* WACC */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-secondary)]">WACC (Discount Rate):</span>
                  <span className="font-bold text-[#365CFF]">{inputs.wacc.toFixed(1)}%</span>
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
                  className="w-full accent-[#365CFF] cursor-pointer"
                />
              </div>

              {/* Terminal Growth */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-secondary)]">Terminal Growth (g):</span>
                  <span className="font-bold text-[#365CFF]">{inputs.terminalGrowthRate.toFixed(1)}%</span>
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
                  className="w-full accent-[#365CFF] cursor-pointer"
                />
              </div>

              {/* Operating Margin */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-secondary)]">Normalized Margin:</span>
                  <span className="font-bold text-[var(--text-primary)]">{inputs.operatingMargin}%</span>
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
                  className="w-full accent-[#365CFF] cursor-pointer"
                />
              </div>

              {/* Reinvestment Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-secondary)]">Reinvestment Rate:</span>
                  <span className="font-bold text-[var(--text-primary)]">{inputs.reinvestmentRate}%</span>
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
                  className="w-full accent-[#365CFF] cursor-pointer"
                />
              </div>

              {/* Revenue Growth Rates */}
              <div className="pt-3 border-t border-[var(--hairline)] space-y-2.5">
                <span className="font-mono text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                  Projected Revenue Growth YoY (%):
                </span>
                {inputs.revenueGrowthRates.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono">
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
                      className="w-16 p-1 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-right text-[var(--text-primary)] focus:outline-none focus:border-[#365CFF]"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outputs Column (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Projected Cash Flow Table */}
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                SCHEDULE 3.1 · CASH FLOW PROJECTION
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                5-Year Projected Cash Flow Breakdown ($B)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="p-3.5 pl-5">Metric</th>
                      {[1, 2, 3, 4, 5].map((y) => (
                        <th key={y} className="p-3.5 text-right font-mono">
                          Year {y}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--hairline)] num-tabular">
                    <tr>
                      <td className="p-3.5 pl-5 text-[var(--text-secondary)]">Revenue ($B)</td>
                      {dcfOutput.projectedRevenues.map((r, i) => (
                        <td key={i} className="p-3.5 text-right font-mono text-[var(--text-primary)]">
                          ${r.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 pl-5 text-[var(--text-secondary)]">Operating Income (EBIT)</td>
                      {dcfOutput.projectedEbit.map((e, i) => (
                        <td key={i} className="p-3.5 text-right font-mono text-[var(--text-primary)]">
                          ${e.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 pl-5 font-semibold text-[var(--text-primary)]">Free Cash Flow</td>
                      {dcfOutput.projectedFcf.map((f, i) => (
                        <td key={i} className="p-3.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          ${f.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 pl-5 text-[var(--text-muted)] text-[11px]">PV Discounted FCF</td>
                      {dcfOutput.presentValueFcf.map((pv, i) => (
                        <td key={i} className="p-3.5 text-right font-mono text-[#365CFF] text-[11px]">
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
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                FIGURE 3.2 · 2D STRESS TESTING
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                Valuation Sensitivity Matrix (WACC × Terminal Growth)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
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
