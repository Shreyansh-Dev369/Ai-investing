# AI Investment Intelligence — Investment Operating System

An institutional-grade, research-first investment intelligence platform built with **Next.js 15 (App Router, Turbopack)**, **TypeScript**, **Tailwind CSS**, and **Lucide React**.

The platform unifies security discovery, company deep-dives, mathematical DCF valuation, portfolio risk monitoring, multi-perspective committee debate, thesis health tracking, and quantitative strategy backtesting.

---

## 🏛️ System Architecture & Product Topology

```
├── Public Marketing Portal (/)
│   ├── Refined Navigation & Live Market Session Status
│   ├── Non-Hype Value Proposition & Institutional Hero
│   ├── Interactive In-Browser Live Preview (Command Center, DCF, Committee, Thesis)
│   ├── 5-Step Research Workflow (Discover → Investigate → Value → Debate → Monitor)
│   ├── Core Platform Capabilities Breakdown
│   ├── Financial Data Provenance & Methodology Standards
│   └── Institutional Regulatory Disclosures & Footer
│
└── Authenticated Investment Workspace (/app)
    ├── App Shell (Collapsible Sidebar, Breadcrumbs, Mobile Drawer, Theme Switcher)
    ├── Persistent DEMO DATA Notice & Provenance Badges
    ├── Global Command Palette (Ctrl+K / Cmd+K) & Notification Drawer
    │
    ├── 4.1  Command Center (/app)
    │        NAV, Daily P&L, Active Alpha, 3 Core Questions, Watchlist Movers
    ├── 4.2  Discovery Screener (/app/screener)
    │        Multi-metric filters, Presets, Sortable Table, Comparison Drawer
    ├── 4.3  Security Research (/app/research)
    │        5Y Financials, Bull/Base/Bear Scenarios, Forensic Accounting Audit
    ├── 4.4  Investment Committee (/app/committee)
    │        5 Analytical Perspectives preserving genuine debate & disagreement
    ├── 4.5  Valuation Laboratory (/app/valuation)
    │        Gordon Growth DCF Model, WACC sliders, 2D Sensitivity Heatmap
    ├── 4.6  Portfolio Intelligence (/app/portfolio)
    │        Risk decomposition, Correlation matrix, HHI index, Empty-state toggle
    ├── 4.7  Thesis Health Monitor (/app/thesis)
    │        Signature thesis tracker with Healthy/Watch states, Tripwires & Alerts
    ├── 4.8  Quantitative Strategy Lab (/app/quant)
    │        Point-in-time backtesting, Dual Momentum, Quality, Drawdown chart
    ├── 4.9  Market Intelligence (/app/market)
    │        Indices, Yield curve, Macro prints, Sector dispersion, Sourced news
    ├── 4.10 Research Copilot (/app/copilot)
    │        Natural language financial intelligence with explicit citations
    └── 4.11 Settings & Data Feeds (/app/settings)
             Broker sandboxes (OAuth), API keys, JSON data export, Audit log
```

---

## 📐 Mathematical Engines & Integrity Standards

1. **Gordon Growth Discounted Cash Flow (DCF)**:
   - Evaluates multi-stage high-growth cash flows discounted by WACC:
     $$DF_t = \frac{1}{(1 + WACC)^t}$$
   - Gordon Growth terminal value:
     $$TV = \frac{FCF_n \times (1 + g)}{WACC - g}$$
   - Computes Enterprise Value, Equity Value bridge, implied fair value per share, and dynamic 2D sensitivity matrix.
2. **Portfolio Risk Analytics**:
   - Annualized volatility, Sharpe Ratio ($R_f = 4.5\%$), Sortino downside semi-deviation, and Peak-to-Trough Maximum Drawdown.
   - Herfindahl-Hirschman Concentration Index (HHI) and cross-asset correlation matrix.
3. **Quantitative Factor Backtester**:
   - Point-in-time simulation compounding historical returns with modeled transaction costs and slippage (bps).
   - Generates equity curves, benchmark comparison, drawdown series, and trade execution ledger.
4. **Data Provenance System**:
   - Every metric is explicitly classified: `VERIFIED_EXTERNAL`, `CALCULATED_METRIC`, `MODEL_ESTIMATE`, or `DEMO_DATA`.
   - Never silently replaces missing live feeds with fictional hardcoded prices.

---

## 🎨 Visual Identity & Anti-AI-Slop Principles

- **Foundation**: Obsidian and Graphite base surfaces (`#08090D`, `#0E1118`, `#151924`) with subtle borders (`#1E2333`).
- **Typography**: Crisp off-white text (`#F3F4F6`), muted slate secondary text (`#94A3B8`), and tabular financial numerals (`font-variant-numeric: tabular-nums`).
- **Semantic Financial Colors**:
  - Emerald (`#10B981`): positive performance and healthy thesis status.
  - Rose (`#F43F5E`): negative movement and elevated risk.
  - Amber (`#F59E0B`): warnings, uncertainty, and thesis watches.
  - Cyan / Sky (`#06B6D4` / `#38BDF8`): analytical highlights and active selections.
- Strictly eliminates generic gradients, glowing borders, fake real-time counters, and emoji icons.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Run
```bash
# Install dependencies
npm install

# Run development server with Turbopack
npm run dev

# Run production build & verify all routes
npm run build
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) for the public marketing portal or [http://localhost:3000/app](http://localhost:3000/app) for the investment workspace.
