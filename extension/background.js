/**
 * AI Investment Intelligence - Background Service Worker (Manifest V3)
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("[AI Investment Intelligence] Extension installed and active.");
});

// Update badge when a supported ticker is detected on the active tab
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "TICKER_DETECTED" && sender.tab?.id) {
    const ticker = message.data.ticker;
    if (ticker) {
      chrome.action.setBadgeText({
        tabId: sender.tab.id,
        text: ticker.slice(0, 4),
      });
      chrome.action.setBadgeBackgroundColor({
        tabId: sender.tab.id,
        color: "#365CFF", // Cobalt accent
      });
    }
  }
});

// Clear badge when tab navigates or updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    chrome.action.setBadgeText({ tabId, text: "" });
  }
});
