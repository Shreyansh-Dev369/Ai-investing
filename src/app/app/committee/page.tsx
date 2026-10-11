"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MOCK_COMMITTEE_NVDA } from "@/data/mockData";
import { CommitteePerspective } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";

export default function InvestmentCommitteePage() {
  const { activeResearchTicker, setActiveResearchTicker } = useWorkspace();
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);

  const report = MOCK_COMMITTEE_NVDA;
  const currentPerspective: CommitteePerspective = report.perspectives[selectedRoleIndex];

  const tickers = ["NVDA", "MSFT", "ASML"];

  return (
    <div className="space-y-6">
      {/* Header and Ticker Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Investment Committee Review
            </h1>
            <Badge variant="provenance" size="xs">
              Demonstration Consensus Review
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Adversarial multi-perspective analytical debate preserving genuine disagreements.
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
                  ? "bg-purple-950/60 text-purple-300 border-purple-700"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Consensus Overview Card */}
      <Card className="border-purple-900/40 bg-gradient-to-r from-[var(--bg-surface)] to-purple-950/10">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
            <div>
              <div className="text-[11px] font-mono uppercase text-purple-400 font-semibold">
                Synthesized Consensus Verdict · {report.ticker} ({report.companyName})
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)] mt-1">
                {report.overallConsensus}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-center min-w-[100px]">
                <div className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Consensus Score</div>
                <div className="text-xl font-bold text-emerald-400 font-mono num-tabular">
                  {report.consensusScore}/100
                </div>
              </div>
              <DataProvenanceBadge type="MODEL_ESTIMATE" source="Committee Synthesis" />
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {report.synthesisConclusion}
          </p>

          {/* Points of Disagreement */}
          <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-amber-900/40 text-xs space-y-1.5">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Core Points of Analyst Disagreement (Preserved):</span>
            </div>
            <ul className="space-y-1 text-[var(--text-secondary)] pl-5 list-disc">
              {report.corePointsOfDisagreement.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Perspective Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {report.perspectives.map((p, idx) => {
          const isSelected = selectedRoleIndex === idx;
          const verdictColor =
            p.verdict === "STRONG_BUY" || p.verdict === "BUY"
              ? "text-emerald-400"
              : p.verdict === "CAUTION"
              ? "text-amber-400"
              : "text-slate-300";

          return (
            <button
              key={p.role}
              onClick={() => setSelectedRoleIndex(idx)}
              className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${
                isSelected
                  ? "bg-[var(--bg-surface-elevated)] border-purple-500/80 shadow-md ring-1 ring-purple-500/30"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                Role 0{idx + 1}
              </div>
              <div className="text-xs font-semibold text-[var(--text-primary)] truncate mt-0.5">
                {p.role}
              </div>
              <div className={`text-[11px] font-mono font-bold mt-1 ${verdictColor}`}>
                {p.verdict.replace("_", " ")} ({p.confidenceScore}%)
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Perspective Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Research Question, Findings, Counter-evidence */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <div className="text-[11px] font-mono text-purple-400 font-semibold">
                  Perspective Analysis
                </div>
                <CardTitle className="text-base mt-0.5">
                  {currentPerspective.role}: {currentPerspective.title}
                </CardTitle>
              </div>
              <Badge
                variant={
                  currentPerspective.verdict.includes("BUY")
                    ? "positive"
                    : currentPerspective.verdict === "CAUTION"
                    ? "warning"
                    : "default"
                }
                size="sm"
              >
                {currentPerspective.verdict.replace("_", " ")} · {currentPerspective.confidenceScore}% Confidence
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Research Question */}
              <div className="p-3 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                  Primary Research Hypothesis
                </span>
                <p className="font-medium text-[var(--text-primary)] leading-relaxed">
                  &ldquo;{currentPerspective.researchQuestion}&rdquo;
                </p>
              </div>

              {/* Evidence Examined */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-[var(--text-primary)] block">
                  Filings & Evidence Examined:
                </span>
                <ul className="space-y-1 text-[var(--text-secondary)] pl-5 list-disc">
                  {currentPerspective.evidenceExamined.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Analytical Findings */}
              <div className="space-y-2 text-xs pt-2 border-t border-[var(--border-subtle)]">
                <span className="font-semibold text-emerald-400 block">
                  Key Analytical Findings:
                </span>
                <ul className="space-y-1.5 text-[var(--text-secondary)]">
                  {currentPerspective.findings.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contradictory Evidence */}
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs space-y-1.5">
                <span className="font-semibold text-rose-300 block">
                  Contradictory / Adverse Counter-Evidence:
                </span>
                <ul className="space-y-1 text-[var(--text-secondary)] pl-5 list-disc">
                  {currentPerspective.counterEvidence.map((ce, idx) => (
                    <li key={idx}>{ce}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 span): Assumptions, Uncertainties, Citations */}
        <div className="space-y-6">
          {/* Key Assumptions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Foundational Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <ul className="space-y-2 text-[var(--text-secondary)]">
                {currentPerspective.assumptions.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-mono font-bold shrink-0">#{idx + 1}</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Uncertainties & Tail Risks */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-300">Identified Uncertainties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-[var(--text-secondary)]">
              {currentPerspective.uncertainties.map((u, idx) => (
                <div key={idx} className="p-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  {u}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Source Citations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Verified Source Citations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {currentPerspective.sourceCitations.map((sc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-0.5"
                >
                  <div className="font-semibold text-[var(--text-primary)]">{sc.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">
                    {sc.docType} · {sc.date}
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
