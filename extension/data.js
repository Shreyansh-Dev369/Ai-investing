/**
 * AI Investment Intelligence - Extension Offline Knowledge Base
 */

const EXTENSION_SECURITIES = {
  "NVDA": {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    sector: "Semiconductors & AI Hardware",
    currency: "$",
    price: 128.40,
    changePercent: 3.12,
    thesisStatus: "HEALTHY",
    thesisSummary: "CUDA platform lock-in with Blackwell architecture driving sustained 75%+ gross margins across cloud hyperscalers.",
    dcfImpliedPrice: 144.20,
    dcfUpsidePercent: 12.3,
    peRatio: 48.2,
    evEbitda: 36.4,
    roic: 68.4,
    fcfYield: 2.8,
    provenance: "DELAYED_15M",
    tripwires: [
      { metric: "Hyperscaler CapEx Concentration", status: "NORMAL", threshold: "Top 4 < 45%" },
      { metric: "Data Center Gross Margin", status: "NORMAL", threshold: "> 72.0%" }
    ]
  },
  "MSFT": {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    sector: "Enterprise Software & Cloud",
    currency: "$",
    price: 442.10,
    changePercent: 1.45,
    thesisStatus: "HEALTHY",
    thesisSummary: "Azure AI enterprise monetization and Copilot seat expansion driving high-margin cloud recurring revenue.",
    dcfImpliedPrice: 485.00,
    dcfUpsidePercent: 9.7,
    peRatio: 36.1,
    evEbitda: 24.8,
    roic: 31.2,
    fcfYield: 2.9,
    provenance: "DELAYED_15M",
    tripwires: [
      { metric: "Azure Commercial Growth YoY", status: "NORMAL", threshold: "> 28.0%" },
      { metric: "Enterprise M365 ARPU", status: "NORMAL", threshold: "> $38/seat" }
    ]
  },
  "ASML": {
    ticker: "ASML",
    name: "ASML Holding N.V.",
    exchange: "NASDAQ",
    sector: "Semiconductor Capital Equipment",
    currency: "$",
    price: 760.30,
    changePercent: -1.82,
    thesisStatus: "WATCH",
    thesisSummary: "Monopoly in High-NA EUV lithography, tempered by cyclical foundry CapEx digestion and China export controls.",
    dcfImpliedPrice: 840.00,
    dcfUpsidePercent: 10.5,
    peRatio: 39.4,
    evEbitda: 28.1,
    roic: 42.6,
    fcfYield: 2.4,
    provenance: "DELAYED_15M",
    tripwires: [
      { metric: "Quarterly Net Bookings", status: "ELEVATED", threshold: "€5.0B target (€3.9B actual)" },
      { metric: "China Revenue Exposure", status: "ELEVATED", threshold: "< 25% of total" }
    ]
  },
  "LLY": {
    ticker: "LLY",
    name: "Eli Lilly and Company",
    exchange: "NYSE",
    sector: "Pharmaceuticals & Biotechnology",
    currency: "$",
    price: 884.20,
    changePercent: 2.10,
    thesisStatus: "HEALTHY",
    thesisSummary: "Tirzepatide (Mounjaro/Zepbound) GLP-1/GIP franchise commanding global supply leadership with oral pipeline.",
    dcfImpliedPrice: 960.00,
    dcfUpsidePercent: 8.6,
    peRatio: 52.8,
    evEbitda: 38.2,
    roic: 28.5,
    fcfYield: 1.9,
    provenance: "DELAYED_15M",
    tripwires: [
      { metric: "GLP-1 Manufacturing Run-Rate", status: "NORMAL", threshold: "Weekly capacity > 1.2M doses" }
    ]
  },
  "TSM": {
    ticker: "TSM",
    name: "Taiwan Semiconductor Manufacturing",
    exchange: "NYSE",
    sector: "Semiconductor Foundry",
    currency: "$",
    price: 188.50,
    changePercent: 2.65,
    thesisStatus: "HEALTHY",
    thesisSummary: "Irreplaceable 3nm and 2nm GAA foundry dominance powering leading AI accelerators and smartphone processors.",
    dcfImpliedPrice: 220.00,
    dcfUpsidePercent: 16.7,
    peRatio: 26.4,
    evEbitda: 14.8,
    roic: 29.4,
    fcfYield: 3.8,
    provenance: "DELAYED_15M",
    tripwires: [
      { metric: "CoWoS Advanced Packaging Capacity", status: "NORMAL", threshold: "> 40k wpm" }
    ]
  },
  "GOOGL": {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    sector: "Internet & Digital Advertising",
    currency: "$",
    price: 164.20,
    changePercent: 0.85,
    thesisStatus: "HEALTHY",
    thesisSummary: "Search moat fortified by Gemini integration alongside accelerated Google Cloud profit margins.",
    dcfImpliedPrice: 195.00,
    dcfUpsidePercent: 18.8,
    peRatio: 23.5,
    evEbitda: 15.2,
    roic: 32.1,
    fcfYield: 4.2,
    provenance: "DELAYED_15M",
    tripwires: [
      { metric: "Search Query Share", status: "NORMAL", threshold: "> 88% global" }
    ]
  },
  "AAPL": {
    ticker: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    sector: "Consumer Electronics & Services",
    currency: "$",
    price: 224.50,
    changePercent: 1.15,
    thesisStatus: "HEALTHY",
    thesisSummary: "Apple Intelligence upgrade supercycle combined with high-margin recurring Services gross margin (>74%).",
    dcfImpliedPrice: 242.00,
    dcfUpsidePercent: 7.8,
    peRatio: 33.2,
    evEbitda: 23.6,
    roic: 56.4,
    fcfYield: 3.5,
    provenance: "DELAYED_15M",
    tripwires: [
      { metric: "Services Margin Resilience", status: "NORMAL", threshold: "> 70% gross" }
    ]
  },
  "TCS.NS": {
    ticker: "TCS.NS",
    name: "Tata Consultancy Services Ltd",
    exchange: "NSE",
    sector: "IT Services & Enterprise Consulting",
    currency: "₹",
    price: 4210.00,
    changePercent: 1.25,
    thesisStatus: "HEALTHY",
    thesisSummary: "Dominant Tier-1 IT services provider benefiting from enterprise multi-year cloud and AI modernization deals.",
    dcfImpliedPrice: 4680.00,
    dcfUpsidePercent: 11.2,
    peRatio: 29.8,
    evEbitda: 20.4,
    roic: 51.2,
    fcfYield: 3.9,
    provenance: "DELAYED_15M",
    tripwires: [
      { metric: "Attrition Rate (LTM)", status: "NORMAL", threshold: "< 14.0%" },
      { metric: "BFSI Vertical YoY Growth", status: "NORMAL", threshold: "> 6.0%" }
    ]
  }
};
