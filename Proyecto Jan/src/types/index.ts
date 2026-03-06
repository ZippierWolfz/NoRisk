export type RiskProfileType = "Conservador" | "Moderado" | "Agresivo";
export type AssetType = "STOCK" | "ETF";
export type ScenarioMode = "Normal" | "Volatil" | "Crisis";
export type AlertSeverity = "Alta" | "Media" | "Baja";

export interface TickerMeta {
  ticker: string;
  name: string;
  type: AssetType;
  sector: string;
  region: string;
  riskBase: number;
  vol: number;
  priceNow: number;
}

export interface Position {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currency?: string;
  type: AssetType;
  sector: string;
  region: string;
  riskBase: number;
  vol: number;
  priceNow: number;
}

export interface ProfileQuestion {
  id: string;
  question: string;
  options: Array<{ label: string; value: number }>;
}

export interface ProfileResult {
  type: RiskProfileType;
  explanation: string;
  totalScore: number;
  answers: Record<string, number>;
  completedAt: string;
}

export interface PortfolioRow {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  priceNow: number;
  estimatedValue: number;
  pnl: number;
  weight: number;
  sector: string;
  region: string;
  type: AssetType;
}

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  value: number;
  detail: string;
}

export interface Recommendations {
  meaning: string[];
  actions: string[];
}

export interface PortfolioMetrics {
  totalValue: number;
  positionsCount: number;
  top1: number;
  top3: number;
  top5: number;
  riskAvg: number;
  volAvg: number;
  drawdown: number;
  score: number;
  scoreBreakdown: ScoreBreakdownItem[];
  sectorWeights: Array<{ name: string; value: number }>;
  regionWeights: Array<{ name: string; value: number }>;
  typeWeights: Array<{ name: string; value: number }>;
  rows: PortfolioRow[];
  recommendations: Recommendations;
  riskPenaltyApplied: boolean;
}

export interface SmartAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
}

export interface ScenarioState {
  mode: ScenarioMode;
  seed: number;
}

export interface MockPortfolioResult {
  profile: RiskProfileType;
  score: number;
  riskAvg: number;
  top1: number;
  positions: number;
  drawdown: number;
}

export interface ComparisonSummary {
  percentile: number;
  groupMean: number;
  groupCount: number;
  histogram: Array<{ range: string; value: number }>;
  status: "Por encima" | "Dentro" | "Por debajo";
  recommendation: string;
}
