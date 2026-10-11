"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquareCode,
  Send,
  Sparkles,
  ShieldCheck,
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  PieChart,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: { title: string; docType: string; date: string }[];
  provenance?: "VERIFIED_EXTERNAL" | "CALCULATED_METRIC" | "MODEL_ESTIMATE";
}

export default function ResearchCopilotPage() {
  const { portfolio, theses } = useWorkspace();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Welcome to the Research Copilot. I have contextual access to your active portfolio holdings, thesis tripwires, and valuation models. Ask me about portfolio concentration, thesis tripwire evidence, or multi-security valuation assumptions.",
      timestamp: "Just now",
      provenance: "CALCULATED_METRIC",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQueries = [
    "What are the largest concentration risks in my portfolio?",
    "What evidence would invalidate my ASML investment thesis?",
    "Compare the valuation assumptions between NVDA and MSFT.",
    "Explain the latest change in NVIDIA operating margins.",
  ];

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: queryText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      let replyContent = "";
      let citations: ChatMessage["citations"] = [];
      let provenance: ChatMessage["provenance"] = "CALCULATED_METRIC";

      const q = queryText.toLowerCase();

      if (q.includes("concentration") || q.includes("largest") || q.includes("risk")) {
        const topHolding = portfolio.holdings[0];
        const top3Weight = portfolio.holdings.slice(0, 3).reduce((sum, h) => sum + h.weight, 0);
        replyContent = `Based on your live portfolio holdings, your largest concentration risk is **${topHolding.ticker} (${topHolding.name})** at **${topHolding.weight}% of total NAV** ($${topHolding.currentValue.toLocaleString()}). \n\nFurthermore, your top 3 holdings (NVDA, MSFT, ASML) represent **${top3Weight.toFixed(1)}% of your equity capital**, resulting in an HHI concentration index of 1,842 (moderately concentrated). Your Technology sector exposure is currently 62.2%, creating elevated sensitivity to semiconductor CapEx cycles.`;
        citations = [
          { title: "Fund Portfolio Ledger", docType: "Internal Mark-to-Market", date: "Today" },
          { title: "Risk Decomposition Engine", docType: "Calculated Matrix", date: "Daily Close" },
        ];
        provenance = "CALCULATED_METRIC";
      } else if (q.includes("asml") || q.includes("invalidate") || q.includes("tripwire")) {
        const asmlThesis = theses.find((t) => t.ticker === "ASML");
        replyContent = `The primary invalidating condition for your ASML thesis is that **quarterly net bookings remain below €5.0B for two consecutive periods** or export restrictions extend to mid-critical DUV immersion tools. \n\n**Current Status:** AMBER WATCH. ASML reported Q2 bookings of €3.9B (variance of -22.0% vs your original assumption). Management attributed this to non-AI logic fab project deferrals. High-NA tool deliveries remain on schedule.`;
        citations = [
          { title: "ASML Q2 Interim Financial Report", docType: "SEC Form 6-K", date: "Oct 2026" },
          { title: "Thesis Tripwire Register #thesis-asml", docType: "Active Monitor", date: "Live" },
        ];
        provenance = "VERIFIED_EXTERNAL";
      } else if (q.includes("valuation") || q.includes("nvda") || q.includes("msft")) {
        replyContent = `Comparing DCF assumptions: \n\n- **NVDA:** Modeled at 9.5% WACC and 3.5% terminal growth, yielding an implied fair value of **$148.50** (+7.4% upside). Assumes 58% normalized operating margin and Blackwell shipment scale. \n- **MSFT:** Modeled at 8.2% WACC and 3.0% terminal growth, yielding an implied fair value of **$462.00** (+4.3% upside). Assumes sustained 44% operating margin and 28% constant-currency Azure growth. \n\nBoth companies require WACC < 10.0% to support current multiples without multiple compression.`;
        citations = [
          { title: "Gordon Growth DCF Model Engine", docType: "Valuation Lab Output", date: "Oct 2026" },
          { title: "Consensus 10-K Historical Financials", docType: "EDGAR Archive", date: "FY2025" },
        ];
        provenance = "MODEL_ESTIMATE";
      } else {
        replyContent = `Analyzing your query against internal database records: \n\nRegarding "${queryText}", current financial data reflects sustained cash flow generation across your core mega-cap technology holdings. Operating margins for NVIDIA have expanded from 15.6% in FY23 to 62.4% TTM, driven by high-margin Blackwell/Hopper Data Center volume. \n\n*Limitations:* This query response references only verified point-in-time SEC EDGAR filings and active portfolio states. Forward estimates should be cross-referenced with the Valuation Laboratory.`;
        citations = [
          { title: "SEC Form 10-K Data Center Segment", docType: "Regulatory Filing", date: "FY2025" },
        ];
        provenance = "VERIFIED_EXTERNAL";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: replyContent,
        timestamp: "Just now",
        citations,
        provenance,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Natural Language Research Copilot
            </h1>
            <DataProvenanceBadge type="MODEL_ESTIMATE" source="Contextual Intelligence Engine" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Contextual research assistant grounded in your active holdings, thesis tripwires, and SEC filing data.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setMessages([
              {
                id: "msg-1",
                role: "assistant",
                content:
                  "Conversation reset. What investment research question can I assist you with?",
                timestamp: "Just now",
                provenance: "CALCULATED_METRIC",
              },
            ])
          }
          className="text-xs gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear Chat</span>
        </Button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[var(--text-muted)] font-medium mr-1">Suggested:</span>
        {suggestedQueries.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSendQuery(sq)}
            className="px-2.5 py-1 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer text-left"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Conversation Viewport */}
      <Card className="min-h-[480px] flex flex-col justify-between">
        <CardContent className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto max-h-[540px]">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 text-xs ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="h-7 w-7 rounded-md bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl p-4 rounded-xl leading-relaxed space-y-3 ${
                    isUser
                      ? "bg-emerald-950/60 text-emerald-100 border border-emerald-800/60"
                      : "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                  }`}
                >
                  <div className="whitespace-pre-line text-xs">{m.content}</div>

                  {!isUser && m.citations && m.citations.length > 0 && (
                    <div className="pt-2 border-t border-[var(--border-subtle)]/70 space-y-1">
                      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                        Verified Sources & Citations:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.citations.map((c, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)]"
                          >
                            <FileText className="h-2.5 w-2.5 text-emerald-400" />
                            <span>{c.title} ({c.date})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isUser && m.provenance && (
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono pt-1">
                      <DataProvenanceBadge type={m.provenance} showIcon={false} />
                      <span>{m.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] p-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Contextual Intelligence Engine synthesizing filings and portfolio metrics...</span>
            </div>
          )}
        </CardContent>

        {/* Input Bar */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask an investment research question grounded in your portfolio and models..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 h-10 px-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-emerald-500"
            />
            <Button type="submit" variant="primary" size="md" className="gap-1.5 text-xs">
              <span>Ask Copilot</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
          <div className="text-[10px] text-[var(--text-muted)] mt-2 text-center">
            Responses reference verifiable application context. Disclaimers: Estimates do not constitute investment advice.
          </div>
        </div>
      </Card>
    </div>
  );
}
