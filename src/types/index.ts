export type DataProvenance = 
  | 'VERIFIED_EXTERNAL' 
  | 'CALCULATED_METRIC' 
  | 'MODEL_ESTIMATE' 
  | 'DEMO_DATA';

export interface DataPointProvenance {
  type: DataProvenance;
  source: string;
  timestamp: string;
  notes?: string;
}

export type ThesisStatus = 'HEALTHY' | 'WATCH' | 'AT_RISK';

export interface Security {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number; // in billions
  peRatio: number;
  forwardPe: number;
  evEbitda: number;
  roic: number; // percentage
  fcfYield: number; // percentage
  revenueGrowth: number; // YoY percentage
  debtToEquity: number;
  beta: number;
  thesisStatus: ThesisStatus;
  sparkline: number[];
  provenance: DataProvenance;
  lastUpdated: string;
}

export interface FinancialMetricYear {
  year: string;
  revenue: number; // in billions
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  freeCashFlow: number;
  operatingMargin: number;
  fcfMargin: number;
  sharesOutstanding: number; // in billions
  cashAndEquivalents: number;
  totalDebt: number;
}

export interface SecurityResearchDetail extends Security {
  description: string;
  exchange: string;
  currency: string;
  headquarters: string;
  ceo: string;
  foundedYear: number;
  financialHistory: FinancialMetricYear[];
  bullCase: {
    targetPrice: number;
    probability: number;
    catalysts: string[];
  };
  baseCase: {
    targetPrice: number;
    probability: number;
    catalysts: string[];
  };
  bearCase: {
    targetPrice: number;
    probability: number;
    catalysts: string[];
  };
  forensicChecks: {
    metric: string;
    score: string;
    status: 'PASS' | 'WARNING' | 'FLAG';
    detail: string;
    source: string;
  }[];
  comparables: {
    ticker: string;
    name: string;
    pe: number;
    evEbitda: number;
    revGrowth: number;
    fcfYield: number;
  }[];
  thesisTripwires: {
    metric: string;
    threshold: string;
    currentValue: string;
    status: 'NORMAL' | 'ELEVATED' | 'BREACHED';
  }[];
}

export interface DCFInputs {
  forecastYears: number;
  revenueGrowthRates: number[]; // % per year
  operatingMargin: number; // %
  taxRate: number; // %
  reinvestmentRate: number; // % of revenues
  wacc: number; // discount rate %
  terminalGrowthRate: number; // %
  currentRevenue: number; // $B
  netDebt: number; // $B
  sharesOutstanding: number; // B shares
}

export interface DCFOutputs {
  projectedRevenues: number[];
  projectedEbit: number[];
  projectedNopat: number[];
  projectedFcf: number[];
  discountFactors: number[];
  presentValueFcf: number[];
  sumPvFcf: number;
  terminalValue: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
  impliedPerShare: number;
  currentPrice: number;
  upsideDownside: number; // %
  sensitivityMatrix: {
    wacc: number;
    terminalGrowth: number;
    impliedPrice: number;
  }[][];
}

export interface PortfolioHolding {
  ticker: string;
  name: string;
  sector: string;
  assetClass: 'Equity' | 'Fixed Income' | 'Commodity' | 'Cash';
  shares: number;
  costBasis: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPl: number;
  unrealizedPlPercent: number;
  weight: number; // % of portfolio
  riskContribution: number; // % contribution to total variance
  dayChangePercent: number;
}

export interface PortfolioSummary {
  totalValue: number;
  cashBalance: number;
  cashPercentage: number;
  dayChangeDollar: number;
  dayChangePercent: number;
  totalUnrealizedPl: number;
  totalUnrealizedPlPercent: number;
  benchmarkTicker: string;
  benchmarkDayChangePercent: number;
  alpha1Y: number; // %
  beta1Y: number;
  sharpeRatio1Y: number;
  sortinoRatio1Y: number;
  maxDrawdown1Y: number; // %
  annualizedVol1Y: number; // %
  valueAtRisk95: number; // % 1-day VaR
  holdings: PortfolioHolding[];
  sectorAllocations: { sector: string; weight: number }[];
  performanceHistory: { date: string; portfolio: number; benchmark: number }[];
}

export interface ThesisItem {
  id: string;
  ticker: string;
  companyName: string;
  status: ThesisStatus;
  dateCreated: string;
  lastEvaluated: string;
  targetHorizon: string;
  originalThesis: string;
  coreAssumptions: string[];
  kpiTracking: {
    kpi: string;
    originalAssumption: string;
    actualObserved: string;
    variance: string;
    status: 'IN_LINE' | 'AHEAD' | 'DETERIORATING';
  }[];
  tripwires: string[];
  alerts: {
    id: string;
    date: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    headline: string;
    evidence: string;
    source: string;
    affectedAssumption: string;
    suggestedAction: string;
  }[];
}

export interface CommitteePerspective {
  role: 'Fundamental Analyst' | 'Quantitative Analyst' | 'Forensic Risk Analyst' | 'Bear-Case Adversary' | 'Synthesis Lead';
  title: string;
  verdict: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'CAUTION' | 'SELL';
  confidenceScore: number; // 0-100
  researchQuestion: string;
  evidenceExamined: string[];
  findings: string[];
  assumptions: string[];
  uncertainties: string[];
  counterEvidence: string[];
  sourceCitations: { title: string; docType: string; date: string }[];
}

export interface CommitteeReview {
  ticker: string;
  companyName: string;
  updatedAt: string;
  overallConsensus: string;
  consensusScore: number; // 0-100
  perspectives: CommitteePerspective[];
  corePointsOfDisagreement: string[];
  synthesisConclusion: string;
}

export interface QuantStrategyConfig {
  id: string;
  name: string;
  strategyClass: 'Dual Momentum' | 'Quality Compounder' | 'Deep Value FCF' | 'Low Volatility Min-Var';
  description: string;
  rebalanceFrequency: 'Monthly' | 'Quarterly' | 'Semi-Annually';
  lookbackPeriodMonths: number;
  benchmark: 'S&P 500 (SPY)' | 'MSCI World (URTH)' | 'Nasdaq 100 (QQQ)';
  slippageBps: number;
  cashAllocationPct: number;
  stopLossPct: number;
}

export interface QuantBacktestResult {
  config: QuantStrategyConfig;
  startDate: string;
  endDate: string;
  totalReturnPct: number;
  benchmarkReturnPct: number;
  annualizedReturnPct: number;
  annualizedVolPct: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdownPct: number;
  calmarRatio: number;
  winRatePct: number;
  profitFactor: number;
  turnoverAnnualPct: number;
  equityCurve: { date: string; strategy: number; benchmark: number; drawdown: number }[];
  tradeHistory: {
    date: string;
    ticker: string;
    action: 'BUY' | 'SELL' | 'REBALANCE';
    weight: number;
    price: number;
    pnlPct?: number;
  }[];
  limitationsDisclaimer: string;
}

export interface MacroIndicator {
  id: string;
  name: string;
  category: 'Inflation' | 'Monetary Policy' | 'Growth' | 'Labor' | 'Financial Conditions';
  currentValue: string;
  previousValue: string;
  unit: string;
  releaseDate: string;
  source: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  implication: string;
}

export interface NewsCatalyst {
  id: string;
  ticker?: string;
  headline: string;
  summary: string;
  source: string;
  publishedAt: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  sentimentScore: number; // -1.0 to 1.0 (labeled clearly as estimate)
  tags: string[];
  url?: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePct: number;
  high52: number;
  low52: number;
  history: number[];
}
