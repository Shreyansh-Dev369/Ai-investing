export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LIMIT';
export type OrderTimeInForce = 'DAY' | 'GTC' | 'IOC';
export type OrderStatus = 
  | 'PREVIEW' 
  | 'PENDING' 
  | 'FILLED' 
  | 'PARTIALLY_FILLED' 
  | 'REJECTED' 
  | 'CANCELLED';

export type TradingMode = 'PAPER_SANDBOX' | 'LIVE_BROKER';

export interface OrderGuardrailCheck {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  severity: 'BLOCKING' | 'WARNING' | 'INFO';
  currentValue: string;
  allowedThreshold: string;
}

export interface OrderPreviewRequest {
  ticker: string;
  companyName: string;
  side: OrderSide;
  orderType: OrderType;
  shares: number;
  limitPrice?: number;
  timeInForce: OrderTimeInForce;
  mode: TradingMode;
  brokerId: string;
  currentSpotPrice: number;
  portfolioNAV: number;
  currentCashBalance: number;
}

export interface OrderPreviewResult {
  isValid: boolean;
  idempotencyKey: string;
  ticker: string;
  side: OrderSide;
  shares: number;
  estimatedExecutionPrice: number;
  estimatedGrossValue: number;
  estimatedCommission: number;
  estimatedSlippage: number;
  estimatedTotalCost: number;
  postTradeCashBalance: number;
  postTradeWeightPercent: number;
  guardrails: OrderGuardrailCheck[];
  timestamp: string;
  stalePriceWarning: boolean;
  marketOpen: boolean;
}

export interface ExecutedOrder {
  id: string;
  idempotencyKey: string;
  ticker: string;
  companyName: string;
  side: OrderSide;
  orderType: OrderType;
  shares: number;
  filledPrice: number;
  totalCost: number;
  commission: number;
  status: OrderStatus;
  mode: TradingMode;
  brokerId: string;
  executedAt: string;
  notes?: string;
}
