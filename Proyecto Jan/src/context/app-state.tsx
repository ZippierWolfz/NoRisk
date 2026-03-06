"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getTickerMeta } from "@/data/tickers";
import { buildSmartAlerts, calculatePortfolioMetrics } from "@/lib/metrics";
import { generateMockPortfolios, summarizeComparison } from "@/lib/mock-portfolios";
import {
  clearDemoStorage,
  loadChecklist,
  loadPositions,
  loadProfile,
  loadScenario,
  saveChecklist,
  savePositions,
  saveProfile,
  saveScenario,
} from "@/lib/storage";
import {
  ComparisonSummary,
  PortfolioMetrics,
  Position,
  ProfileResult,
  ScenarioMode,
  ScenarioState,
  SmartAlert,
} from "@/types";

interface AppStateValue {
  loaded: boolean;
  profile: ProfileResult | null;
  positions: Position[];
  scenario: ScenarioState;
  checklist: Record<string, boolean>;
  metrics: PortfolioMetrics;
  alerts: SmartAlert[];
  comparison: ComparisonSummary | null;
  setProfile: (profile: ProfileResult | null) => void;
  addPosition: (position: Omit<Position, "id">) => void;
  updatePosition: (id: string, next: Omit<Position, "id">) => void;
  removePosition: (id: string) => void;
  setScenarioMode: (mode: ScenarioMode) => void;
  randomizeScenarioSeed: () => void;
  toggleChecklistItem: (key: string) => void;
  resetDemo: () => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

const DEFAULT_POSITIONS: Position[] = [
  {
    id: "seed-aapl",
    ticker: "AAPL",
    name: "Apple Inc.",
    quantity: 12,
    avgBuyPrice: 184,
    currency: "USD",
    type: "STOCK",
    sector: "Technology",
    region: "US",
    riskBase: 3,
    vol: 0.24,
    priceNow: 212,
  },
  {
    id: "seed-qqq",
    ticker: "QQQ",
    name: "Invesco QQQ",
    quantity: 7,
    avgBuyPrice: 430,
    currency: "USD",
    type: "ETF",
    sector: "Growth Tech",
    region: "US",
    riskBase: 3,
    vol: 0.25,
    priceNow: 459,
  },
  {
    id: "seed-iefa",
    ticker: "IEFA",
    name: "iShares Core MSCI EAFE ETF",
    quantity: 20,
    avgBuyPrice: 72,
    currency: "USD",
    type: "ETF",
    sector: "Broad Market",
    region: "Developed ex-US",
    riskBase: 2,
    vol: 0.19,
    priceNow: 76,
  },
];

function withMetadata(position: Omit<Position, "id">, id: string): Position {
  const meta = getTickerMeta(position.ticker);
  return {
    ...position,
    id,
    ticker: position.ticker.toUpperCase(),
    name: meta.name,
    type: meta.type,
    sector: meta.sector,
    region: meta.region,
    riskBase: meta.riskBase,
    vol: meta.vol,
    priceNow: meta.priceNow,
  };
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyMetrics(): PortfolioMetrics {
  return {
    totalValue: 0,
    positionsCount: 0,
    top1: 0,
    top3: 0,
    top5: 0,
    riskAvg: 0,
    volAvg: 0,
    drawdown: 0,
    score: 100,
    scoreBreakdown: [],
    sectorWeights: [],
    regionWeights: [],
    typeWeights: [],
    rows: [],
    recommendations: {
      meaning: ["Aun no hay datos de cartera para evaluar riesgo y estructura."],
      actions: ["Añade posiciones para activar el analisis completo."],
    },
    riskPenaltyApplied: false,
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<ProfileResult | null>(null);
  const [positions, setPositions] = useState<Position[]>(DEFAULT_POSITIONS);
  const [scenario, setScenario] = useState<ScenarioState>({ mode: "Normal", seed: 42 });
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedProfile = loadProfile();
    const savedPositions = loadPositions();
    const savedScenario = loadScenario();
    const savedChecklist = loadChecklist();

    setProfile(savedProfile);
    setPositions(savedPositions.length > 0 ? savedPositions : DEFAULT_POSITIONS);
    setScenario(savedScenario);
    setChecklist(savedChecklist);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    saveProfile(profile);
  }, [loaded, profile]);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    savePositions(positions);
  }, [loaded, positions]);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    saveScenario(scenario);
  }, [loaded, scenario]);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    saveChecklist(checklist);
  }, [checklist, loaded]);

  const metrics = useMemo(() => {
    if (!loaded) {
      return emptyMetrics();
    }
    return calculatePortfolioMetrics(positions, profile, scenario);
  }, [loaded, positions, profile, scenario]);

  const alerts = useMemo(() => {
    if (!loaded) {
      return [];
    }
    return buildSmartAlerts(metrics, profile, positions);
  }, [loaded, metrics, profile, positions]);

  const comparison = useMemo(() => {
    if (!loaded) {
      return null;
    }

    const mocks = generateMockPortfolios(100, scenario);
    return summarizeComparison(metrics.score, profile?.type ?? null, mocks);
  }, [loaded, metrics.score, profile?.type, scenario]);

  const addPosition = (position: Omit<Position, "id">) => {
    setPositions((prev) => [...prev, withMetadata(position, makeId())]);
  };

  const updatePosition = (id: string, next: Omit<Position, "id">) => {
    setPositions((prev) => prev.map((item) => (item.id === id ? withMetadata(next, id) : item)));
  };

  const removePosition = (id: string) => {
    setPositions((prev) => prev.filter((item) => item.id !== id));
  };

  const setScenarioMode = (mode: ScenarioMode) => {
    setScenario((prev) => ({ ...prev, mode }));
  };

  const randomizeScenarioSeed = () => {
    setScenario((prev) => ({
      ...prev,
      seed: Math.floor(Math.random() * 100000) + 1,
    }));
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetDemo = () => {
    clearDemoStorage();
    setProfile(null);
    setPositions(DEFAULT_POSITIONS);
    setScenario({ mode: "Normal", seed: 42 });
    setChecklist({});
  };

  const value: AppStateValue = {
    loaded,
    profile,
    positions,
    scenario,
    checklist,
    metrics,
    alerts,
    comparison,
    setProfile,
    addPosition,
    updatePosition,
    removePosition,
    setScenarioMode,
    randomizeScenarioSeed,
    toggleChecklistItem,
    resetDemo,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return ctx;
}
