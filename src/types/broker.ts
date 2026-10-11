export type BrokerAuthType = 'OAUTH2' | 'API_KEY' | 'SESSION_TOKEN' | 'SANDBOX_ONLY';

export type BrokerEnvironment = 'SANDBOX' | 'PRODUCTION';

export interface BrokerCapability {
  authType: BrokerAuthType;
  supportsMarketData: boolean;
  supportsHoldingsSync: boolean;
  supportsOrderPreview: boolean;
  supportsOrderPlacement: boolean;
  supportsOrderCancellation: boolean;
  supportsPaperTrading: boolean;
  rateLimitDescription: string;
  regulatoryJurisdiction: string;
  notes: string;
}

export interface BrokerRegistryItem {
  id: string;
  name: string;
  shortName: string;
  website: string;
  logoText: string;
  supportedRegions: string[];
  currencies: string[];
  capabilities: BrokerCapability;
  status: 'CONNECTED' | 'DISCONNECTED' | 'DEGRADED' | 'SANDBOX_READY';
  tokenExpiresAt?: string;
  lastSyncTimestamp?: string;
}
