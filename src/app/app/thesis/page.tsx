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

    theses.push(newThesisItem);
    setSelectedThesisId(newThesisItem.id);
    setIsCreateModalOpen(false);
    setNewRationale("");
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>SURVEILLANCE REGISTER: SYSTEMIC THESIS MONITOR</span>
            <span>·</span>
            <span>EVIDENCE TRIPWIRE LOG</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              CONTINUOUS VERIFICATION
            </span>
            <DataProvenanceBadge type="CALCULATED_METRIC" source="SEC Disclosures & KPI Log" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Thesis Health Monitor
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Track whether your original investment premise remains empirically verified by quarterly filings, or whether tripwires have triggered invalidation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs font-mono gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Define Investment Thesis</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)]">
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Active Theses</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">{theses.length}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">Institutional Coverage</div>
        </div>

        <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)]">
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Healthy (Intact)
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{healthyCount}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">Assumptions Verified</div>
        </div>

        <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)]">
          <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            On Watch
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{watchCount}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">Variance Detected</div>
        </div>

        <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface)]">
          <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            At Risk (Breached)
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">{atRiskCount}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">Tripwire Triggered</div>
        </div>
      </div>

      {/* Main Grid: Thesis List on Left, Active Thesis Deep Dive on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Thesis Selection Cards (1 span) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--hairline)]">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              COVERAGE REGISTRY
            </span>
            <div className="flex items-center gap-1">
              {(["ALL", "HEALTHY", "WATCH"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2 py-0.5 text-[10px] font-mono transition-colors cursor-pointer border ${
                    filterStatus === s
                      ? "bg-[#111210] dark:bg-[#F4F1E9] text-[#F4F1E9] dark:text-[#111210] border-transparent font-semibold"
                      : "bg-transparent text-[var(--text-secondary)] border-[var(--hairline)] hover:border-[#365CFF]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTheses.map((t) => {
              const isSelected = selectedThesisId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedThesisId(t.id)}
                  className={`p-4 border transition-all cursor-pointer text-left space-y-2 ${
                    isSelected
                      ? "bg-[var(--bg-surface-elevated)] border-[#365CFF] shadow-xs"
                      : "bg-[var(--bg-surface)] border-[var(--hairline)] hover:border-[var(--text-secondary)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
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
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {t.originalThesis}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono pt-2 border-t border-[var(--hairline)]/60">
                    <span>Horizon: {t.targetHorizon}</span>
                    <span>Verified: {t.lastEvaluated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Health Dossier (2 spans) */}
        {activeThesis && (
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    SURVEILLANCE DOSSIER · {activeThesis.ticker}
                  </div>
                  <CardTitle className="font-serif text-lg font-normal mt-0.5">
                    {activeThesis.companyName}
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
                    <Button variant="outline" size="sm" className="text-xs font-mono">
                      Research Memo →
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                {/* Original Thesis Rationale */}
                <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 text-xs space-y-2">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
                    Original Investment Thesis Rationale:
                  </span>
                  <p className="font-serif text-sm text-[var(--text-primary)] leading-relaxed italic">
                    &ldquo;{activeThesis.originalThesis}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono pt-2 border-t border-[var(--hairline)]">
                    <span>Inception Date: {activeThesis.dateCreated}</span>
                    <span>Evaluation Horizon: {activeThesis.targetHorizon}</span>
                  </div>
                </div>

                {/* Core Assumptions List */}
                <div className="space-y-3 text-xs">
                  <span className="font-mono text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                    Underlying Business Assumptions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeThesis.coreAssumptions.map((assump, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 flex items-start gap-2.5"
                      >
                        <span className="text-[#365CFF] font-mono font-bold shrink-0">
                          0{idx + 1}.
                        </span>
                        <span className="text-[var(--text-secondary)] leading-relaxed">{assump}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KPI Tracking Table */}
                <div className="space-y-3 text-xs pt-3 border-t border-[var(--hairline)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      KPI Tracking vs. Filing Reality
                    </span>
                    <DataProvenanceBadge type="VERIFIED_EXTERNAL" source="SEC 10-Q Disclosures" />
                  </div>
                  <div className="overflow-x-auto border border-[var(--hairline)]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                          <th className="p-3 pl-4">Metric KPI</th>
                          <th className="p-3">Original Target</th>
                          <th className="p-3">Actual Observed</th>
                          <th className="p-3">Variance</th>
                          <th className="p-3 text-center pr-4">Verdict</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--hairline)] num-tabular">
                        {activeThesis.kpiTracking.map((kpi, idx) => (
                          <tr key={idx} className="hover:bg-[var(--bg-surface-elevated)]/30">
                            <td className="p-3 pl-4 font-semibold text-[var(--text-primary)]">
                              {kpi.kpi}
                            </td>
                            <td className="p-3 font-mono text-[var(--text-muted)]">
                              {kpi.originalAssumption}
                            </td>
                            <td className="p-3 font-mono font-semibold text-[var(--text-primary)]">
                              {kpi.actualObserved}
                            </td>
                            <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                              {kpi.variance}
                            </td>
                            <td className="p-3 text-center pr-4">
                              <Badge
                                variant={
                                  kpi.status === "AHEAD"
                                    ? "positive"
                                    : kpi.status === "IN_LINE"
                                    ? "cobalt"
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
                <div className="space-y-3 text-xs pt-3 border-t border-[var(--hairline)]">
                  <span className="font-mono text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
                    Thesis Invalidation Conditions (Tripwires):
                  </span>
                  <ul className="space-y-2 text-[var(--text-secondary)]">
                    {activeThesis.tripwires.map((tw, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-3 border border-rose-500/30 bg-rose-500/5 leading-relaxed">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span>{tw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sourced Alerts */}
                {activeThesis.alerts.length > 0 && (
                  <div className="space-y-3 text-xs pt-3 border-t border-[var(--hairline)]">
                    <span className="font-mono text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                      Active Thesis Evidence Alerts:
                    </span>
                    {activeThesis.alerts.map((al) => (
                      <div
                        key={al.id}
                        className="p-4 border border-amber-500/30 bg-amber-500/5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-amber-800 dark:text-amber-300 text-xs">
                            {al.headline}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {al.date}
                          </span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          <strong>Evidence:</strong> {al.evidence}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          <strong>Source:</strong> {al.source}
                        </div>
                        <div className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
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
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--hairline)] p-6 space-y-4">
            <h3 className="font-serif text-xl font-normal text-[var(--text-primary)]">
              Define New Investment Thesis
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Formalize your investment thesis premise, key KPI assumptions, and exit tripwires.
            </p>

            <form onSubmit={handleCreateThesis} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                  Security Ticker
                </label>
                <select
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  className="w-full h-9 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[var(--text-primary)] font-mono text-xs"
                >
                  {MOCK_SECURITIES.map((s) => (
                    <option key={s.ticker} value={s.ticker}>
                      {s.ticker} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                  Core Investment Thesis (Why Invested?)
                </label>
                <textarea
                  value={newRationale}
                  onChange={(e) => setNewRationale(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g. Taiwan Semiconductor commands an unassailable foundry lead at 3nm/2nm with pricing power and high wafer margins..."
                  className="w-full p-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[var(--text-primary)] focus:outline-none focus:border-[#365CFF]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                  Primary Business Assumption (Required for ongoing verification)
                </label>
                <input
                  type="text"
                  value={newAssumption}
                  onChange={(e) => setNewAssumption(e.target.value)}
                  placeholder="e.g. Blended gross margin sustains above 53.0%"
                  className="w-full h-9 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[var(--text-muted)] mb-1">
                  Exit Tripwire (What would invalidate this thesis?)
                </label>
                <input
                  type="text"
                  value={newTripwire}
                  onChange={(e) => setNewTripwire(e.target.value)}
                  placeholder="e.g. CapEx execution stalls or foundry market share drops below 55%"
                  className="w-full h-9 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[var(--text-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--hairline)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="font-mono text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-mono text-xs">
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
