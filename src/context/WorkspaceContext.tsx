"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PortfolioSummary, ThesisItem, PortfolioHolding } from "@/types";
import { MOCK_PORTFOLIO, MOCK_THESES } from "@/data/mockData";

export interface WorkspaceNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "warning" | "info" | "success";
  read: boolean;
  link?: string;
}

interface WorkspaceContextType {
  portfolio: PortfolioSummary;
  watchlist: string[];
  theses: ThesisItem[];
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  activeResearchTicker: string;
  setActiveResearchTicker: (ticker: string) => void;
  toggleWatchlist: (ticker: string) => void;
  isWatchlisted: (ticker: string) => void;
  addHolding: (holding: PortfolioHolding) => void;
  removeHolding: (ticker: string) => void;
  resetPortfolioToSample: () => void;
  clearPortfolioToEmpty: () => void;
  updateThesisStatus: (id: string, status: ThesisItem["status"]) => void;
  notifications: WorkspaceNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioSummary>(MOCK_PORTFOLIO);
  const [watchlist, setWatchlist] = useState<string[]>(["NVDA", "MSFT", "ASML", "LLY", "TSM"]);
  const [theses, setTheses] = useState<ThesisItem[]>(MOCK_THESES);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeResearchTicker, setActiveResearchTicker] = useState<string>("NVDA");

  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([
    {
      id: "notif-1",
      title: "ASML Bookings Tripwire Alert",
      message: "Quarterly net bookings dropped to €3.9B, triggering an amber WATCH status for thesis assumptions.",
      time: "2h ago",
      type: "warning",
      read: false,
      link: "/app/thesis",
    },
    {
      id: "notif-2",
      title: "Portfolio Daily Alpha Benchmark",
      message: "Portfolio generated +72 bps of active return vs S&P 500 today driven by NVDA and TSM strength.",
      time: "4h ago",
      type: "success",
      read: false,
      link: "/app",
    },
    {
      id: "notif-3",
      title: "Investment Committee Synthesis Updated",
      message: "New 5-way Committee review published for NVIDIA Corporation: OVERWEIGHT stance maintained.",
      time: "1d ago",
      type: "info",
      read: true,
      link: "/app/committee",
    },
  ]);

  // Load user preferences from local storage if available
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("ai_invest_theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "light") {
          document.documentElement.classList.add("light");
        }
      }
      const savedWatchlist = localStorage.getItem("ai_invest_watchlist");
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } catch {
      // Storage access gracefully handled
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("ai_invest_theme", next);
      if (next === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    } catch {
      // ignore
    }
  };

  const toggleWatchlist = (ticker: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker];
      try {
        localStorage.setItem("ai_invest_watchlist", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isWatchlisted = (ticker: string) => watchlist.includes(ticker);

  const addHolding = (newHolding: PortfolioHolding) => {
    setPortfolio((prev) => {
      const existing = prev.holdings.find((h) => h.ticker === newHolding.ticker);
      let updatedHoldings: PortfolioHolding[];
      if (existing) {
        updatedHoldings = prev.holdings.map((h) =>
          h.ticker === newHolding.ticker ? newHolding : h
        );
      } else {
        updatedHoldings = [...prev.holdings, newHolding];
      }
      const totalHoldingsVal = updatedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
      const totalVal = totalHoldingsVal + prev.cashBalance;
      const reweighted = updatedHoldings.map((h) => ({
        ...h,
        weight: Number(((h.currentValue / totalVal) * 100).toFixed(2)),
      }));

      return {
        ...prev,
        totalValue: totalVal,
        holdings: reweighted,
      };
    });
  };

  const removeHolding = (ticker: string) => {
    setPortfolio((prev) => {
      const target = prev.holdings.find((h) => h.ticker === ticker);
      const remaining = prev.holdings.filter((h) => h.ticker !== ticker);
      const addedCash = target ? target.currentValue : 0;
      const newCash = prev.cashBalance + addedCash;
      const totalVal = remaining.reduce((sum, h) => sum + h.currentValue, 0) + newCash;
      const reweighted = remaining.map((h) => ({
        ...h,
        weight: Number(((h.currentValue / totalVal) * 100).toFixed(2)),
      }));

      return {
        ...prev,
        cashBalance: newCash,
        cashPercentage: Number(((newCash / totalVal) * 100).toFixed(1)),
        holdings: reweighted,
      };
    });
  };

  const resetPortfolioToSample = () => {
    setPortfolio(MOCK_PORTFOLIO);
  };

  const clearPortfolioToEmpty = () => {
    setPortfolio({
      totalValue: 100000.0,
      cashBalance: 100000.0,
      cashPercentage: 100.0,
      dayChangeDollar: 0.0,
      dayChangePercent: 0.0,
      totalUnrealizedPl: 0.0,
      totalUnrealizedPlPercent: 0.0,
      benchmarkTicker: "S&P 500 (SPY)",
      benchmarkDayChangePercent: 0.48,
      alpha1Y: 0.0,
      beta1Y: 0.0,
      sharpeRatio1Y: 0.0,
      sortinoRatio1Y: 0.0,
      maxDrawdown1Y: 0.0,
      annualizedVol1Y: 0.0,
      valueAtRisk95: 0.0,
      holdings: [],
      sectorAllocations: [{ sector: "Cash / Unallocated Capital", weight: 100.0 }],
      performanceHistory: [
        { date: "2024-01-01", portfolio: 100, benchmark: 100 },
        { date: "2025-01-01", portfolio: 100, benchmark: 126 },
        { date: "2026-03-01", portfolio: 100, benchmark: 147 },
      ],
    });
  };

  const updateThesisStatus = (id: string, status: ThesisItem["status"]) => {
    setTheses((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, lastEvaluated: new Date().toISOString().slice(0, 10) } : t))
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <WorkspaceContext.Provider
      value={{
        portfolio,
        watchlist,
        theses,
        isDemoMode,
        setIsDemoMode,
        theme,
        toggleTheme,
        activeResearchTicker,
        setActiveResearchTicker,
        toggleWatchlist,
        isWatchlisted,
        addHolding,
        removeHolding,
        resetPortfolioToSample,
        clearPortfolioToEmpty,
        updateThesisStatus,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
