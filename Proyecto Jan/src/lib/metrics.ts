import { getTickerMeta } from "@/data/tickers";
import { seededNoise } from "@/lib/seeded";
import {
  PortfolioMetrics,
  Position,
  ProfileResult,
  RiskProfileType,
  ScenarioMode,
  ScenarioState,
  SmartAlert,
} from "@/types";

const scenarioFactors: Record<ScenarioMode, number> = {
  Normal: 0.8,
  Volatil: 1.4,
  Crisis: 2.2,
};

const scenarioVariation: Record<ScenarioMode, number> = {
  Normal: 0.04,
  Volatil: 0.1,
  Crisis: 0.18,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function isRiskMisaligned(profile: RiskProfileType | null, riskAvg: number): boolean {
  if (!profile) {
    return false;
  }

  if (profile === "Conservador") {
    return riskAvg > 2.5;
  }

  if (profile === "Moderado") {
    return riskAvg > 3.5;
  }

  return riskAvg > 4.5;
}

function scenarioPrice(base: number, mode: ScenarioMode, seed: number, key: string, vol: number): number {
  const noise = seededNoise(seed, key);
  const variation = noise * scenarioVariation[mode] * (0.6 + vol);
  const next = base * (1 + variation);
  return round(Math.max(1, next));
}

export function calculatePortfolioMetrics(
  positions: Position[],
  profile: ProfileResult | null,
  scenario: ScenarioState,
): PortfolioMetrics {
  const rows = positions.map((position) => {
    const meta = getTickerMeta(position.ticker);
    const priceNow = scenarioPrice(
      meta.priceNow,
      scenario.mode,
      scenario.seed,
      position.id || position.ticker,
      meta.vol,
    );

    const estimatedValue = round(position.quantity * priceNow);
    const pnl = round((priceNow - position.avgBuyPrice) * position.quantity);

    return {
      id: position.id,
      ticker: position.ticker,
      name: position.name,
      quantity: position.quantity,
      avgBuyPrice: position.avgBuyPrice,
      priceNow,
      estimatedValue,
      pnl,
      weight: 0,
      sector: position.sector,
      region: position.region,
      type: position.type,
      riskBase: position.riskBase,
      vol: position.vol,
    };
  });

  const totalValue = rows.reduce((acc, row) => acc + row.estimatedValue, 0);

  const rowsWithWeights = rows.map((row) => {
    const weight = totalValue > 0 ? (row.estimatedValue / totalValue) * 100 : 0;
    return {
      ...row,
      weight: round(weight, 2),
    };
  });

  const sortedWeights = [...rowsWithWeights].sort((a, b) => b.weight - a.weight);
  const top1 = sortedWeights.slice(0, 1).reduce((acc, row) => acc + row.weight, 0);
  const top3 = sortedWeights.slice(0, 3).reduce((acc, row) => acc + row.weight, 0);
  const top5 = sortedWeights.slice(0, 5).reduce((acc, row) => acc + row.weight, 0);

  const sectorMap = new Map<string, number>();
  const regionMap = new Map<string, number>();
  const typeMap = new Map<string, number>();

  rowsWithWeights.forEach((row) => {
    sectorMap.set(row.sector, (sectorMap.get(row.sector) ?? 0) + row.weight);
    regionMap.set(row.region, (regionMap.get(row.region) ?? 0) + row.weight);
    typeMap.set(row.type, (typeMap.get(row.type) ?? 0) + row.weight);
  });

  const sectorWeights = [...sectorMap.entries()].map(([name, value]) => ({ name, value: round(value, 2) }));
  const regionWeights = [...regionMap.entries()].map(([name, value]) => ({ name, value: round(value, 2) }));
  const typeWeights = [...typeMap.entries()].map(([name, value]) => ({ name, value: round(value, 2) }));

  const riskAvg = rowsWithWeights.reduce((acc, row) => acc + row.riskBase * (row.weight / 100), 0);
  const volAvg = rowsWithWeights.reduce((acc, row) => acc + row.vol * (row.weight / 100), 0);
  const drawdown = volAvg * scenarioFactors[scenario.mode] * 100;

  let score = 100;

  let concentrationPenalty = 0;
  if (top1 > 35) {
    concentrationPenalty += 15;
  }
  if (top3 > 60) {
    concentrationPenalty += 15;
  }
  if (top5 > 75) {
    concentrationPenalty += 10;
  }
  score -= concentrationPenalty;

  const maxSector = sectorWeights.reduce((acc, item) => Math.max(acc, item.value), 0);
  let sectorPenalty = 0;
  if (maxSector > 45) {
    sectorPenalty = 15;
    score -= sectorPenalty;
  }

  let riskPenalty = 0;
  const profileType = profile?.type ?? null;
  if (profileType === "Conservador" && riskAvg > 2.5) {
    riskPenalty = 20;
  } else if (profileType === "Moderado" && riskAvg > 3.5) {
    riskPenalty = 15;
  } else if (profileType === "Agresivo" && riskAvg > 4.5) {
    riskPenalty = 10;
  }
  score -= riskPenalty;

  const maxRegion = regionWeights.reduce((acc, item) => Math.max(acc, item.value), 0);
  let regionPenalty = 0;
  if (maxRegion > 80) {
    regionPenalty = 10;
    score -= regionPenalty;
  }

  score = clamp(score, 0, 100);

  const scoreBreakdown = [
    {
      key: "concentration",
      label: "Concentracion",
      value: clamp(100 - concentrationPenalty * 2, 0, 100),
      detail: `Top1 ${round(top1, 1)}%, Top3 ${round(top3, 1)}%, Top5 ${round(top5, 1)}%`,
    },
    {
      key: "sector",
      label: "Diversificacion sectorial",
      value: sectorPenalty > 0 ? 55 : 95,
      detail: `Sector maximo ${round(maxSector, 1)}%`,
    },
    {
      key: "risk",
      label: "Riesgo vs perfil",
      value: riskPenalty > 0 ? 50 : 92,
      detail: `Riesgo medio ${round(riskAvg, 2)} / 5`,
    },
    {
      key: "region",
      label: "Exposicion regional",
      value: regionPenalty > 0 ? 60 : 90,
      detail: `Region maxima ${round(maxRegion, 1)}%`,
    },
    {
      key: "volatility",
      label: "Estabilidad",
      value: clamp(100 - volAvg * 120, 20, 95),
      detail: `Volatilidad media ${round(volAvg, 2)}`,
    },
  ];

  const meaning: string[] = [
    `Tu Investor Score es ${score}/100 y resume la salud estructural de tu cartera actual.`,
    `El riesgo medio ponderado es ${round(riskAvg, 2)} sobre 5 y la volatilidad media es ${round(volAvg, 2)}.`,
  ];

  const actions: string[] = [];

  if (top1 > 35) {
    actions.push("Reduce el peso de tu mayor posicion para bajar dependencia de un solo activo.");
  }
  if (maxSector > 45) {
    actions.push("Añade activos de sectores distintos para equilibrar la exposicion.");
  }
  if (isRiskMisaligned(profileType, riskAvg)) {
    actions.push("Ajusta activos de alto riesgo para alinear cartera con tu perfil declarado.");
  }
  if (maxRegion > 80) {
    actions.push("Diversifica geograficamente con ETFs globales o mercados desarrollados ex-US.");
  }
  if (rowsWithWeights.length < 3) {
    actions.push("Amplia la cartera a mas posiciones para reducir concentracion estructural.");
  }
  if (actions.length === 0) {
    actions.push("Mantener rebalanceos periodicos para conservar la calidad de la cartera.");
  }

  return {
    totalValue: round(totalValue),
    positionsCount: rowsWithWeights.length,
    top1: round(top1, 2),
    top3: round(top3, 2),
    top5: round(top5, 2),
    riskAvg: round(riskAvg, 3),
    volAvg: round(volAvg, 3),
    drawdown: round(drawdown, 2),
    score: round(score, 0),
    scoreBreakdown,
    sectorWeights,
    regionWeights,
    typeWeights,
    rows: rowsWithWeights,
    recommendations: {
      meaning,
      actions,
    },
    riskPenaltyApplied: riskPenalty > 0,
  };
}

export function buildSmartAlerts(
  metrics: PortfolioMetrics,
  profile: ProfileResult | null,
  positions: Position[],
): SmartAlert[] {
  const alerts: SmartAlert[] = [];

  const sectorMax = metrics.sectorWeights.reduce(
    (acc, item) => (item.value > acc.value ? item : acc),
    { name: "n/a", value: 0 },
  );

  const regionMax = metrics.regionWeights.reduce(
    (acc, item) => (item.value > acc.value ? item : acc),
    { name: "n/a", value: 0 },
  );

  if (metrics.top1 > 40) {
    alerts.push({
      id: "high-top1",
      severity: "Alta",
      title: "Concentracion critica en un activo",
      description: `Tu posicion principal pesa ${metrics.top1.toFixed(1)}% y aumenta riesgo especifico.`,
      actionLabel: "Revisar cartera",
      href: "/app/cartera",
    });
  }

  if (sectorMax.value > 55) {
    alerts.push({
      id: "high-sector",
      severity: "Alta",
      title: "Exceso en un solo sector",
      description: `El sector ${sectorMax.name} concentra ${sectorMax.value.toFixed(1)}% de la cartera.`,
      actionLabel: "Balancear sectores",
      href: "/app/cartera",
    });
  }

  if (profile && isRiskMisaligned(profile.type, metrics.riskAvg)) {
    alerts.push({
      id: "high-risk-profile",
      severity: "Alta",
      title: "Riesgo desalineado con tu perfil",
      description: `Tu riesgo medio ${metrics.riskAvg.toFixed(2)} excede lo recomendado para perfil ${profile.type}.`,
      actionLabel: "Actualizar perfil",
      href: "/app/perfil",
    });
  }

  if (metrics.drawdown > 8) {
    alerts.push({
      id: "high-drawdown",
      severity: "Alta",
      title: "Caida simulada elevada",
      description: `La caida estimada en escenario actual es ${metrics.drawdown.toFixed(1)}%.`,
      actionLabel: "Activar anti-panico",
      href: "/app/anti-panico",
    });
  }

  if (metrics.top3 > 65) {
    alerts.push({
      id: "mid-top3",
      severity: "Media",
      title: "Top 3 demasiado pesado",
      description: `Tus tres mayores posiciones suman ${metrics.top3.toFixed(1)}%.`,
      actionLabel: "Reducir concentracion",
      href: "/app/cartera",
    });
  }

  if (regionMax.value > 85) {
    alerts.push({
      id: "mid-region",
      severity: "Media",
      title: "Dependencia regional alta",
      description: `La region ${regionMax.name} pesa ${regionMax.value.toFixed(1)}%.`,
      actionLabel: "Diversificar region",
      href: "/app/cartera",
    });
  }

  if (metrics.volAvg > 0.28) {
    alerts.push({
      id: "mid-vol",
      severity: "Media",
      title: "Volatilidad media elevada",
      description: `La volatilidad ponderada es ${metrics.volAvg.toFixed(2)}, por encima del nivel prudente.`,
      actionLabel: "Revisar anti-panico",
      href: "/app/anti-panico",
    });
  }

  const unknownCount = positions.filter((item) => item.sector === "Unknown").length;
  if (unknownCount >= 2) {
    alerts.push({
      id: "low-unknown",
      severity: "Baja",
      title: "Metadatos incompletos en activos",
      description: `Hay ${unknownCount} tickers Unknown que limitan el analisis.`,
      actionLabel: "Editar tickers",
      href: "/app/cartera",
    });
  }

  if (!profile) {
    alerts.push({
      id: "low-profile",
      severity: "Baja",
      title: "Perfil de riesgo pendiente",
      description: "Completar el perfil mejora recomendaciones y deteccion de desalineaciones.",
      actionLabel: "Completar perfil",
      href: "/app/perfil",
    });
  }

  if (positions.length < 3) {
    alerts.push({
      id: "low-size",
      severity: "Baja",
      title: "Cartera demasiado pequena",
      description: "Con menos de 3 posiciones la concentracion suele ser alta.",
      actionLabel: "Agregar posiciones",
      href: "/app/cartera",
    });
  }

  const severityRank: Record<SmartAlert["severity"], number> = {
    Alta: 3,
    Media: 2,
    Baja: 1,
  };

  return alerts.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
}

export function scenarioFactor(mode: ScenarioMode): number {
  return scenarioFactors[mode];
}
