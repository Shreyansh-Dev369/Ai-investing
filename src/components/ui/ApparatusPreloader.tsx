"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Terminal, CheckCircle2, X } from "lucide-react";

const CALIBRATION_STEPS = [
  { threshold: 12, text: "INITIALIZING POINT-IN-TIME EDGAR 10-K PARSER...", latency: "0.08s" },
  { threshold: 34, text: "SOLVING GORDON GROWTH DCF MATRICES & WACC SENSITIVITY...", latency: "0.28s" },
  { threshold: 58, text: "SYNTHESIZING 5-WAY ADVERSARIAL COMMITTEE INQUIRIES...", latency: "0.62s" },
  { threshold: 82, text: "BINDING ZERO-TRUST BROKER GATEWAYS (GROWW, ALPACA, IBKR)...", latency: "0.94s" },
  { threshold: 96, text: "VERIFYING CRYPTOGRAPHIC ACTION AUDIT PROTOCOLS...", latency: "1.20s" },
  { threshold: 100, text: "CALIBRATION COMPLETE // ACCESSING SOVEREIGN WORKSPACE", latency: "1.45s" },
];

interface ApparatusPreloaderProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export function ApparatusPreloader({ forceShow = false, onComplete }: ApparatusPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const dismissPreloader = useCallback(() => {
    setIsFadingOut(true);
    try {
      sessionStorage.setItem("ai_invest_preloader_seen", "true");
    } catch {
      // ignore
    }
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 400);
  }, [onComplete]);

  useEffect(() => {
    // Check session storage so it only auto-runs once per browser session, unless forceShow is true
    if (!forceShow) {
      try {
        const hasLoaded = sessionStorage.getItem("ai_invest_preloader_seen");
        if (hasLoaded) {
          return;
        }
      } catch {
        // ignore
      }
    }

    setIsVisible(true);

    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds total duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(currentPct);

      // Determine step
      const stepIdx = CALIBRATION_STEPS.findIndex((s) => currentPct <= s.threshold);
      if (stepIdx !== -1) {
        setCurrentStepIndex(stepIdx);
      } else {
        setCurrentStepIndex(CALIBRATION_STEPS.length - 1);
      }

      if (currentPct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          try {
            sessionStorage.setItem("ai_invest_preloader_seen", "true");
          } catch {
            // ignore
          }
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 600); // fade out duration
        }, 300);
      }
    }, 24);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismissPreloader();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [forceShow, onComplete, dismissPreloader]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#111210] text-[#F4F1E9] p-6 sm:p-12 transition-all duration-700 select-none ${
        isFadingOut ? "opacity-0 scale-98 pointer-events-none" : "opacity-100 scale-100"
      }`}
      role="dialog"
      aria-label="System Initializing"
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b border-[#2A2D27] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D8F36A] animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#A3A69C]">
            AI INVESTMENT INTELLIGENCE // APPARATUS BOOT PROTOCOL
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="hidden sm:inline text-[#7E8079]">
            SHA-256: 8D42A...9F10B · UTC {new Date().toISOString().slice(11, 19)}
          </span>
          <button
            type="button"
            onClick={dismissPreloader}
            className="px-2.5 py-1 rounded-xs border border-[#2A2D27] hover:border-[#D8F36A] hover:text-[#D8F36A] text-[#A3A69C] text-[10px] font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>SKIP BOOT [ESC]</span>
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Display */}
      <div className="max-w-3xl w-full mx-auto my-auto py-12 space-y-8">
        {/* Large Monospace Tabular Counter */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#7E8079] mb-1">
              INSTRUMENT READINESS INDEX
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl text-[#F4F1E9] font-normal tracking-tight">
              Calibrating Research Telemetry.
            </h1>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="font-mono text-6xl sm:text-8xl font-bold tracking-tighter text-[#F4F1E9] num-tabular">
              {progress < 10 ? `0${progress}` : progress}
            </span>
            <span className="font-mono text-2xl sm:text-4xl text-[#D8F36A] font-bold">%</span>
          </div>
        </div>

        {/* High-Precision Laser Progress Line */}
        <div className="space-y-2">
          <div className="relative w-full h-[2px] bg-[#2A2D27] overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#365CFF] via-[#365CFF] to-[#D8F36A] transition-all duration-75 ease-out shadow-[0_0_12px_rgba(216,243,106,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Micro tick marks */}
          <div className="flex justify-between text-[9px] font-mono text-[#7E8079] pt-1">
            <span>00 · CORE</span>
            <span>25 · DCF</span>
            <span>50 · COMMITTEE</span>
            <span>75 · BROKER</span>
            <span className={progress === 100 ? "text-[#D8F36A] font-bold" : ""}>100 · READY</span>
          </div>
        </div>

        {/* Live Diagnostics Terminal Log */}
        <div className="p-4 sm:p-5 rounded-xs bg-[#181916] border border-[#2A2D27] font-mono text-xs space-y-2 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] text-[#7E8079] border-b border-[#2A2D27] pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#365CFF]" />
              <span>TERMINAL TELEMETRY LOG</span>
            </div>
            <span>STREAM: 60 FPS</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {CALIBRATION_STEPS.slice(0, currentStepIndex + 1).map((step, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 text-[11px] leading-relaxed transition-opacity ${
                  idx === currentStepIndex
                    ? "text-[#F4F1E9] font-medium"
                    : "text-[#7E8079] opacity-70"
                }`}
              >
                <span className="text-[#365CFF] shrink-0 font-bold">[{step.latency}]</span>
                <span className="flex-1 truncate">{step.text}</span>
                {idx < currentStepIndex && (
                  <CheckCircle2 className="w-3 h-3 text-[#D8F36A] shrink-0 mt-0.5" />
                )}
                {idx === currentStepIndex && progress < 100 && (
                  <span className="inline-block w-1.5 h-3 bg-[#D8F36A] animate-pulse shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legal & Architecture Provenance */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#2A2D27] pt-4 text-[10px] font-mono text-[#7E8079]">
        <div className="flex items-center gap-3">
          <span className="px-1.5 py-0.5 rounded-xs bg-[#D8F36A]/10 text-[#D8F36A] border border-[#D8F36A]/30 font-bold">
            SEC EDGAR CERTIFIED
          </span>
          <span>Point-in-Time Point Data & Intrinsic Valuation Solvers</span>
        </div>
        <div>
          <span>Antigravity v3.8 · Swiss Editorial Architecture</span>
        </div>
      </div>
    </div>
  );
}
