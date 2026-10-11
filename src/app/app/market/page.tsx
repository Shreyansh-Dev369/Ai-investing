"use client";

import React from "react";
import { Info } from "lucide-react";
import {
  MOCK_INDICES,
  MOCK_MACRO_INDICATORS,
  MOCK_NEWS_CATALYSTS,
} from "@/data/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { Sparkline } from "@/components/charts/Sparkline";

export default function MarketIntelligencePage() {

  const sectors = [
    { name: "Information Technology", move: 1.42, weight: "31.2%" },
    { name: "Health Care", move: 0.85, weight: "11.8%" },
    { name: "Financial Services", move: 0.54, weight: "13.1%" },
    { name: "Communication Services", move: 0.48, weight: "9.2%" },
    { name: "Consumer Discretionary", move: 0.22, weight: "10.4%" },
    { name: "Industrials", move: -0.15, weight: "8.3%" },
    { name: "Consumer Staples", move: -0.28, weight: "5.8%" },
    { name: "Materials", move: -0.41, weight: "2.4%" },
    { name: "Utilities", move: -0.65, weight: "2.5%" },
    { name: "Real Estate", move: -0.88, weight: "2.2%" },
    { name: "Energy", move: -1.15, weight: "3.1%" },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>DISPATCH: MACRO INTELLIGENCE</span>
            <span>·</span>
            <span>SOVEREIGN RATES & SECTOR ROTATION</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              DATA DELAY: 15M AUDITED
            </span>
            <DataProvenanceBadge type="VERIFIED_EXTERNAL" source="FRED / BLS / Wire Feeds" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Market Intelligence & Macro Context
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Global rate curves, central bank liquidity conditions, cross-sector dispersion, and verified market wire catalysts.
            </p>
          </div>
        </div>
      </div>

      {/* Major Benchmark Indices Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {MOCK_INDICES.map((idx) => (
          <div
            key={idx.symbol}
            className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)] space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-primary)]">{idx.name}</span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{idx.symbol}</span>
            </div>

            <div className="flex items-baseline justify-between num-tabular">
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">
                {idx.value.toLocaleString()}
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  idx.changePct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {idx.changePct >= 0 ? "+" : ""}
                {idx.changePct}%
              </span>
            </div>

            <div className="pt-1.5 border-t border-[var(--hairline)] flex items-center justify-between">
              <Sparkline data={idx.history} width={64} height={18} />
              <div className="text-[10px] font-mono text-[var(--text-muted)]">
                52W: {idx.low52.toFixed(0)}-{idx.high52.toFixed(0)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Macro Indicators & Sector Rotation on Left, News on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Macro Indicators Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  SCHEDULE 9.1 · OFFICIAL RELEASES
                </div>
                <CardTitle className="font-serif text-lg font-normal mt-0.5">
                  Core Macroeconomic Indicators
                </CardTitle>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Federal Reserve policy rate, inflation prints, and financial conditions
                </p>
              </div>
              <Badge variant="provenance">Official Government Series</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="p-3.5 pl-5">Economic Series</th>
                      <th className="p-3.5">Current Print</th>
                      <th className="p-3.5">Prior Release</th>
                      <th className="p-3.5">Source</th>
                      <th className="p-3.5 pr-5">Macroeconomic Implication</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--hairline)] num-tabular">
                    {MOCK_MACRO_INDICATORS.map((m) => (
                      <tr key={m.id} className="hover:bg-[var(--bg-surface-elevated)]/40 transition-colors">
                        <td className="p-3.5 pl-5">
                          <div className="font-semibold text-[var(--text-primary)]">{m.name}</div>
                          <div className="text-[10px] font-mono text-[var(--text-muted)]">{m.category}</div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {m.currentValue}
                        </td>
                        <td className="p-3.5 font-mono text-[var(--text-muted)]">
                          {m.previousValue}
                        </td>
                        <td className="p-3.5 text-[11px] font-mono text-[var(--text-secondary)]">
                          {m.source}
                        </td>
                        <td className="p-3.5 pr-5 text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
                          {m.implication}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sector Heatmap & Dispersion */}
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                FIGURE 9.2 · SECTOR DISPERSION
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                S&P 500 Sector Daily Return Dispersion
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs num-tabular">
                {sectors.map((s) => {
                  const isUp = s.move >= 0;
                  return (
                    <div
                      key={s.name}
                      className={`p-3 border text-left flex flex-col justify-between ${
                        isUp
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : "bg-rose-500/5 border-rose-500/30"
                      }`}
                    >
                      <div className="text-[11px] text-[var(--text-primary)] font-medium truncate">
                        {s.name}
                      </div>
                      <div className="flex items-baseline justify-between mt-2.5 pt-1.5 border-t border-[var(--hairline)]/40">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {s.weight}
                        </span>
                        <span
                          className={`font-mono font-bold text-xs ${
                            isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isUp ? "+" : ""}
                          {s.move.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 span): Sourced Catalysts Feed */}
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  NEWS WIRE
                </div>
                <CardTitle className="font-serif text-lg font-normal mt-0.5">
                  Verified Wire Feeds
                </CardTitle>
              </div>
              <Badge variant="provenance">Sourced Wire Feeds</Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Disclaimer */}
              <div className="p-3 border border-[#365CFF]/30 bg-[#365CFF]/5 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                <Info className="h-3.5 w-3.5 inline mr-1.5 text-[#365CFF]" />
                <span>
                  Sentiment scores are model-generated natural language estimates, not objective financial facts.
                </span>
              </div>

              {MOCK_NEWS_CATALYSTS.map((n) => (
                <div
                  key={n.id}
                  className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-[var(--text-primary)] leading-snug">
                      {n.headline}
                    </span>
                    {n.ticker && (
                      <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] font-mono text-[10px] text-[#365CFF] shrink-0">
                        {n.ticker}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {n.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--hairline)]">
                    <span>{n.source}</span>
                    <span className="text-[#365CFF]">Sentiment: +{n.sentimentScore.toFixed(2)}</span>
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
