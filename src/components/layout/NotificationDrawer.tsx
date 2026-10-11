"use client";

import React from "react";
import Link from "next/link";
import { X, CheckCheck, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useWorkspace();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md h-full bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Notifications & Tripwires
            </h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.map((n) => {
            const Icon =
              n.type === "warning"
                ? AlertTriangle
                : n.type === "success"
                ? TrendingUp
                : Info;

            const iconColors =
              n.type === "warning"
                ? "text-amber-400 bg-amber-950/50 border-amber-800/60"
                : n.type === "success"
                ? "text-emerald-400 bg-emerald-950/50 border-emerald-800/60"
                : "text-sky-400 bg-sky-950/50 border-sky-800/60";

            return (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={cn(
                  "p-3 rounded-lg border transition-all text-left relative",
                  n.read
                    ? "bg-[var(--bg-surface)] border-[var(--border-subtle)] opacity-80"
                    : "bg-[var(--bg-surface-elevated)] border-[var(--border-strong)] shadow-xs"
                )}
              >
                {!n.read && (
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-emerald-400" />
                )}
                <div className="flex items-start gap-2.5">
                  <div className={cn("p-1.5 rounded border shrink-0 mt-0.5", iconColors)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 pr-3">
                    <div className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">
                      {n.title}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-2">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                      <span>{n.time}</span>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={onClose}
                          className="text-emerald-400 hover:underline font-sans"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              No active notifications or tripwire alerts.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border-subtle)] text-center text-[11px] text-[var(--text-muted)] font-mono">
          Thesis alerts are evaluated based on real-time filing and catalyst disclosures.
        </div>
      </div>
    </div>
  );
}
