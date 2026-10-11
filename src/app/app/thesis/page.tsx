"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Plus,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ThesisItem, ThesisStatus } from "@/types";
import { MOCK_SECURITIES } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";

export default function ThesisHealthMonitorPage() {
  const { theses, setActiveResearchTicker } = useWorkspace();

  const [filterStatus, setFilterStatus] = useState<"ALL" | ThesisStatus>("ALL");
  const [selectedThesisId, setSelectedThesisId] = useState<string>(theses[0]?.id || "");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states for creating a new thesis
  const [newTicker, setNewTicker] = useState("TSM");
  const [newRationale, setNewRationale] = useState("");
  const [newAssumption, setNewAssumption] = useState("");
  const [newTripwire, setNewTripwire] = useState("");

  const filteredTheses = theses.filter(
    (t) => filterStatus === "ALL" || t.status === filterStatus
  );

  const activeThesis = theses.find((t) => t.id === selectedThesisId) || theses[0];

  const healthyCount = theses.filter((t) => t.status === "HEALTHY").length;
  const watchCount = theses.filter((t) => t.status === "WATCH").length;
  const atRiskCount = theses.filter((t) => t.status === "AT_RISK").length;

  const handleCreateThesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRationale.trim()) return;

    const sec = MOCK_SECURITIES.find((s) => s.ticker === newTicker);
    const newThesisItem: ThesisItem = {
      id: `thesis-${newTicker.toLowerCase()}-${Date.now()}`,
      ticker: newTicker,
      companyName: sec ? sec.name : newTicker,
      status: "HEALTHY",
      dateCreated: new Date().toISOString().slice(0, 10),
      lastEvaluated: new Date().toISOString().slice(0, 10),
      targetHorizon: "3-5 Years",
      originalThesis: newRationale,
      coreAssumptions: [
        newAssumption || "Gross margin sustains above 50%",
        "Leading-edge node capacity utilization remains > 90%",
      ],
      kpiTracking: [
        {
          kpi: "Revenue YoY Growth",
          originalAssumption: "> 20%",
          actualObserved: "+39.0%",
          variance: "+1900 bps",
          status: "AHEAD",
        },
      ],
      tripwires: [newTripwire || "Quarterly utilization drops below 80%"],
      alerts: [],
    };

    // add to context
    theses.push(newThesisItem);
    setSelectedThesisId(newThesisItem.id);
    setIsCreateModalOpen(false);
    setNewRationale("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Thesis Health Monitor
            </h1>
            <Badge variant="healthy" size="xs">
              Signature Capability
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Continuous verification: track whether your original investment thesis remains supported by filed data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Define Investment Thesis</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Active Theses</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-0.5">{theses.length}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">Institutional Coverage</div>
        </div>

        <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-emerald-900/50">
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Healthy (Intact)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">{healthyCount}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">Assumptions Verified</div>
        </div>

        <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-amber-900/50">
          <div className="text-[11px] font-mono text-amber-400 uppercase">On Watch</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">{watchCount}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">Variance Detected</div>
        </div>

        <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-rose-900/50">
          <div className="text-[11px] font-mono text-rose-400 uppercase">At Risk (Breached)</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-0.5">{atRiskCount}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">Tripwire Triggered</div>
        </div>
      </div>

      {/* Main Grid: Thesis List on Left, Active Thesis Deep Dive on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Thesis Selection Cards (1 span) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pb-1">
            <span className="font-medium text-[var(--text-secondary)]">Monitored Securities</span>
            <div className="flex items-center gap-1">
              {(["ALL", "HEALTHY", "WATCH"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                    filterStatus === s
                      ? "bg-slate-700 text-white font-bold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredTheses.map((t) => {
              const isSelected = selectedThesisId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedThesisId(t.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-[var(--bg-surface-elevated)] border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30"
                      : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs text-[var(--text-primary)]">
                      {t.ticker} · {t.companyName}
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
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono mt-2 pt-2 border-t border-[var(--border-subtle)]/50">
                    <span>Horizon: {t.targetHorizon}</span>
                    <span>Last: {t.lastEvaluated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Health Dossier (2 spans) */}
        {activeThesis && (
          <div className="lg:col-span-2 space-y-6">
            {/* Thesis Banner */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
                    Investment Thesis Audit
                  </div>
                  <CardTitle className="text-base mt-0.5">
                    {activeThesis.ticker} — {activeThesis.companyName}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      activeThesis.status === "HEALTHY"
                        ? "healthy"
                        : activeThesis.status === "WATCH"
                        ? "watch"
                        : "at-risk"
                    }
                    size="sm"
                  >
                    STATUS: {activeThesis.status}
                  </Badge>
                  <Link
                    href={`/app/research?ticker=${activeThesis.ticker}`}
                    onClick={() => setActiveResearchTicker(activeThesis.ticker)}
                  >
                    <Button variant="outline" size="sm" className="text-xs">
                      Company Deep Dive →
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Original Thesis Rationale */}
                <div className="p-3.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs">
                  <span className="font-semibold text-emerald-400 block mb-1">
                    Original Investment Thesis Rationale:
                  </span>
                  <p className="text-[var(--text-primary)] leading-relaxed italic">
                    &ldquo;{activeThesis.originalThesis}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono mt-2 pt-2 border-t border-[var(--border-subtle)]/50">
                    <span>Inception Date: {activeThesis.dateCreated}</span>
                    <span>Evaluation Period: TTM Filings</span>
                  </div>
                </div>

                {/* Core Assumptions List */}
                <div className="space-y-2 text-xs">
                  <span className="font-semibold text-[var(--text-primary)] block">
                    Underlying Business Assumptions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeThesis.coreAssumptions.map((assump, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-start gap-2"
                      >
                        <span className="text-emerald-400 font-mono font-bold shrink-0">
                          0{idx + 1}.
                        </span>
                        <span className="text-[var(--text-secondary)] leading-relaxed">{assump}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KPI Tracking Table */}
                <div className="space-y-2 text-xs pt-2 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-primary)]">
                      KPI Tracking vs. Filing Reality
                    </span>
                    <DataProvenanceBadge type="VERIFIED_EXTERNAL" source="SEC 10-Q Disclosures" />
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[11px] text-[var(--text-muted)] font-medium">
                          <th className="p-2.5 pl-3">Metric KPI</th>
                          <th className="p-2.5">Original Target</th>
                          <th className="p-2.5">Actual Observed</th>
                          <th className="p-2.5">Variance</th>
                          <th className="p-2.5 text-center pr-3">Verdict</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]/40 num-tabular">
                        {activeThesis.kpiTracking.map((kpi, idx) => (
                          <tr key={idx} className="hover:bg-[var(--bg-surface-elevated)]/30">
                            <td className="p-2.5 pl-3 font-semibold text-[var(--text-primary)]">
                              {kpi.kpi}
                            </td>
                            <td className="p-2.5 font-mono text-[var(--text-muted)]">
                              {kpi.originalAssumption}
                            </td>
                            <td className="p-2.5 font-mono font-semibold text-[var(--text-primary)]">
                              {kpi.actualObserved}
                            </td>
                            <td className="p-2.5 font-mono text-emerald-400">
                              {kpi.variance}
                            </td>
                            <td className="p-2.5 text-center pr-3">
                              <Badge
                                variant={
                                  kpi.status === "AHEAD"
                                    ? "positive"
                                    : kpi.status === "IN_LINE"
                                    ? "info"
                                    : "warning"
                                }
                                size="xs"
                              >
                                {kpi.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Invalidation Conditions / Tripwires */}
                <div className="space-y-2 text-xs pt-2 border-t border-[var(--border-subtle)]">
                  <span className="font-semibold text-rose-300 block">
                    Thesis Invalidation Conditions (Tripwires):
                  </span>
                  <ul className="space-y-1.5 text-[var(--text-secondary)]">
                    {activeThesis.tripwires.map((tw, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 rounded bg-rose-950/20 border border-rose-900/40">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{tw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sourced Alerts */}
                {activeThesis.alerts.length > 0 && (
                  <div className="space-y-2 text-xs pt-2 border-t border-[var(--border-subtle)]">
                    <span className="font-semibold text-amber-300 block">
                      Active Thesis Evidence Alerts:
                    </span>
                    {activeThesis.alerts.map((al) => (
                      <div
                        key={al.id}
                        className="p-3.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-amber-800/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-amber-300 text-xs">
                            {al.headline}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {al.date}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          <strong>Evidence:</strong> {al.evidence}
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          <strong>Source:</strong> {al.source}
                        </div>
                        <div className="text-[11px] text-amber-200 leading-relaxed">
                          <strong>Suggested Action:</strong> {al.suggestedAction}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Define Thesis Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
              Define New Investment Thesis
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Formalize your investment rationale, key KPI assumptions, and exit tripwires.
            </p>

            <form onSubmit={handleCreateThesis} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Security Ticker</label>
                <select
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  className="w-full h-9 px-3 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                >
                  {MOCK_SECURITIES.map((s) => (
                    <option key={s.ticker} value={s.ticker}>
                      {s.ticker} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1">
                  Core Investment Thesis (Why Invested?)
                </label>
                <textarea
                  value={newRationale}
                  onChange={(e) => setNewRationale(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g. Taiwan Semiconductor commands an unassailable foundry lead at 3nm/2nm with pricing power and high wafer margins..."
                  className="w-full p-2.5 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1">
                  Primary Business Assumption (Required for ongoing verification)
                </label>
                <input
                  type="text"
                  value={newAssumption}
                  onChange={(e) => setNewAssumption(e.target.value)}
                  placeholder="e.g. Blended gross margin sustains above 53.0%"
                  className="w-full h-9 px-3 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1">
                  Exit Tripwire (What would invalidate this thesis?)
                </label>
                <input
                  type="text"
                  value={newTripwire}
                  onChange={(e) => setNewTripwire(e.target.value)}
                  placeholder="e.g. CapEx execution stalls or foundry market share drops below 55%"
                  className="w-full h-9 px-3 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Monitored Thesis
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
