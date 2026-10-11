export interface ReturnSeriesPoint {
  date: string;
  value: number;
}

export function calculateReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function calculateStandardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = calculateMean(values);
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function calculateDownsideDeviation(values: number[], targetReturn = 0): number {
  if (values.length < 2) return 0;
  const underperformances = values.map(v => Math.min(0, v - targetReturn));
  const sumSq = underperformances.reduce((sum, v) => sum + Math.pow(v, 2), 0);
  return Math.sqrt(sumSq / (values.length - 1));
}

export function calculateSharpeRatio(
  dailyReturns: number[],
  annualRiskFreeRate = 0.045
): number {
  if (dailyReturns.length < 10) return 0;
  const dailyRf = annualRiskFreeRate / 252;
  const excessReturns = dailyReturns.map(r => r - dailyRf);
  const meanExcess = calculateMean(excessReturns);
  const std = calculateStandardDeviation(dailyReturns);
  if (std === 0) return 0;
  return (meanExcess / std) * Math.sqrt(252);
}

export function calculateSortinoRatio(
  dailyReturns: number[],
  annualRiskFreeRate = 0.045
): number {
  if (dailyReturns.length < 10) return 0;
  const dailyRf = annualRiskFreeRate / 252;
  const excessReturns = dailyReturns.map(r => r - dailyRf);
  const meanExcess = calculateMean(excessReturns);
  const downsideStd = calculateDownsideDeviation(excessReturns, 0);
  if (downsideStd === 0) return 0;
  return (meanExcess / downsideStd) * Math.sqrt(252);
}

export function calculateMaxDrawdown(values: number[]): { maxDrawdown: number; drawdownSeries: number[] } {
  if (values.length === 0) return { maxDrawdown: 0, drawdownSeries: [] };
  let peak = values[0];
  let maxDd = 0;
  const ddSeries: number[] = [];

  for (const v of values) {
    if (v > peak) {
      peak = v;
    }
    const dd = peak > 0 ? (v - peak) / peak : 0;
    ddSeries.push(dd);
    if (dd < maxDd) {
      maxDd = dd;
    }
  }

  return { maxDrawdown: Math.abs(maxDd) * 100, drawdownSeries: ddSeries.map(d => d * 100) };
}

export function calculateHerfindahlIndex(weights: number[]): number {
  // Sum of squared weights (each in range 0-100 or 0-1)
  // Higher = more concentrated. Typically < 1500 is diversified, > 2500 is highly concentrated.
  const normWeights = weights.map(w => (w > 1 ? w : w * 100));
  return normWeights.reduce((acc, w) => acc + Math.pow(w, 2), 0);
}

export function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const meanX = calculateMean(x.slice(0, n));
  const meanY = calculateMean(y.slice(0, n));

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denom = Math.sqrt(denomX * denomY);
  if (denom === 0) return 0;
  return numerator / denom;
}
