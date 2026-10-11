"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe2,
  TrendingUp,
  Activity,
  Calendar,
  AlertCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  MOCK_INDICES,
  MOCK_MACRO_INDICATORS,
  MOCK_NEWS_CATALYSTS,
} from "@/data/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { Sparkline } from "@/components/charts/Sparkline";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function MarketIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

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
    <div className="space-y-6">
      {/* Title & Data Freshness Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Market Intelligence & Macro Context
            </h1>
            <DataProvenanceBadge type="VERIFIED_EXTERNAL" source="FRED / BLS / Wire Feeds" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Macroeconomic rate structure, sovereign yield curves, sector rotation, and sourced financial wire catalysts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Market Session: Open · Data Delay: 15m</span>
        </div>
      </div>

      {/* Major Benchmark Indices Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {MOCK_INDICES.map((idx) => (
          <div
            key={idx.symbol}
            className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-primary)]">{idx.name}</span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{idx.symbol}</span>
            </div>

            <div className="flex items-baseline justify-between num-tabular">
              <span className="font-mono text-base font-bold text-[var(--text-primary)]">
                {idx.value.toLocaleString()}
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  idx.changePct >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {idx.changePct >= 0 ? "+" : ""}
                {idx.changePct}%
              </span>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <Sparkline data={idx.history} width={70} height={18} />
              <div className="text-[10px] font-mono text-[var(--text-muted)]">
                Range: {idx.low52.toFixed(0)} - {idx.high52.toFixed(0)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Macro Indicators & Sector Rotation on Left, News on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Macro Indicators Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Core Macroeconomic Indicators</CardTitle>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Federal Reserve policy, inflation prints, and financial conditions
                </p>
              </div>
              <Badge variant="provenance">Official Government Series</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[11px] text-[var(--text-muted)] font-medium">
                      <th className="p-3 pl-4">Economic Series</th>
                      <th className="p-3">Current Print</th>
                      <th className="p-3">Prior Release</th>
                      <th className="p-3">Source</th>
                      <th className="p-3 pr-4">Macroeconomic Implication</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]/40 num-tabular">
                    {MOCK_MACRO_INDICATORS.map((m) => (
                      <tr key={m.id} className="hover:bg-[var(--bg-surface-elevated)]/30">
                        <td className="p-3 pl-4">
                          <div className="font-semibold text-[var(--text-primary)]">{m.name}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{m.category}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          {m.currentValue}
                        </td>
                        <td className="p-3 font-mono text-[var(--text-muted)]">
                          {m.previousValue}
                        </td>
                        <td className="p-3 text-[11px] text-[var(--text-secondary)]">
                          {m.source}
                        </td>
                        <td className="p-3 pr-4 text-[11px] text-[var(--text-secondary)] max-w-xs leading-relaxed">
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">S&P 500 Sector Daily Return Dispersion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs num-tabular">
                {sectors.map((s) => {
                  const isUp = s.move >= 0;
                  return (
                    <div
                      key={s.name}
                      className={`p-2.5 rounded-lg border text-left flex flex-col justify-between ${
                        isUp
                          ? "bg-emerald-950/20 border-emerald-900/40"
                          : "bg-rose-950/20 border-rose-900/40"
                      }`}
                    >
                      <div className="text-[11px] text-[var(--text-primary)] font-medium truncate">
                        {s.name}
                      </div>
                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {s.weight}
                        </span>
                        <span
                          className={`font-mono font-bold text-xs ${
                            isUp ? "text-emerald-400" : "text-rose-400"
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
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Verified Financial Wire News</CardTitle>
              <Badge variant="provenance">Sourced Wire Feeds</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Disclaimer */}
              <div className="p-2.5 rounded bg-sky-950/30 border border-sky-900/40 text-[11px] text-sky-300 leading-relaxed">
                <Info className="h-3.5 w-3.5 inline mr-1 text-sky-400" />
                <span>
                  Sentiment scores are model-generated natural language estimates, not objective financial facts.
                </span>
              </div>

              {MOCK_NEWS_CATALYSTS.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-[var(--text-primary)] leading-snug">
                      {n.headline}
                    </span>
                    {n.ticker && (
                      <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px] text-emerald-400 shrink-0">
                        {n.ticker}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {n.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]/50">
                    <span>{n.source}</span>
                    <span className="text-emerald-400">Sentiment: +{n.sentimentScore.toFixed(2)}</span>
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
