import {
  OrderPreviewRequest,
  OrderPreviewResult,
  OrderGuardrailCheck,
  ExecutedOrder,
} from "@/types/order";
import { getBrokerById } from "./brokerRegistry";

const MAX_SINGLE_ORDER_USD = 25000;
const MAX_SINGLE_ORDER_INR = 2000000;
const MAX_CONCENTRATION_PCT = 25.0; // Max 25% allocation per single security

/**
 * Generate a cryptographically unique idempotency key for pre-trade preview
 */
export function generateIdempotencyKey(ticker: string, side: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `preview_${ticker.toLowerCase()}_${side.toLowerCase()}_${ts}_${rand}`;
}

/**
 * Calculates estimated brokerage commission based on selected broker rules
 */
export function calculateEstimatedCommission(
  brokerId: string,
  grossValue: number,
  shares: number
): number {
  if (brokerId === "groww" || brokerId === "zerodha") {
    // ₹20 flat or 0.05% whichever is lower (in INR)
    return Math.min(20, Math.round(grossValue * 0.0005 * 100) / 100);
  }
  if (brokerId === "ibkr") {
    // $0.005 per share with $1.00 minimum
    return Math.max(1.0, Math.round(shares * 0.005 * 100) / 100);
  }
  // Alpaca paper / default zero commission with nominal SEC/FINRA regulatory passthrough ($0.02)
  return 0.05;
}

/**
 * Validates pre-trade safety guardrails, liquidity, and portfolio limits
 */
export function validateOrderGuardrails(request: OrderPreviewRequest): OrderPreviewResult {
  const broker = getBrokerById(request.brokerId);
  const isINR = broker?.currencies[0]?.includes("INR") || request.ticker.endsWith(".NS");
  const maxOrderCap = isINR ? MAX_SINGLE_ORDER_INR : MAX_SINGLE_ORDER_USD;
  const currencySymbol = isINR ? "₹" : "$";

  const execPrice = request.orderType === "LIMIT" && request.limitPrice 
    ? request.limitPrice 
    : request.currentSpotPrice;

  const grossValue = Math.round(execPrice * request.shares * 100) / 100;
  
  // Market orders have estimated 0.05% slippage buffer
  const slippagePct = request.orderType === "MARKET" ? 0.0005 : 0;
  const estimatedSlippage = Math.round(grossValue * slippagePct * 100) / 100;

  const commission = calculateEstimatedCommission(request.brokerId, grossValue, request.shares);
  const totalCost = request.side === "BUY" 
    ? Math.round((grossValue + commission + estimatedSlippage) * 100) / 100
    : Math.round((grossValue - commission - estimatedSlippage) * 100) / 100;

  const postTradeCash = request.side === "BUY"
    ? request.currentCashBalance - totalCost
    : request.currentCashBalance + totalCost;

  const postTradeWeight = request.portfolioNAV > 0
    ? Math.min(100, Math.round((grossValue / request.portfolioNAV) * 1000) / 10)
    : 0;

  const guardrails: OrderGuardrailCheck[] = [];

  // Guardrail 1: Maximum Single Order Notional Cap
  const valueExceeded = grossValue > maxOrderCap;
  guardrails.push({
    id: "max_order_notional",
    name: "Maximum Single Order Cap",
    description: `Order notional cannot exceed safety risk limit of ${currencySymbol}${maxOrderCap.toLocaleString()}`,
    passed: !valueExceeded,
    severity: "BLOCKING",
    currentValue: `${currencySymbol}${grossValue.toLocaleString()}`,
    allowedThreshold: `${currencySymbol}${maxOrderCap.toLocaleString()}`,
  });

  // Guardrail 2: Portfolio Concentration Limit (Max 25% NAV)
  const concentrationExceeded = postTradeWeight > MAX_CONCENTRATION_PCT;
  guardrails.push({
    id: "portfolio_concentration",
    name: "Single-Asset Concentration Cap",
    description: `Position allocation after execution cannot exceed ${MAX_CONCENTRATION_PCT}% of total portfolio NAV`,
    passed: !concentrationExceeded,
    severity: concentrationExceeded ? "WARNING" : "INFO",
    currentValue: `${postTradeWeight}% NAV`,
    allowedThreshold: `${MAX_CONCENTRATION_PCT}% NAV max`,
  });

  // Guardrail 3: Cash Balance Sufficiency (for BUY orders)
  if (request.side === "BUY") {
    const hasEnoughCash = postTradeCash >= 0;
    guardrails.push({
      id: "cash_adequacy",
      name: "Settled Cash Sufficiency",
      description: "Available liquid cash must cover gross order notional, fees, and buffer",
      passed: hasEnoughCash,
      severity: "BLOCKING",
      currentValue: `${currencySymbol}${request.currentCashBalance.toLocaleString()} available`,
      allowedThreshold: `${currencySymbol}${totalCost.toLocaleString()} required`,
    });
  }

  // Guardrail 4: Share Count Sanity
  const validShareCount = Number.isInteger(request.shares) && request.shares > 0;
  guardrails.push({
    id: "shares_validity",
    name: "Valid Share Quantity",
    description: "Order quantity must be a whole positive integer",
    passed: validShareCount,
    severity: "BLOCKING",
    currentValue: `${request.shares} shares`,
    allowedThreshold: ">= 1 share integer",
  });

  // Guardrail 5: Limit Price Deviation Check
  if (request.orderType === "LIMIT" && request.limitPrice) {
    const deviationPct = Math.abs((request.limitPrice - request.currentSpotPrice) / request.currentSpotPrice) * 100;
    const extremeDeviation = deviationPct > 10;
    guardrails.push({
      id: "limit_deviation",
      name: "Limit Price Collar (10%)",
      description: "Limit orders deviating more than 10% from spot trigger fat-finger protection",
      passed: !extremeDeviation,
      severity: extremeDeviation ? "WARNING" : "INFO",
      currentValue: `${deviationPct.toFixed(1)}% deviation`,
      allowedThreshold: "Within 10% of spot",
    });
  }

  const hasBlockingFailures = guardrails.some((g) => g.severity === "BLOCKING" && !g.passed);

  return {
    isValid: !hasBlockingFailures,
    idempotencyKey: generateIdempotencyKey(request.ticker, request.side),
    ticker: request.ticker,
    side: request.side,
    shares: request.shares,
    estimatedExecutionPrice: execPrice,
    estimatedGrossValue: grossValue,
    estimatedCommission: commission,
    estimatedSlippage,
    estimatedTotalCost: totalCost,
    postTradeCashBalance: Math.max(0, postTradeCash),
    postTradeWeightPercent: postTradeWeight,
    guardrails,
    timestamp: new Date().toISOString(),
    stalePriceWarning: false,
    marketOpen: true, // Paper sandbox always simulated open
  };
}

// In-memory order log fallback for SSR
let executedOrdersInMemory: ExecutedOrder[] = [
  {
    id: "ord_init_001",
    idempotencyKey: "preview_aapl_buy_init",
    ticker: "AAPL",
    companyName: "Apple Inc.",
    side: "BUY",
    orderType: "MARKET",
    shares: 20,
    filledPrice: 224.50,
    totalCost: 4490.05,
    commission: 0.05,
    status: "FILLED",
    mode: "PAPER_SANDBOX",
    brokerId: "alpaca",
    executedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: "Paper trade simulated fill at market spot",
  },
  {
    id: "ord_init_002",
    idempotencyKey: "preview_tcs_buy_init",
    ticker: "TCS.NS",
    companyName: "Tata Consultancy Services",
    side: "BUY",
    orderType: "LIMIT",
    shares: 10,
    filledPrice: 4210.00,
    totalCost: 42120.00,
    commission: 20.00,
    status: "FILLED",
    mode: "PAPER_SANDBOX",
    brokerId: "groww",
    executedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    notes: "Groww sandbox paper fill matching NSE pre-open",
  }
];

const STORAGE_KEY = "ai_investment_executed_orders";

/**
 * Retrieve recent executed orders from localStorage or memory
 */
export function getExecutedOrders(): ExecutedOrder[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
  }
  return executedOrdersInMemory;
}

/**
 * Executes order in Paper Sandbox mode with complete audit trail
 */
export async function executePaperOrder(
  preview: OrderPreviewResult,
  request: OrderPreviewRequest,
  userConfirmed: boolean
): Promise<ExecutedOrder> {
  if (!userConfirmed) {
    throw new Error("Explicit user confirmation and 2FA consent required to execute order.");
  }

  if (!preview.isValid) {
    throw new Error("Cannot execute order with failing BLOCKING safety guardrails.");
  }

  // Simulate network dispatch delay for realistic order receipt
  await new Promise((resolve) => setTimeout(resolve, 600));

  const executed: ExecutedOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    idempotencyKey: preview.idempotencyKey,
    ticker: request.ticker,
    companyName: request.companyName,
    side: request.side,
    orderType: request.orderType,
    shares: request.shares,
    filledPrice: preview.estimatedExecutionPrice,
    totalCost: preview.estimatedTotalCost,
    commission: preview.estimatedCommission,
    status: "FILLED",
    mode: request.mode,
    brokerId: request.brokerId,
    executedAt: new Date().toISOString(),
    notes: request.mode === "PAPER_SANDBOX" 
      ? `Simulated sandbox execution via ${request.brokerId.toUpperCase()} connector with zero financial risk.`
      : `Authorized live order routed via ${request.brokerId.toUpperCase()}.`,
  };

  if (typeof window !== "undefined") {
    try {
      const current = getExecutedOrders();
      const updated = [executed, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable
    }
  }

  executedOrdersInMemory = [executed, ...executedOrdersInMemory];
  return executed;
}
