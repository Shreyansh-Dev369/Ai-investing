/**
 * AI Investment Intelligence - Content Script
 * Detects financial securities and price contexts on Yahoo Finance, Google Finance, TradingView, Groww, and SEC EDGAR.
 */

function detectSecurityOnCurrentPage() {
  const url = window.location.href;
  const host = window.location.hostname;
  let ticker = null;
  let exchange = null;
  let siteName = "Financial Website";

  try {
    // 1. Yahoo Finance (e.g., https://finance.yahoo.com/quote/NVDA/)
    if (host.includes("finance.yahoo.com")) {
      siteName = "Yahoo Finance";
      const match = url.match(/\/quote\/([A-Za-z0-9.\-_]+)/);
      if (match && match[1]) {
        ticker = match[1].toUpperCase();
      }
    }
    // 2. Google Finance (e.g., https://www.google.com/finance/quote/NVDA:NASDAQ)
    else if (host.includes("google.com") && url.includes("/finance")) {
      siteName = "Google Finance";
      const match = url.match(/\/quote\/([A-Za-z0-9.\-_]+)(?::([A-Za-z]+))?/);
      if (match && match[1]) {
        ticker = match[1].toUpperCase();
        if (match[2]) exchange = match[2].toUpperCase();
      }
    }
    // 3. TradingView (e.g., https://www.tradingview.com/symbols/NASDAQ-NVDA/)
    else if (host.includes("tradingview.com")) {
      siteName = "TradingView";
      const match = url.match(/\/symbols\/([A-Za-z]+)-([A-Za-z0-9]+)/);
      if (match && match[2]) {
        exchange = match[1].toUpperCase();
        ticker = match[2].toUpperCase();
      } else {
        const querySymbol = new URLSearchParams(window.location.search).get("symbol");
        if (querySymbol) {
          ticker = querySymbol.toUpperCase();
        }
      }
    }
    // 4. Groww (e.g., https://groww.in/stocks/tata-consultancy-services-ltd)
    else if (host.includes("groww.in")) {
      siteName = "Groww";
      const match = url.match(/\/stocks\/([a-z0-9-]+)/);
      if (match && match[1]) {
        const slug = match[1];
        if (slug.includes("tata-consultancy-services") || slug.includes("tcs")) ticker = "TCS.NS";
        else if (slug.includes("reliance")) ticker = "RELIANCE.NS";
        else if (slug.includes("infosys") || slug.includes("infy")) ticker = "INFY.NS";
        else if (slug.includes("hdfc")) ticker = "HDFCBANK.NS";
        else ticker = slug.toUpperCase().replace(/-/g, "").slice(0, 8);
        exchange = "NSE";
      }
    }
    // 5. SEC EDGAR (e.g., https://www.sec.gov/edgar/browse/?CIK=0001045810)
    else if (host.includes("sec.gov")) {
      siteName = "SEC EDGAR";
      const pageText = document.title || "";
      const match = pageText.match(/\b([A-Z]{2,5})\b/);
      if (match) ticker = match[1];
    }
  } catch (err) {
    console.warn("[AI Investment Companion] Error parsing ticker:", err);
  }

  // Attempt to parse spot price from header elements
  let detectedSpotPrice = null;
  try {
    const priceEl = document.querySelector('[data-field="regularMarketPrice"], [data-last-price], span[jsname="vWNDde"]');
    if (priceEl && priceEl.textContent) {
      const parsed = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ""));
      if (!isNaN(parsed) && parsed > 0) detectedSpotPrice = parsed;
    }
  } catch {
    // ignore
  }

  return {
    ticker,
    exchange,
    siteName,
    detectedSpotPrice,
    pageUrl: url,
    pageTitle: document.title,
  };
}

// Notify background worker of detected security on page load
const detected = detectSecurityOnCurrentPage();
if (detected.ticker && typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
  chrome.runtime.sendMessage({
    type: "TICKER_DETECTED",
    data: detected,
  }).catch(() => {});
}

// Handle query from popup
if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_PAGE_SECURITY") {
      const result = detectSecurityOnCurrentPage();
      sendResponse(result);
    }
    return true;
  });
}
