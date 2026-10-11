/**
 * AI Investment Intelligence - Extension Popup Controller
 */

let currentTicker = "NVDA";

document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  await initCurrentTabDetection();
});

function setupEventListeners() {
  // Search Bar
  const searchInput = document.getElementById("tickerSearchInput");
  const searchBtn = document.getElementById("searchBtn");

  const performSearch = () => {
    const query = searchInput.value.trim().toUpperCase();
    if (!query) return;

    if (EXTENSION_SECURITIES[query]) {
      renderSecurity(query);
    } else {
      // Find partial match
      const found = Object.keys(EXTENSION_SECURITIES).find(
        (t) => t.includes(query) || EXTENSION_SECURITIES[t].name.toUpperCase().includes(query)
      );
      if (found) {
        renderSecurity(found);
      } else {
        alert(`Security "${query}" is not currently in the offline universe. Try NVDA, MSFT, ASML, LLY, TSM, GOOGL, AAPL, or TCS.NS.`);
      }
    }
  };

  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch();
  });

  // Quick Chips
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const ticker = chip.getAttribute("data-ticker");
      if (ticker) {
        renderSecurity(ticker);
      }
    });
  });

  // Watchlist Button
  const watchlistBtn = document.getElementById("watchlistBtn");
  watchlistBtn.addEventListener("click", toggleWatchlist);
}

async function initCurrentTabDetection() {
  const ribbonText = document.getElementById("detectionText");

  try {
    if (typeof chrome !== "undefined" && chrome.tabs?.query) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_SECURITY" }, (response) => {
          if (chrome.runtime.lastError || !response || !response.ticker) {
            ribbonText.textContent = "Universal Mode: Research any security directly";
            // Check storage for last viewed ticker
            chrome.storage?.local?.get(["lastTicker"], (res) => {
              renderSecurity(res?.lastTicker || "NVDA");
            });
            return;
          }

          // Found security on page
          const recognizedTicker = response.ticker;
          ribbonText.textContent = `Recognized on ${response.siteName}: ${recognizedTicker}`;

          if (EXTENSION_SECURITIES[recognizedTicker]) {
            renderSecurity(recognizedTicker, response.detectedSpotPrice);
          } else {
            // Fallback or generic rendering
            renderSecurity("NVDA");
            ribbonText.textContent = `Found ${recognizedTicker} on ${response.siteName} (Showing benchmark NVDA)`;
          }
        });
        return;
      }
    }
  } catch (err) {
    console.warn("Tab detection error:", err);
  }

  ribbonText.textContent = "Universal Mode: Research any security directly";
  renderSecurity("NVDA");
}

function renderSecurity(ticker, overrideSpotPrice = null) {
  const data = EXTENSION_SECURITIES[ticker] || EXTENSION_SECURITIES["NVDA"];
  currentTicker = data.ticker;

  // Save to lastTicker
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.set({ lastTicker: currentTicker });
  }

  // Update active chip styling
  document.querySelectorAll(".chip").forEach((c) => {
    c.classList.toggle("active", c.getAttribute("data-ticker") === currentTicker);
  });

  // Populate Meta
  document.getElementById("secTicker").textContent = data.ticker;
  document.getElementById("secExchange").textContent = data.exchange;
  document.getElementById("secName").textContent = data.name;
  document.getElementById("secSector").textContent = data.sector;

  // Thesis Badge
  const thesisBadge = document.getElementById("secThesisBadge");
  thesisBadge.textContent = data.thesisStatus;
  thesisBadge.className = `thesis-badge ${data.thesisStatus.toLowerCase().replace("_", "-")}`;

  // Price & Change
  const spotPrice = overrideSpotPrice || data.price;
  document.getElementById("secPrice").textContent = `${data.currency}${spotPrice.toFixed(2)}`;
  const changeEl = document.getElementById("secChange");
  changeEl.textContent = `${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(2)}% (1D)`;
  changeEl.className = `sec-change ${data.changePercent >= 0 ? "positive" : "negative"}`;

  // DCF Intrinsic
  document.getElementById("dcfSpotVal").textContent = `${data.currency}${spotPrice.toFixed(2)}`;
  document.getElementById("dcfImpliedVal").textContent = `${data.currency}${data.dcfImpliedPrice.toFixed(2)}`;
  
  const upsideBadge = document.getElementById("dcfUpsideBadge");
  const upside = Math.round(((data.dcfImpliedPrice - spotPrice) / spotPrice) * 1000) / 10;
  upsideBadge.textContent = `${upside >= 0 ? "+" : ""}${upside}% INTRINSIC`;
  upsideBadge.className = `upside-badge ${upside >= 0 ? "positive" : "negative"}`;

  // Thesis text
  document.getElementById("secThesisText").textContent = data.thesisSummary;

  // Multiples
  document.getElementById("multPe").textContent = `${data.peRatio}x`;
  document.getElementById("multEv").textContent = `${data.evEbitda}x`;
  document.getElementById("multRoic").textContent = `${data.roic}%`;
  document.getElementById("multFcf").textContent = `${data.fcfYield}%`;

  // Tripwires
  const tripwiresList = document.getElementById("tripwiresList");
  tripwiresList.innerHTML = "";
  data.tripwires.forEach((tw) => {
    const item = document.createElement("div");
    item.className = "tripwire-item";
    item.innerHTML = `
      <span class="name">${tw.metric} (${tw.threshold})</span>
      <span class="badge ${tw.status.toLowerCase()}">${tw.status}</span>
    `;
    tripwiresList.appendChild(item);
  });

  // Action links
  const simulateLink = document.getElementById("simulateOrderLink");
  simulateLink.href = `http://localhost:3000/app/research?ticker=${encodeURIComponent(data.ticker)}`;

  const fullMemoLink = document.getElementById("fullMemoLink");
  fullMemoLink.href = `http://localhost:3000/app/research?ticker=${encodeURIComponent(data.ticker)}`;

  updateWatchlistButtonState();
}

function updateWatchlistButtonState() {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.get(["watchlist"], (res) => {
      const list = res?.watchlist || [];
      const isSaved = list.includes(currentTicker);
      document.getElementById("watchlistIcon").textContent = isSaved ? "★" : "☆";
      document.getElementById("watchlistLabel").textContent = isSaved ? "Saved" : "Watchlist";
      const btn = document.getElementById("watchlistBtn");
      btn.style.color = isSaved ? "var(--amber)" : "var(--text-ink)";
    });
  }
}

function toggleWatchlist() {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.get(["watchlist"], (res) => {
      let list = res?.watchlist || [];
      if (list.includes(currentTicker)) {
        list = list.filter((t) => t !== currentTicker);
      } else {
        list.push(currentTicker);
      }
      chrome.storage.local.set({ watchlist: list }, () => {
        updateWatchlistButtonState();
      });
    });
  } else {
    // Fallback for standalone demo
    const label = document.getElementById("watchlistLabel");
    label.textContent = label.textContent === "Saved" ? "Watchlist" : "Saved";
  }
}
