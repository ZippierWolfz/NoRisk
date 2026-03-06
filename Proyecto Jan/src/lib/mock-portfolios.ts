import { TICKERS } from "@/data/tickers";
import { createSeededRandom } from "@/lib/seeded";
import { calculatePortfolioMetrics } from "@/lib/metrics";
import {
  ComparisonSummary,
  MockPortfolioResult,
  Position,
  ProfileResult,
  RiskProfileType,
  ScenarioState,
} from "@/types";

const riskProfiles: RiskProfileType[] = ["Conservador", "Moderado", "Agresivo"];

function buildProfile(type: RiskProfileType): ProfileResult {
  return {
    type,
    explanation: "Mock profile",
    totalScore: type === "Conservador" ? 8 : type === "Moderado" ? 14 : 22,
    answers: {},
    completedAt: new Date().toISOString(),
  };
}

function pickUniverse(type: RiskProfileType) {
  if (type === "Conservador") {
    return TICKERS.filter((ticker) => ticker.riskBase <= 3);
  }
  if (type === "Agresivo") {
    return TICKERS.filter((ticker) => ticker.riskBase >= 3);
  }
  return TICKERS;
}

function randomUniqueItems<T>(input: T[], count: number, rnd: () => number): T[] {
  const copy = [...input];
  const output: T[] = [];

  while (copy.length > 0 && output.length < count) {
    const idx = Math.floor(rnd() * copy.length);
    output.push(copy[idx]);
    copy.splice(idx, 1);
  }

  return output;
}

function toPosition(seedId: string, ticker: (typeof TICKERS)[number], rnd: () => number): Position {
  const quantity = Math.max(1, Math.round(rnd() * 35));
  const avgBuy = ticker.priceNow * (0.8 + rnd() * 0.4);

  return {
    id: `${seedId}-${ticker.ticker}`,
    ticker: ticker.ticker,
    name: ticker.name,
    quantity,
    avgBuyPrice: Math.round(avgBuy * 100) / 100,
    currency: "USD",
    type: ticker.type,
    sector: ticker.sector,
    region: ticker.region,
    riskBase: ticker.riskBase,
    vol: ticker.vol,
    priceNow: ticker.priceNow,
  };
}

export function generateMockPortfolios(
  size: number,
  scenario: ScenarioState,
): MockPortfolioResult[] {
  const rnd = createSeededRandom(20260305 + scenario.seed);
  const results: MockPortfolioResult[] = [];

  for (let i = 0; i < size; i += 1) {
    const profile = riskProfiles[i % riskProfiles.length];
    const universe = pickUniverse(profile);
    const positionsCount = 3 + Math.floor(rnd() * 6);
    const chosen = randomUniqueItems(universe, positionsCount, rnd);
    const positions = chosen.map((ticker) => toPosition(`mock-${i}`, ticker, rnd));
    const metrics = calculatePortfolioMetrics(positions, buildProfile(profile), scenario);

    results.push({
      profile,
      score: metrics.score,
      riskAvg: metrics.riskAvg,
      top1: metrics.top1,
      positions: metrics.positionsCount,
      drawdown: metrics.drawdown,
    });
  }

  return results;
}

export function summarizeComparison(
  userScore: number,
  userProfile: RiskProfileType | null,
  mocks: MockPortfolioResult[],
): ComparisonSummary | null {
  if (!userProfile) {
    return null;
  }

  const group = mocks.filter((item) => item.profile === userProfile);
  if (group.length === 0) {
    return null;
  }

  const sorted = [...group].sort((a, b) => a.score - b.score);
  const belowOrEqual = sorted.filter((item) => item.score <= userScore).length;
  const percentile = (belowOrEqual / sorted.length) * 100;
  const groupMean = group.reduce((acc, item) => acc + item.score, 0) / group.length;

  const ranges = [
    { min: 0, max: 20, range: "0-20" },
    { min: 21, max: 40, range: "21-40" },
    { min: 41, max: 60, range: "41-60" },
    { min: 61, max: 80, range: "61-80" },
    { min: 81, max: 100, range: "81-100" },
  ];

  const histogram = ranges.map((bucket) => ({
    range: bucket.range,
    value: group.filter((item) => item.score >= bucket.min && item.score <= bucket.max).length,
  }));

  let status: ComparisonSummary["status"] = "Dentro";
  let recommendation = "Estas dentro del rango medio de tu perfil. Mantener rebalanceos periodicos puede mejorar estabilidad.";

  if (percentile >= 65) {
    status = "Por encima";
    recommendation = "Estas por encima de la media de tu perfil. Mantener disciplina y evitar sobreconfianza es clave.";
  } else if (percentile <= 35) {
    status = "Por debajo";
    recommendation = "Estas por debajo del grupo de tu perfil. Prioriza reducir concentracion y alinear riesgo.";
  }

  return {
    percentile: Math.round(percentile * 10) / 10,
    groupMean: Math.round(groupMean * 10) / 10,
    groupCount: group.length,
    histogram,
    status,
    recommendation,
  };
}
