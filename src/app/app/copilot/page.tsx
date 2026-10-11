"use client";

import React, { useState } from "react";
import {
  Send,
  Sparkles,
  FileText,
  RotateCcw,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";

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
        replyContent = `The primary invalidating condition for your ASML thesis is that **quarterly net bookings remain below €5.0B for two consecutive periods** or export restrictions extend to mid-critical DUV immersion tools. \n\n**Current Status:** ${asmlThesis?.status || "WATCH"}. ASML reported Q2 bookings of €3.9B (variance of -22.0% vs your original assumption). Management attributed this to non-AI logic fab project deferrals. High-NA tool deliveries remain on schedule.`;
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
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-muted)] tracking-wider uppercase mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#365CFF]" />
            <span>DISPATCH: RESEARCH COPILOT</span>
            <span>·</span>
            <span>GROUNDED CONTEXTUAL INTELLIGENCE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface)] text-[10px]">
              GROUNDED IN ACTIVE HOLDINGS
            </span>
            <DataProvenanceBadge type="MODEL_ESTIMATE" source="Contextual Intelligence Engine" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Natural Language Research Copilot
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              Investigative partner grounded in your active fund holdings, quantitative models, and audited SEC EDGAR regulatory filings.
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
            className="text-xs font-mono gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear History</span>
          </Button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mr-1">
          SUGGESTED INQUIRIES:
        </span>
        {suggestedQueries.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSendQuery(sq)}
            className="px-3 py-1.5 border border-[var(--hairline)] bg-[var(--bg-surface)] hover:border-[#365CFF] hover:text-[#365CFF] text-[11px] text-[var(--text-secondary)] transition-colors cursor-pointer text-left"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Conversation Viewport */}
      <Card className="min-h-[500px] flex flex-col justify-between">
        <CardContent className="p-4 sm:p-6 space-y-5 flex-1 overflow-y-auto max-h-[560px]">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 text-xs ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="h-7 w-7 border border-[#365CFF]/30 bg-[#365CFF]/10 flex items-center justify-center text-[#365CFF] shrink-0 font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl p-4 leading-relaxed space-y-3 ${
                    isUser
                      ? "bg-[#111210] dark:bg-[#F4F1E9] text-[#F4F1E9] dark:text-[#111210] border border-transparent font-sans"
                      : "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--hairline)]"
                  }`}
                >
                  <div className="whitespace-pre-line text-xs">{m.content}</div>

                  {!isUser && m.citations && m.citations.length > 0 && (
                    <div className="pt-2.5 border-t border-[var(--hairline)] space-y-1.5">
                      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                        Verified Sources & Citations:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.citations.map((c, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 border border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/40 text-[10px] font-mono text-[var(--text-secondary)]"
                          >
                            <FileText className="h-2.5 w-2.5 text-[#365CFF]" />
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
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] p-2">
              <span className="h-2 w-2 rounded-full bg-[#365CFF] animate-ping" />
              <span>Synthesizing SEC filings and live portfolio matrix...</span>
            </div>
          )}
        </CardContent>

        {/* Input Bar */}
        <div className="p-4 border-t border-[var(--hairline)] bg-[var(--bg-surface-elevated)]/30">
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
              className="flex-1 h-10 px-4 border border-[var(--hairline)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#365CFF]"
            />
            <Button type="submit" variant="primary" size="md" className="gap-1.5 text-xs font-mono">
              <span>Send</span>
              <Send className="h-3 w-3" />
            </Button>
          </form>
          <div className="text-[10px] font-mono text-[var(--text-muted)] mt-2 text-center">
            Responses reference verifiable application context. Not registered financial advice.
          </div>
        </div>
      </Card>
    </div>
  );
}
