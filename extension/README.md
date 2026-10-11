# AI Investment Intelligence — Companion Browser Extension

Institutional equity intelligence, intrinsic DCF valuation models, and real-time thesis tripwires directly embedded while browsing financial web applications.

---

## 1. Overview & Capabilities

The **AI Investment Intelligence Companion** is a Chrome Manifest V3 browser extension built with the platform's Swiss editorial design language. It bridges public market information with proprietary quantitative intelligence:

- **Current-Page Financial Recognition**:
  - Automatically identifies securities, exchanges, and spot quotes on **Yahoo Finance**, **Google Finance**, **TradingView**, **Groww**, and **SEC EDGAR**.
- **Intrinsic Valuation & DCF Upside**:
  - Instant Gordon Growth / Multi-Stage DCF intrinsic value comparisons against live market quotes.
- **Thesis Health & Tripwires**:
  - Live health status (`HEALTHY`, `WATCH`, `AT_RISK`) and operational warning tripwires.
- **Key Fundamental Multiples**:
  - P/E, EV/EBITDA, Return on Invested Capital (ROIC), and Free Cash Flow Yield.
- **Universal Query Mode**:
  - When browsing any other website, quick chips and search input allow immediate on-the-fly analysis of any covered security.
- **Ecosystem Integration**:
  - One-click deep-link to the main Next.js web application (`http://localhost:3000/app/research?ticker=...`) to inspect audited 10-K filings, committee consensus debriefs, and simulated paper order tickets.

---

## 2. Zero-Trust Security Guarantees

- **No Remote Scripts**: Fully compliant with Chrome Web Store MV3 `script-src 'self'`.
- **Zero Password Handling**: The extension never intercepts, logs, transmits, or asks for brokerage passwords or sensitive banking credentials.
- **Read-Only Context**: Analyzes page URLs and public ticker elements without scraping personal user portfolios or private broker tabs.

---

## 3. How to Install and Run (Unpacked Extension)

1. Open any Chromium-based browser (Google Chrome, Brave, Microsoft Edge, Arc).
2. In the URL address bar, navigate to:
   - Chrome / Brave: `chrome://extensions`
   - Edge: `edge://extensions`
3. Enable **Developer mode** toggle in the top-right corner.
4. Click **Load unpacked** in the top-left toolbar.
5. In the folder picker dialog, select the `extension` folder inside this repository:
   ```
   c:\Users\LENOVO\Desktop\ai investment\extension
   ```
6. The extension icon will appear in your browser toolbar!
7. Pin the extension for quick access.
8. Navigate to any supported financial page (e.g., `https://finance.yahoo.com/quote/NVDA/` or `https://groww.in/stocks/tata-consultancy-services-ltd`), click the extension icon, and see the automated intelligence dossier!
