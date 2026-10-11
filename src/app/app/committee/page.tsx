"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MOCK_COMMITTEE_NVDA } from "@/data/mockData";
import { CommitteePerspective } from "@/types";
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
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>HEARING MINUTES: RECORD OF PROCEEDINGS</span>
            <span>·</span>
            <span>ADVERSARIAL COMMITTEE REVIEW</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              5 ROLES PARTICIPATING
            </span>
            <DataProvenanceBadge type="MODEL_ESTIMATE" source="Committee Synthesis" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Investment Committee Dossier
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Adversarial multi-perspective deliberation preserving genuine disagreements between fundamental, quant, and forensic analysts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-muted)] mr-1">SECURITY:</span>
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
          </div>
        </div>
      </div>

      {/* Synthesized Consensus Verdict Broadsheet */}
      <div className="border border-[var(--hairline)] bg-[var(--bg-surface)] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[var(--hairline)]">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              SYNTHESIZED CONSENSUS VERDICT · {report.ticker} ({report.companyName})
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-normal text-[var(--text-primary)] mt-1">
              {report.overallConsensus}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="p-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 text-center min-w-[120px]">
              <div className="text-[10px] text-[var(--text-muted)] uppercase font-mono tracking-wider">
                Consensus Score
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 num-tabular mt-0.5">
                {report.consensusScore} / 100
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          {report.synthesisConclusion}
        </p>

        {/* Core Points of Disagreement */}
        <div className="p-4 border border-amber-500/30 bg-amber-500/5 space-y-2 text-xs">
          <div className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Preserved Points of Disagreement Across Members:</span>
          </div>
          <ul className="space-y-1.5 text-[var(--text-secondary)] pl-5 list-disc leading-relaxed">
            {report.corePointsOfDisagreement.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Multi-Perspective Member Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {report.perspectives.map((p, idx) => {
          const isSelected = selectedRoleIndex === idx;
          const verdictColor =
            p.verdict === "STRONG_BUY" || p.verdict === "BUY"
              ? "text-emerald-600 dark:text-emerald-400"
              : p.verdict === "CAUTION"
              ? "text-amber-600 dark:text-amber-400"
              : "text-slate-600 dark:text-slate-300";

          return (
            <button
              key={p.role}
              onClick={() => setSelectedRoleIndex(idx)}
              className={`p-4 text-left transition-all border cursor-pointer ${
                isSelected
                  ? "bg-[var(--bg-surface-elevated)] border-[#365CFF] shadow-xs"
                  : "bg-[var(--bg-surface)] border-[var(--hairline)] hover:border-[var(--text-secondary)]"
              }`}
            >
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                MEMBER 0{idx + 1}
              </div>
              <div className="text-xs font-semibold text-[var(--text-primary)] truncate mt-1">
                {p.role}
              </div>
              <div className={`text-[11px] font-mono font-bold mt-1.5 ${verdictColor}`}>
                {p.verdict.replace("_", " ")} ({p.confidenceScore}%)
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Perspective Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Research Question, Findings, Counter-evidence */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  MEMBER TESTIMONY · {currentPerspective.role}
                </div>
                <CardTitle className="font-serif text-lg font-normal mt-0.5">
                  {currentPerspective.title}
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
                {currentPerspective.verdict.replace("_", " ")} · {currentPerspective.confidenceScore}% Conf
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {/* Research Question */}
              <div className="p-4 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 text-xs">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                  Primary Research Inquiry
                </span>
                <p className="font-serif text-sm text-[var(--text-primary)] leading-relaxed italic">
                  &ldquo;{currentPerspective.researchQuestion}&rdquo;
                </p>
              </div>

              {/* Evidence Examined */}
              <div className="space-y-2 text-xs">
                <span className="font-mono text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                  Filings & Evidence Examined:
                </span>
                <ul className="space-y-1 text-[var(--text-secondary)] pl-5 list-disc leading-relaxed">
                  {currentPerspective.evidenceExamined.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Analytical Findings */}
              <div className="space-y-2 text-xs pt-3 border-t border-[var(--hairline)]">
                <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Key Affirmative Findings:
                </span>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  {currentPerspective.findings.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contradictory Evidence */}
              <div className="p-4 border border-rose-500/30 bg-rose-500/5 text-xs space-y-2">
                <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
                  Contradictory / Adverse Counter-Evidence:
                </span>
                <ul className="space-y-1 text-[var(--text-secondary)] pl-5 list-disc leading-relaxed">
                  {currentPerspective.counterEvidence.map((ce, idx) => (
                    <li key={idx}>{ce}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 span): Assumptions, Uncertainties, Citations */}
        <div className="space-y-8">
          {/* Key Assumptions */}
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                CORE PREMISES
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                Foundational Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2 text-xs">
              <ul className="space-y-2.5 text-[var(--text-secondary)]">
                {currentPerspective.assumptions.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#365CFF] font-mono font-bold shrink-0">#{idx + 1}</span>
                    <span className="leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Uncertainties & Tail Risks */}
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                TAIL RISKS
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                Identified Uncertainties
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2 text-xs text-[var(--text-secondary)]">
              {currentPerspective.uncertainties.map((u, idx) => (
                <div key={idx} className="p-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 leading-relaxed">
                  {u}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Source Citations */}
          <Card>
            <CardHeader className="border-b border-[var(--hairline)] pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                AUDIT TRAIL
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                Verified Citations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2 text-xs">
              {currentPerspective.sourceCitations.map((sc, idx) => (
                <div
                  key={idx}
                  className="p-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30 space-y-1"
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
