"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MOCK_SECURITIES } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { Sparkline } from "@/components/charts/Sparkline";
import { formatCurrency, formatPercent } from "@/lib/utils";

type SortField = "ticker" | "price" | "changePercent" | "marketCap" | "peRatio" | "roic" | "fcfYield" | "revenueGrowth";
type SortDirection = "asc" | "desc";

export default function DiscoveryScreenerPage() {
  const { watchlist, toggleWatchlist, setActiveResearchTicker } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [activePreset, setActivePreset] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Filter thresholds
  const [minRoic, setMinRoic] = useState<number>(0);
  const [maxPe, setMaxPe] = useState<number>(150);
  const [minFcfYield, setMinFcfYield] = useState<number>(0);

  const presets = [
    { id: "all", label: "01. Complete Universe", desc: "All coverage securities" },
    { id: "quality", label: "02. High-ROIC Compounders", desc: "ROIC > 25%, Low Leverage" },
    { id: "fcf", label: "03. FCF Yielders", desc: "FCF Yield > 3.0%" },
    { id: "growth", label: "04. Hyper-Growth", desc: "Revenue Growth > 25% YoY" },
  ];

  const handleApplyPreset = (presetId: string) => {
    setActivePreset(presetId);
    if (presetId === "all") {
      setMinRoic(0);
      setMaxPe(150);
      setMinFcfYield(0);
      setSelectedSector("All");
    } else if (presetId === "quality") {
      setMinRoic(25);
      setMaxPe(60);
      setMinFcfYield(0);
    } else if (presetId === "fcf") {
      setMinRoic(0);
      setMaxPe(40);
      setMinFcfYield(3.0);
    } else if (presetId === "growth") {
      setMinRoic(20);
      setMaxPe(150);
      setMinFcfYield(0);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleSelectSecurity = (ticker: string) => {
    setSelectedTickers((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker].slice(0, 3)
    );
  };

  const filteredSecurities = useMemo(() => {
    return MOCK_SECURITIES.filter((sec) => {
      const matchesSearch =
        sec.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sec.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector = selectedSector === "All" || sec.sector === selectedSector;
      const matchesRoic = sec.roic >= minRoic;
      const matchesPe = sec.peRatio <= maxPe;
      const matchesFcf = sec.fcfYield >= minFcfYield;

      if (activePreset === "growth" && sec.revenueGrowth < 25) return false;

      return matchesSearch && matchesSector && matchesRoic && matchesPe && matchesFcf;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
  }, [searchQuery, selectedSector, minRoic, maxPe, minFcfYield, activePreset, sortField, sortDirection]);

  const sectors = ["All", "Technology", "Healthcare", "Semiconductors"];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>DISPATCH: SCREENER REGISTRY</span>
            <span>·</span>
            <span>POINT-IN-TIME EQUITY FILTRATION</span>
          </div>
          <div className="flex items-center gap-3">
            <DataProvenanceBadge
              type="VERIFIED_EXTERNAL"
              source="SEC EDGAR 10-K / Point-in-Time"
            />
            {selectedTickers.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCompareOpen(true)}
                className="text-xs font-mono"
              >
                <span>Compare Selected ({selectedTickers.length})</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Securities Discovery Screener
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Filter institutional securities by economic moat factors, return on capital (ROIC), and cash generation yields.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mr-1">
          MANDATE PRESETS:
        </span>
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => handleApplyPreset(p.id)}
            className={`px-3 py-1.5 text-xs font-mono transition-colors border cursor-pointer ${
              activePreset === p.id
                ? "bg-[#111210] dark:bg-[#F4F1E9] text-[#F4F1E9] dark:text-[#111210] border-transparent font-semibold"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--hairline)] hover:border-[#365CFF] hover:text-[#365CFF]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 border border-[var(--hairline)] bg-[var(--bg-surface)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search ticker, name, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#365CFF]"
            />
          </div>

          {/* Sector select */}
          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full h-9 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#365CFF]"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  Sector: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Min ROIC */}
          <div className="flex items-center gap-2 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase shrink-0">ROIC ≥</span>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={minRoic}
              onChange={(e) => setMinRoic(Number(e.target.value))}
              className="w-full accent-[#365CFF] cursor-pointer"
            />
            <span className="font-mono text-[var(--text-primary)] font-semibold w-8 text-right text-xs">
              {minRoic}%
            </span>
          </div>

          {/* Max P/E */}
          <div className="flex items-center gap-2 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase shrink-0">P/E ≤</span>
            <input
              type="range"
              min="15"
              max="120"
              step="5"
              value={maxPe}
              onChange={(e) => setMaxPe(Number(e.target.value))}
              className="w-full accent-[#365CFF] cursor-pointer"
            />
            <span className="font-mono text-[var(--text-primary)] font-semibold w-8 text-right text-xs">
              {maxPe}x
            </span>
          </div>
        </div>

        {/* Filter status row */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--hairline)]">
          <div>
            Showing <strong className="text-[var(--text-primary)]">{filteredSecurities.length}</strong> of {MOCK_SECURITIES.length} securities matching criteria
          </div>
          <button
            onClick={() => handleApplyPreset("all")}
            className="text-[#365CFF] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Securities Screener Data Table */}
      <div className="border border-[var(--hairline)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider select-none">
                <th className="p-3.5 pl-5 w-10">Select</th>
                <th
                  onClick={() => handleSort("ticker")}
                  className="p-3.5 cursor-pointer hover:text-[var(--text-primary)]"
                >
                  <div className="flex items-center gap-1">
                    <span>Ticker</span>
                    {sortField === "ticker" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 text-[#365CFF]" /> : <ArrowDown className="h-3 w-3 text-[#365CFF]" />)}
                  </div>
                </th>
                <th className="p-3.5">Company & Sector</th>
                <th
                  onClick={() => handleSort("price")}
                  className="p-3.5 text-right cursor-pointer hover:text-[var(--text-primary)]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    {sortField === "price" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 text-[#365CFF]" /> : <ArrowDown className="h-3 w-3 text-[#365CFF]" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("changePercent")}
                  className="p-3.5 text-right cursor-pointer hover:text-[var(--text-primary)]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>1D Change</span>
                    {sortField === "changePercent" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 text-[#365CFF]" /> : <ArrowDown className="h-3 w-3 text-[#365CFF]" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("marketCap")}
                  className="p-3.5 text-right cursor-pointer hover:text-[var(--text-primary)]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Market Cap</span>
                    {sortField === "marketCap" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 text-[#365CFF]" /> : <ArrowDown className="h-3 w-3 text-[#365CFF]" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("peRatio")}
                  className="p-3.5 text-right cursor-pointer hover:text-[var(--text-primary)]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>P/E</span>
                    {sortField === "peRatio" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 text-[#365CFF]" /> : <ArrowDown className="h-3 w-3 text-[#365CFF]" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("roic")}
                  className="p-3.5 text-right cursor-pointer hover:text-[var(--text-primary)]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>ROIC</span>
                    {sortField === "roic" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 text-[#365CFF]" /> : <ArrowDown className="h-3 w-3 text-[#365CFF]" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("fcfYield")}
                  className="p-3.5 text-right cursor-pointer hover:text-[var(--text-primary)]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>FCF Yield</span>
                    {sortField === "fcfYield" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 text-[#365CFF]" /> : <ArrowDown className="h-3 w-3 text-[#365CFF]" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("revenueGrowth")}
                  className="p-3.5 text-right cursor-pointer hover:text-[var(--text-primary)]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Rev Growth</span>
                    {sortField === "revenueGrowth" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 text-[#365CFF]" /> : <ArrowDown className="h-3 w-3 text-[#365CFF]" />)}
                  </div>
                </th>
                <th className="p-3.5 text-center">Trend (30D)</th>
                <th className="p-3.5 text-center pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)] num-tabular">
              {filteredSecurities.map((sec) => {
                const isSelected = selectedTickers.includes(sec.ticker);
                const isSaved = watchlist.includes(sec.ticker);

                return (
                  <tr
                    key={sec.ticker}
                    className={`hover:bg-[var(--bg-surface-elevated)]/40 transition-colors ${
                      isSelected ? "bg-[#365CFF]/5" : ""
                    }`}
                  >
                    <td className="p-3.5 pl-5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectSecurity(sec.ticker)}
                        className="accent-[#365CFF] cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[var(--text-primary)]">
                      <Link
                        href={`/app/research?ticker=${sec.ticker}`}
                        onClick={() => setActiveResearchTicker(sec.ticker)}
                        className="hover:text-[#365CFF]"
                      >
                        {sec.ticker}
                      </Link>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-[var(--text-primary)] truncate max-w-[150px]">
                        {sec.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)]">
                        {sec.sector}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-mono font-semibold text-[var(--text-primary)]">
                      {formatCurrency(sec.price)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-semibold">
                      <span
                        className={
                          sec.changePercent >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }
                      >
                        {formatPercent(sec.changePercent, true)}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono text-[var(--text-secondary)]">
                      ${sec.marketCap}B
                    </td>
                    <td className="p-3.5 text-right font-mono text-[var(--text-secondary)]">
                      {sec.peRatio.toFixed(1)}x
                    </td>
                    <td className="p-3.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {sec.roic.toFixed(1)}%
                    </td>
                    <td className="p-3.5 text-right font-mono text-[#365CFF]">
                      {sec.fcfYield.toFixed(2)}%
                    </td>
                    <td className="p-3.5 text-right font-mono text-[var(--text-secondary)]">
                      +{sec.revenueGrowth.toFixed(1)}%
                    </td>
                    <td className="p-3.5 text-center">
                      <Sparkline data={sec.sparkline} width={68} height={20} className="mx-auto" />
                    </td>
                    <td className="p-3.5 text-center pr-5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => toggleWatchlist(sec.ticker)}
                          className={`p-1.5 border border-transparent hover:border-[var(--hairline)] transition-colors cursor-pointer ${
                            isSaved ? "text-amber-500" : "text-[var(--text-muted)]"
                          }`}
                          title={isSaved ? "Remove from watchlist" : "Add to watchlist"}
                        >
                          <Star className="h-3.5 w-3.5 fill-current" />
                        </button>
                        <Link
                          href={`/app/research?ticker=${sec.ticker}`}
                          onClick={() => setActiveResearchTicker(sec.ticker)}
                        >
                          <Button variant="outline" size="sm" className="h-7 px-2 font-mono text-[11px]">
                            Research
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-4xl bg-[var(--bg-surface)] border border-[var(--hairline)] p-6 overflow-hidden max-h-[90vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--hairline)]">
              <div>
                <h3 className="font-serif text-xl font-normal text-[var(--text-primary)]">
                  Multi-Security Factor Comparison
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Side-by-side fundamental ratios and valuation multiples
                </p>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              <div className="grid grid-cols-4 gap-4 text-xs">
                {/* Metric Names column */}
                <div className="space-y-3 font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider pt-12">
                  <div className="py-1">Sector</div>
                  <div className="py-1">Spot Price</div>
                  <div className="py-1">Market Cap</div>
                  <div className="py-1">Trailing P/E</div>
                  <div className="py-1">Forward P/E</div>
                  <div className="py-1">ROIC (Moat)</div>
                  <div className="py-1">FCF Yield</div>
                  <div className="py-1">Rev Growth</div>
                  <div className="py-1">Debt to Equity</div>
                  <div className="py-1">Thesis Status</div>
                </div>

                {/* Selected securities columns */}
                {selectedTickers.map((ticker) => {
                  const sec = MOCK_SECURITIES.find((s) => s.ticker === ticker);
                  if (!sec) return null;
                  return (
                    <div
                      key={ticker}
                      className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 space-y-3 text-center num-tabular"
                    >
                      <div className="pb-3 border-b border-[var(--hairline)]">
                        <div className="font-mono font-bold text-sm text-[#365CFF]">
                          {sec.ticker}
                        </div>
                        <div className="text-[11px] text-[var(--text-primary)] truncate">
                          {sec.name}
                        </div>
                      </div>

                      <div className="py-1 text-[11px] text-[var(--text-secondary)] truncate">
                        {sec.sector}
                      </div>
                      <div className="py-1 font-semibold text-[var(--text-primary)] font-mono">
                        {formatCurrency(sec.price)}
                      </div>
                      <div className="py-1 font-mono">${sec.marketCap}B</div>
                      <div className="py-1 font-mono">{sec.peRatio.toFixed(1)}x</div>
                      <div className="py-1 font-mono">{sec.forwardPe.toFixed(1)}x</div>
                      <div className="py-1 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{sec.roic.toFixed(1)}%</div>
                      <div className="py-1 font-mono text-[#365CFF] font-semibold">{sec.fcfYield.toFixed(2)}%</div>
                      <div className="py-1 font-mono">+{sec.revenueGrowth.toFixed(1)}%</div>
                      <div className="py-1 font-mono">{sec.debtToEquity.toFixed(2)}x</div>
                      <div className="py-1">
                        <Badge
                          variant={sec.thesisStatus === "HEALTHY" ? "healthy" : "watch"}
                          size="xs"
                        >
                          {sec.thesisStatus}
                        </Badge>
                      </div>

                      <div className="pt-3 border-t border-[var(--hairline)]">
                        <Link
                          href={`/app/research?ticker=${sec.ticker}`}
                          onClick={() => {
                            setActiveResearchTicker(sec.ticker);
                            setIsCompareOpen(false);
                          }}
                        >
                          <Button variant="primary" size="sm" className="w-full text-xs font-mono">
                            Deep Dive →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
