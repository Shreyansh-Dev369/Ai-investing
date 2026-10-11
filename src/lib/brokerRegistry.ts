import { BrokerRegistryItem } from "@/types/broker";

export const BROKER_REGISTRY: BrokerRegistryItem[] = [
  {
    id: "groww",
    name: "Groww",
    shortName: "Groww",
    website: "https://groww.in",
    logoText: "GROWW",
    supportedRegions: ["India (IN)"],
    currencies: ["INR (₹)"],
    status: "SANDBOX_READY",
    lastSyncTimestamp: "Today, 15:30 IST",
    capabilities: {
      authType: "OAUTH2",
      supportsMarketData: true,
      supportsHoldingsSync: true,
      supportsOrderPreview: true,
      supportsOrderPlacement: true,
      supportsOrderCancellation: true,
      supportsPaperTrading: true,
      rateLimitDescription: "10 req/sec rate limit; token valid 24h",
      regulatoryJurisdiction: "SEBI Registered Broker INZ000301838",
      notes: "Supports NSE/BSE Cash Equities. Direct mutual fund & F&O execution requires separate KYC entitlement.",
    },
  },
  {
    id: "alpaca",
    name: "Alpaca Markets",
    shortName: "Alpaca",
    website: "https://alpaca.markets",
    logoText: "ALPACA",
    supportedRegions: ["United States (US)", "International"],
    currencies: ["USD ($)"],
    status: "CONNECTED",
    tokenExpiresAt: "2026-12-31T23:59:59Z",
    lastSyncTimestamp: "Today, 10:00 EST",
    capabilities: {
      authType: "OAUTH2",
      supportsMarketData: true,
      supportsHoldingsSync: true,
      supportsOrderPreview: true,
      supportsOrderPlacement: true,
      supportsOrderCancellation: true,
      supportsPaperTrading: true,
      rateLimitDescription: "200 req/min for free tier; streaming WebSockets",
      regulatoryJurisdiction: "SEC / FINRA / SIPC Member",
      notes: "Full paper sandbox execution with simulated matching engine and instant fills.",
    },
  },
  {
    id: "ibkr",
    name: "Interactive Brokers",
    shortName: "IBKR",
    website: "https://interactivebrokers.com",
    logoText: "IBKR",
    supportedRegions: ["Global (150+ Markets)"],
    currencies: ["USD ($)", "EUR (€)", "GBP (£)", "JPY (¥)", "INR (₹)"],
    status: "DISCONNECTED",
    capabilities: {
      authType: "SESSION_TOKEN",
      supportsMarketData: true,
      supportsHoldingsSync: true,
      supportsOrderPreview: true,
      supportsOrderPlacement: true,
      supportsOrderCancellation: true,
      supportsPaperTrading: true,
      rateLimitDescription: "Client Portal Gateway: 50 req/sec with local bridge",
      regulatoryJurisdiction: "SEC / CFTC / FCA / ASIC / SEBI",
      notes: "Requires local IB Gateway / TWS daemon or authorized Institutional Client Portal API bridge.",
    },
  },
  {
    id: "zerodha",
    name: "Zerodha (Kite Connect)",
    shortName: "Zerodha",
    website: "https://kite.trade",
    logoText: "KITE",
    supportedRegions: ["India (IN)"],
    currencies: ["INR (₹)"],
    status: "DISCONNECTED",
    capabilities: {
      authType: "API_KEY",
      supportsMarketData: true,
      supportsHoldingsSync: true,
      supportsOrderPreview: true,
      supportsOrderPlacement: true,
      supportsOrderCancellation: true,
      supportsPaperTrading: false,
      rateLimitDescription: "3 req/sec for quotes, 10 req/sec for orders; daily token renewal required",
      regulatoryJurisdiction: "SEBI Registered Broker INZ000031633",
      notes: "Requires daily morning 2FA login token generation via Kite Connect developer portal.",
    },
  },
];

export function getBrokerRegistry(): BrokerRegistryItem[] {
  return BROKER_REGISTRY;
}

export function getBrokerById(id: string): BrokerRegistryItem | undefined {
  return BROKER_REGISTRY.find((b) => b.id === id);
}

export function checkBrokerCapability(
  brokerId: string,
  capabilityKey: keyof BrokerRegistryItem["capabilities"]
): boolean {
  const broker = getBrokerById(brokerId);
  if (!broker) return false;
  return Boolean(broker.capabilities[capabilityKey]);
}
