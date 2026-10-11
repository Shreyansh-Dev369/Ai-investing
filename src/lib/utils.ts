import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  val: number,
  currency = "$",
  decimals = 2,
  compact = false
): string {
  if (val === undefined || val === null || isNaN(val)) return "—";
  
  if (compact) {
    const abs = Math.abs(val);
    const sign = val < 0 ? "-" : "";
    if (abs >= 1e12) return `${sign}${currency}${(abs / 1e12).toFixed(decimals)}T`;
    if (abs >= 1e9) return `${sign}${currency}${(abs / 1e9).toFixed(decimals)}B`;
    if (abs >= 1e6) return `${sign}${currency}${(abs / 1e6).toFixed(decimals)}M`;
    if (abs >= 1e3) return `${sign}${currency}${(abs / 1e3).toFixed(decimals)}k`;
    return `${sign}${currency}${abs.toFixed(decimals)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatPercent(
  val: number,
  includeSign = false,
  decimals = 2
): string {
  if (val === undefined || val === null || isNaN(val)) return "—";
  const sign = includeSign && val > 0 ? "+" : "";
  return `${sign}${val.toFixed(decimals)}%`;
}

export function formatNumber(
  val: number,
  decimals = 2,
  compact = false
): string {
  if (val === undefined || val === null || isNaN(val)) return "—";
  if (compact) {
    const abs = Math.abs(val);
    const sign = val < 0 ? "-" : "";
    if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(decimals)}B`;
    if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(decimals)}M`;
    if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(decimals)}k`;
    return `${sign}${abs.toFixed(decimals)}`;
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatCompact(val: number, decimals = 1): string {
  return formatNumber(val, decimals, true);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}
