import { DCFInputs, DCFOutputs } from "@/types";

export function calculateDCF(inputs: DCFInputs, currentPrice: number): DCFOutputs {
  const {
    forecastYears,
    revenueGrowthRates,
    operatingMargin,
    taxRate,
    reinvestmentRate,
    wacc,
    terminalGrowthRate,
    currentRevenue,
    netDebt,
    sharesOutstanding,
  } = inputs;

  const waccDec = Math.max(0.01, wacc / 100);
  const termGrowthDec = Math.min(waccDec - 0.005, Math.max(0.005, terminalGrowthRate / 100));
  const opMarginDec = operatingMargin / 100;
  const taxDec = taxRate / 100;
  const reinvestDec = reinvestmentRate / 100;

  const projectedRevenues: number[] = [];
  const projectedEbit: number[] = [];
  const projectedNopat: number[] = [];
  const projectedFcf: number[] = [];
  const discountFactors: number[] = [];
  const presentValueFcf: number[] = [];

  let lastRev = currentRevenue;

  for (let year = 1; year <= forecastYears; year++) {
    const growth = (revenueGrowthRates[year - 1] ?? revenueGrowthRates[revenueGrowthRates.length - 1] ?? 5) / 100;
    const rev = lastRev * (1 + growth);
    projectedRevenues.push(rev);
    lastRev = rev;

    const ebit = rev * opMarginDec;
    projectedEbit.push(ebit);

    const nopat = ebit * (1 - taxDec);
    projectedNopat.push(nopat);

    const reinvestment = rev * reinvestDec;
    const fcf = nopat - reinvestment;
    projectedFcf.push(fcf);

    const df = 1 / Math.pow(1 + waccDec, year);
    discountFactors.push(df);

    const pv = fcf * df;
    presentValueFcf.push(pv);
  }

  const sumPvFcf = presentValueFcf.reduce((acc, val) => acc + val, 0);

  // Terminal value calculation (Gordon Growth Model)
  const lastFcf = projectedFcf[projectedFcf.length - 1];
  const terminalFcf = lastFcf * (1 + termGrowthDec);
  const terminalSpread = Math.max(0.005, waccDec - termGrowthDec);
  const terminalValue = terminalFcf / terminalSpread;
  const pvTerminalValue = terminalValue / Math.pow(1 + waccDec, forecastYears);

  const enterpriseValue = sumPvFcf + pvTerminalValue;
  const equityValue = enterpriseValue - netDebt;
  const impliedPerShare = Math.max(0, equityValue / Math.max(0.01, sharesOutstanding));
  const upsideDownside = currentPrice > 0 ? ((impliedPerShare - currentPrice) / currentPrice) * 100 : 0;

  // Build 2D Sensitivity Matrix: WACC +/- 1.5% in 0.5% steps, Terminal Growth +/- 1.0% in 0.5% steps
  const waccSteps = [wacc - 1.5, wacc - 1.0, wacc - 0.5, wacc, wacc + 0.5, wacc + 1.0, wacc + 1.5].filter(w => w > 0);
  const growthSteps = [
    terminalGrowthRate - 1.0,
    terminalGrowthRate - 0.5,
    terminalGrowthRate,
    terminalGrowthRate + 0.5,
    terminalGrowthRate + 1.0,
  ].filter(g => g >= 0.5);

  const sensitivityMatrix = waccSteps.map(stepWacc => {
    return growthSteps.map(stepGrowth => {
      const sWaccDec = stepWacc / 100;
      const sGrowthDec = Math.min(sWaccDec - 0.005, stepGrowth / 100);

      let sSumPvFcf = 0;
      for (let t = 1; t <= forecastYears; t++) {
        const fcf = projectedFcf[t - 1];
        const df = 1 / Math.pow(1 + sWaccDec, t);
        sSumPvFcf += fcf * df;
      }

      const sTerminalFcf = lastFcf * (1 + sGrowthDec);
      const sSpread = Math.max(0.005, sWaccDec - sGrowthDec);
      const sTerminalVal = sTerminalFcf / sSpread;
      const sPvTv = sTerminalVal / Math.pow(1 + sWaccDec, forecastYears);

      const sEv = sSumPvFcf + sPvTv;
      const sEq = sEv - netDebt;
      const sPrice = Math.max(0, sEq / Math.max(0.01, sharesOutstanding));

      return {
        wacc: Number(stepWacc.toFixed(1)),
        terminalGrowth: Number(stepGrowth.toFixed(1)),
        impliedPrice: Number(sPrice.toFixed(2)),
      };
    });
  });

  return {
    projectedRevenues,
    projectedEbit,
    projectedNopat,
    projectedFcf,
    discountFactors,
    presentValueFcf,
    sumPvFcf,
    terminalValue,
    pvTerminalValue,
    enterpriseValue,
    equityValue,
    impliedPerShare,
    currentPrice,
    upsideDownside,
    sensitivityMatrix,
  };
}
