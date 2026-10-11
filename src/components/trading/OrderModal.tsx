"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Building2,
  Check,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { BROKER_REGISTRY } from "@/lib/brokerRegistry";
import {
  validateOrderGuardrails,
  executePaperOrder,
} from "@/lib/orderExecution";
import {
  OrderSide,
  OrderType,
  TradingMode,
  OrderPreviewRequest,
  ExecutedOrder,
} from "@/types/order";
import { DataProvenanceBadge } from "@/components/ui/DataProvenanceBadge";
import { cn } from "@/lib/utils";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker?: string;
  companyName?: string;
  spotPrice?: number;
  currency?: string;
}

export function OrderModal({
  isOpen,
  onClose,
  ticker = "NVDA",
  companyName = "NVIDIA Corporation",
  spotPrice = 128.40,
  currency = "USD",
}: OrderModalProps) {
  const { portfolio, executePortfolioOrder } = useWorkspace();

  const [side, setSide] = useState<OrderSide>("BUY");
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [shares, setShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(spotPrice);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("alpaca");
  const [tradingMode] = useState<TradingMode>("PAPER_SANDBOX");
  const [userConsent, setUserConsent] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executedOrder, setExecutedOrder] = useState<ExecutedOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync spotPrice to limitPrice on ticker/price update
  useEffect(() => {
    setLimitPrice(spotPrice);
  }, [spotPrice, ticker]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setExecutedOrder(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const selectedBroker = useMemo(() => {
    return BROKER_REGISTRY.find((b) => b.id === selectedBrokerId) || BROKER_REGISTRY[0];
  }, [selectedBrokerId]);

  const previewRequest: OrderPreviewRequest = useMemo(() => {
    return {
      ticker,
      companyName,
      side,
      orderType,
      shares: Number(shares) || 0,
      limitPrice: orderType === "LIMIT" ? limitPrice : undefined,
      timeInForce: "DAY",
      mode: tradingMode,
      brokerId: selectedBrokerId,
      currentSpotPrice: spotPrice,
      portfolioNAV: portfolio.totalValue,
      currentCashBalance: portfolio.cashBalance,
    };
  }, [
    ticker,
    companyName,
    side,
    orderType,
    shares,
    limitPrice,
    tradingMode,
    selectedBrokerId,
    spotPrice,
    portfolio.totalValue,
    portfolio.cashBalance,
  ]);

  const previewResult = useMemo(() => {
    return validateOrderGuardrails(previewRequest);
  }, [previewRequest]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!previewResult.isValid) return;
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const order = await executePaperOrder(previewResult, previewRequest, userConsent);
      executePortfolioOrder(order);
      setExecutedOrder(order);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Execution failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencySymbol = currency === "INR" || ticker.endsWith(".NS") ? "₹" : "$";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-paper dark:bg-[#151614] border border-hairline dark:border-[#2C2E2B] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-hairline dark:border-[#2C2E2B] flex items-center justify-between bg-paper-subtle dark:bg-[#1A1C18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-cobalt/10 text-cobalt flex items-center justify-center font-bold text-sm tracking-wider">
              {ticker.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="order-modal-title" className="font-serif text-lg font-bold text-ink dark:text-paper">
                  Order Ticket: {ticker}
                </h2>
                <DataProvenanceBadge type="SANDBOX_DEMO" />
              </div>
              <p className="text-xs text-muted font-sans">
                {companyName} • Spot: <span className="font-mono font-medium text-ink dark:text-paper">{currencySymbol}{spotPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-muted hover:text-ink dark:hover:text-paper transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-ink dark:text-paper text-sm">
          {executedOrder ? (
            /* Order Executed Success State */
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-scale-up">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink dark:text-paper">
                  Order Successfully Simulated
                </h3>
                <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
                  Your simulated {executedOrder.side} order for {executedOrder.shares} shares of {executedOrder.ticker} was routed and executed in Paper Sandbox mode.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="w-full bg-paper-subtle dark:bg-[#1A1C18] border border-hairline dark:border-[#2C2E2B] rounded-lg p-4 font-mono text-xs space-y-2 text-left">
                <div className="flex justify-between py-1 border-b border-hairline/60 dark:border-[#2C2E2B]/60">
                  <span className="text-muted">Execution ID:</span>
                  <span className="text-ink dark:text-paper font-semibold">{executedOrder.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline/60 dark:border-[#2C2E2B]/60">
                  <span className="text-muted">Security:</span>
                  <span className="text-ink dark:text-paper">{executedOrder.companyName} ({executedOrder.ticker})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline/60 dark:border-[#2C2E2B]/60">
                  <span className="text-muted">Action & Shares:</span>
                  <span className={executedOrder.side === "BUY" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                    {executedOrder.side} {executedOrder.shares} units
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline/60 dark:border-[#2C2E2B]/60">
                  <span className="text-muted">Filled Price:</span>
                  <span className="text-ink dark:text-paper">{currencySymbol}{executedOrder.filledPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline/60 dark:border-[#2C2E2B]/60">
                  <span className="text-muted">Total Gross Outlay:</span>
                  <span className="text-ink dark:text-paper font-semibold">{currencySymbol}{executedOrder.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline/60 dark:border-[#2C2E2B]/60">
                  <span className="text-muted">Broker Routing:</span>
                  <span className="text-cobalt font-medium">{executedOrder.brokerId.toUpperCase()} Sandbox</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">Timestamp:</span>
                  <span className="text-muted">{new Date(executedOrder.executedAt).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3 w-full">
                <button
                  onClick={() => {
                    setExecutedOrder(null);
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-medium border border-hairline dark:border-[#2C2E2B] rounded bg-paper dark:bg-[#1A1C18] text-ink dark:text-paper hover:bg-paper-subtle transition-colors"
                >
                  Place Another Ticket
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold rounded bg-cobalt text-white hover:bg-cobalt-hover transition-colors shadow-sm"
                >
                  Return to Workspace
                </button>
              </div>
            </div>
          ) : (
            /* Order Input & Preview Form */
            <>
              {/* Buy / Sell Toggle & Mode Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex rounded-md border border-hairline dark:border-[#2C2E2B] p-1 bg-paper-subtle dark:bg-[#1A1C18]">
                  <button
                    type="button"
                    onClick={() => setSide("BUY")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-semibold rounded transition-colors text-center",
                      side === "BUY"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-muted hover:text-ink dark:hover:text-paper"
                    )}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide("SELL")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-semibold rounded transition-colors text-center",
                      side === "SELL"
                        ? "bg-rose-600 text-white shadow-sm"
                        : "text-muted hover:text-ink dark:hover:text-paper"
                    )}
                  >
                    SELL
                  </button>
                </div>

                <div className="flex rounded-md border border-hairline dark:border-[#2C2E2B] p-1 bg-paper-subtle dark:bg-[#1A1C18]">
                  <button
                    type="button"
                    onClick={() => setOrderType("MARKET")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium rounded transition-colors text-center",
                      orderType === "MARKET"
                        ? "bg-ink dark:bg-paper text-paper dark:text-ink shadow-sm font-semibold"
                        : "text-muted hover:text-ink dark:hover:text-paper"
                    )}
                  >
                    MARKET
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("LIMIT")}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium rounded transition-colors text-center",
                      orderType === "LIMIT"
                        ? "bg-ink dark:bg-paper text-paper dark:text-ink shadow-sm font-semibold"
                        : "text-muted hover:text-ink dark:hover:text-paper"
                    )}
                  >
                    LIMIT
                  </button>
                </div>
              </div>

              {/* Quantity & Pricing Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                    Quantity (Shares)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={shares}
                      onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-paper dark:bg-[#151614] border border-hairline dark:border-[#2C2E2B] rounded-md px-3 py-2 text-sm font-mono text-ink dark:text-paper focus:outline-none focus:border-cobalt"
                    />
                  </div>
                  {/* Quick share buttons */}
                  <div className="flex gap-1.5 mt-2">
                    {[5, 10, 25, 50, 100].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setShares(qty)}
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-mono rounded border transition-colors",
                          shares === qty
                            ? "border-cobalt text-cobalt bg-cobalt/5"
                            : "border-hairline dark:border-[#2C2E2B] text-muted hover:text-ink dark:hover:text-paper"
                        )}
                      >
                        +{qty}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                    {orderType === "LIMIT" ? "Limit Price" : "Execution Price (Estimated)"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-muted font-mono">{currencySymbol}</span>
                    <input
                      type="number"
                      step="0.01"
                      disabled={orderType === "MARKET"}
                      value={orderType === "LIMIT" ? limitPrice : spotPrice}
                      onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                      className={cn(
                        "w-full bg-paper dark:bg-[#151614] border border-hairline dark:border-[#2C2E2B] rounded-md pl-7 pr-3 py-2 text-sm font-mono text-ink dark:text-paper focus:outline-none focus:border-cobalt",
                        orderType === "MARKET" && "opacity-80 cursor-not-allowed bg-paper-subtle dark:bg-[#1A1C18]"
                      )}
                    />
                  </div>
                  <p className="text-[10px] text-muted mt-2">
                    {orderType === "MARKET"
                      ? "Filled at spot with 0.05% slippage buffer"
                      : "Execution triggers at or better than specified limit"}
                  </p>
                </div>
              </div>

              {/* Broker & Execution Environment Selection */}
              <div className="p-3.5 bg-paper-subtle dark:bg-[#1A1C18] border border-hairline dark:border-[#2C2E2B] rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink dark:text-paper flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cobalt" /> Broker Connection
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    SANDBOX ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {BROKER_REGISTRY.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBrokerId(b.id)}
                      className={cn(
                        "p-2.5 rounded border text-left transition-all text-xs flex flex-col justify-between",
                        selectedBrokerId === b.id
                          ? "border-cobalt bg-cobalt/5 dark:bg-cobalt/10 shadow-sm"
                          : "border-hairline dark:border-[#2C2E2B] hover:border-stone-400 dark:hover:border-stone-600 bg-paper dark:bg-[#151614]"
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-semibold text-ink dark:text-paper">{b.name}</span>
                        {selectedBrokerId === b.id && <Check className="w-3.5 h-3.5 text-cobalt" />}
                      </div>
                      <span className="text-[10px] text-muted">
                        {b.supportedRegions[0]} • {b.currencies[0]}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-muted leading-relaxed">
                  {selectedBroker.capabilities.notes}
                </p>
              </div>

              {/* Order Cost Preview Table */}
              <div className="border border-hairline dark:border-[#2C2E2B] rounded-md overflow-hidden bg-paper dark:bg-[#151614]">
                <div className="px-3 py-2 bg-paper-subtle dark:bg-[#1A1C18] border-b border-hairline dark:border-[#2C2E2B] text-xs font-medium text-muted flex justify-between items-center">
                  <span>Pre-Trade Order Preview</span>
                  <span className="font-mono text-[10px] text-muted">Key: {previewResult.idempotencyKey.slice(0, 16)}...</span>
                </div>
                <div className="p-3 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted">Gross Order Value ({shares} sh @ {currencySymbol}{previewResult.estimatedExecutionPrice.toFixed(2)})</span>
                    <span className="font-mono text-ink dark:text-paper">{currencySymbol}{previewResult.estimatedGrossValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Estimated Brokerage Fee ({selectedBroker.shortName})</span>
                    <span className="font-mono text-ink dark:text-paper">{currencySymbol}{previewResult.estimatedCommission.toFixed(2)}</span>
                  </div>
                  {orderType === "MARKET" && (
                    <div className="flex justify-between">
                      <span className="text-muted">Simulated Slippage Buffer (0.05%)</span>
                      <span className="font-mono text-muted">{currencySymbol}{previewResult.estimatedSlippage.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-hairline dark:border-[#2C2E2B] flex justify-between font-semibold">
                    <span className="text-ink dark:text-paper">Estimated Total Outlay:</span>
                    <span className="font-mono text-cobalt text-sm">{currencySymbol}{previewResult.estimatedTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted pt-1">
                    <span>Remaining Settled Cash:</span>
                    <span className="font-mono">{currencySymbol}{previewResult.postTradeCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Safety Guardrails Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-ink dark:text-paper uppercase tracking-wider block">
                  Institutional Guardrail Checks
                </span>
                <div className="space-y-1.5">
                  {previewResult.guardrails.map((check) => (
                    <div
                      key={check.id}
                      className={cn(
                        "p-2.5 rounded border text-xs flex items-center justify-between",
                        check.passed
                          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300"
                          : check.severity === "BLOCKING"
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {check.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : check.severity === "BLOCKING" ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{check.name}</p>
                          <p className="text-[10px] opacity-80">{check.description}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] font-semibold flex-shrink-0 ml-2">
                        {check.currentValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="tradeConsent"
                  checked={userConsent}
                  onChange={(e) => setUserConsent(e.target.checked)}
                  className="mt-1 rounded border-hairline dark:border-[#2C2E2B] text-cobalt focus:ring-cobalt"
                />
                <label htmlFor="tradeConsent" className="text-xs text-muted leading-snug cursor-pointer">
                  I understand this order executes in <strong className="text-ink dark:text-paper">Paper Sandbox</strong> mode without financial risk. Simulated trade telemetry updates active portfolio balances and audit journals.
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
                  {errorMsg}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!executedOrder && (
          <div className="p-4 sm:p-5 border-t border-hairline dark:border-[#2C2E2B] bg-paper-subtle dark:bg-[#1A1C18] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted hover:text-ink dark:hover:text-paper transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!previewResult.isValid || !userConsent || isSubmitting}
              onClick={handleExecute}
              className={cn(
                "px-5 py-2.5 rounded text-xs font-semibold text-white shadow transition-all flex items-center gap-2",
                !previewResult.isValid || !userConsent || isSubmitting
                  ? "bg-stone-400 dark:bg-stone-700 cursor-not-allowed opacity-60"
                  : side === "BUY"
                  ? "bg-cobalt hover:bg-cobalt-hover shadow-cobalt/20"
                  : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
              )}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Routing Order...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {side} {shares} {ticker} (Simulate Sandbox)
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
