"use client";

import React, { useState } from "react";
import {
  Lock,
  Download,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function SettingsAndFeedsPage() {
  const { isDemoMode, setIsDemoMode, portfolio, theses } = useWorkspace();

  const [activeTab, setActiveTab] = useState<"providers" | "brokers" | "alerts" | "audit">("providers");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ portfolio, theses }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ai_investment_portfolio_audit.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const auditLogs = [
    {
      action: "DCF Model Re-calibration",
      target: "NVDA (NVIDIA Corporation)",
      detail: "WACC adjusted to 9.5%, terminal growth to 3.5%",
      time: "10 mins ago",
      user: "Principal Analyst",
    },
    {
      action: "Thesis Tripwire Check",
      target: "ASML (ASML Holding N.V.)",
      detail: "Evaluated net bookings against €5.0B threshold; updated to amber WATCH",
      time: "2 hours ago",
      user: "System Engine",
    },
    {
      action: "Portfolio Position Rebalance",
      target: "TSM (Taiwan Semiconductor)",
      detail: "Mark-to-market position weight updated to 11.68%",
      time: "5 hours ago",
      user: "Broker Sync",
    },
    {
      action: "Committee Consensus Memo",
      target: "NVDA Investment Committee",
      detail: "Consensus score 82/100 published with 5 analyst perspectives",
      time: "1 day ago",
      user: "Synthesis Lead",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>DISPATCH: SYSTEM CONTROLS</span>
            <span>·</span>
            <span>INTEGRATION PROTOCOLS & AUDIT TRAIL</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              DATA ENVIRONMENT: {isDemoMode ? "DEMO SANDBOX" : "LIVE FEEDS"}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Settings & Provenance Registry
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Configure external regulatory data providers, broker OAuth sandboxes, tripwire alert parameters, and cryptographic action audits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`px-3 py-1.5 text-xs font-mono border cursor-pointer transition-colors ${
                isDemoMode
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
              }`}
            >
              {isDemoMode ? "MODE: DEMO (ACTIVE)" : "MODE: LIVE (ACTIVE)"}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="text-xs font-mono gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Swiss Numbered Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--hairline)] overflow-x-auto text-xs font-mono">
        {[
          { id: "providers", label: "01. DATA PROVIDERS & APIS" },
          { id: "brokers", label: "02. BROKER OAUTH (SANDBOX)" },
          { id: "alerts", label: "03. TRIPWIRE THRESHOLDS" },
          { id: "audit", label: "04. AUDIT & ACTION TRAIL" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as "providers" | "brokers" | "alerts" | "audit")}
            className={`px-4 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === t.id
                ? "border-[#365CFF] text-[#365CFF] font-semibold bg-[var(--bg-surface)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Data Providers */}
      {activeTab === "providers" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SEC EDGAR */}
            <div className="p-5 border border-[var(--hairline)] bg-[var(--bg-surface)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-xs text-[var(--text-primary)]">
                  SEC EDGAR Point-in-Time Filings
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Direct automated access to public corporate Forms 10-K, 10-Q, 8-K, and institutional 13-F filings with XBRL financial statements.
              </p>
              <div className="text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--hairline)]">
                Latency: Real-time public filing feed · Rate Limit: 10 req/sec
              </div>
            </div>

            {/* Federal Reserve FRED */}
            <div className="p-5 border border-[var(--hairline)] bg-[var(--bg-surface)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-xs text-[var(--text-primary)]">
                  Federal Reserve Economic Data (FRED)
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Sovereign Treasury yields, effective fed funds rate, inflation CPI indices, and labor statistics.
              </p>
              <div className="text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--hairline)]">
                Source: Federal Reserve Bank of St. Louis
              </div>
            </div>

            {/* FactSet / Refinitiv */}
            <div className="p-5 border border-[var(--hairline)] bg-[var(--bg-surface)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-xs text-[var(--text-primary)]">
                  FactSet / Refinitiv Financial Wire
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  SANDBOX SIMULATION
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Enterprise market data feed for real-time tick streaming and global multi-asset pricing.
              </p>
              <div className="pt-2">
                <form onSubmit={handleSaveApiKey} className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter Enterprise API Key..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="flex-1 h-8 px-3 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#365CFF]"
                  />
                  <Button type="submit" variant="outline" size="sm" className="text-xs font-mono">
                    {isSaved ? "Saved" : "Connect"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Bloomberg OpenFIGI */}
            <div className="p-5 border border-[var(--hairline)] bg-[var(--bg-surface)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-xs text-[var(--text-primary)]">
                  Bloomberg OpenFIGI Instrument Mapping
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Global Financial Instrument Identifier system for cross-asset ticker and CUSIP/ISIN resolution.
              </p>
              <div className="text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--hairline)]">
                Permission: Read-Only Open Source Standard
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Broker Connections */}
      {activeTab === "brokers" && (
        <div className="space-y-6">
          {/* Security Guarantee Box */}
          <div className="p-5 border border-emerald-500/30 bg-emerald-500/5 text-xs space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <Lock className="h-4 w-4" />
              <span>Architectural Security Guarantee & Credential Isolation</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Broker integrations require opt-in OAuth 2.0 authorization with biometric token exchange. Client-side code never stores or transmits raw trading passwords or broker secret keys. Position synchronization is segregated as strictly <strong>Read-Only</strong> unless separate physical hardware execution authorization is provided.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Interactive Brokers */}
            <div className="p-5 border border-[var(--hairline)] bg-[var(--bg-surface)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Interactive Brokers (IBKR)</span>
                <Badge variant="outline" size="xs">DISCONNECTED</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Client Portal API Gateway with institutional multi-currency custody.
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                Authorize IBKR OAuth →
              </Button>
            </div>

            {/* Alpaca */}
            <div className="p-5 border border-emerald-500/30 bg-[var(--bg-surface)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Alpaca Markets</span>
                <Badge variant="positive" size="xs">PAPER SANDBOX</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Paper trading execution environment for quantitative algorithmic testing.
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                Manage Sandbox →
              </Button>
            </div>

            {/* Charles Schwab */}
            <div className="p-5 border border-[var(--hairline)] bg-[var(--bg-surface)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Charles Schwab API</span>
                <Badge variant="outline" size="xs">DISCONNECTED</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Trader API with OAuth consent grant for retail custodial accounts.
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                Authorize Schwab OAuth →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Alert Rules */}
      {activeTab === "alerts" && (
        <Card>
          <CardHeader className="border-b border-[var(--hairline)] pb-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              RULE ENGINE
            </div>
            <CardTitle className="font-serif text-lg font-normal mt-0.5">
              Automated Thesis Tripwire Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Booking Variance Alert</span>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Trigger amber WATCH when quarterly backlog or bookings drop below assumption
                </p>
              </div>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">&gt; 15% Variance</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Operating Margin Degradation</span>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Trigger warning when gross or operating margin slips for two consecutive quarters
                </p>
              </div>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">&gt; 250 bps Drop</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Customer Concentration Spike</span>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Flag elevated dependency when top 4 customers exceed critical revenue threshold
                </p>
              </div>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">&gt; 40% Share</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Security & Audit Trail */}
      {activeTab === "audit" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--hairline)] pb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                IMMUTABLE AUDIT LOG
              </div>
              <CardTitle className="font-serif text-lg font-normal mt-0.5">
                Cryptographic Action Trail
              </CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Immutable ledger of analyst parameter calibrations and model edits
              </p>
            </div>
            <Badge variant="provenance">Audit Engine v1.8</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--hairline)] text-xs">
              {auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[var(--bg-surface-elevated)]/30 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <span>{log.action}</span>
                      <span className="text-[11px] font-mono text-[#365CFF]">· {log.target}</span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {log.detail}
                    </div>
                  </div>
                  <div className="text-left sm:text-right font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                    <div>{log.time}</div>
                    <div className="text-[var(--text-secondary)]">{log.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
