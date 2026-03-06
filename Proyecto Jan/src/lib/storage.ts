import { ProfileResult, Position, ScenarioState } from "@/types";

const PREFIX = "norisk:";

export const STORAGE_KEYS = {
  profile: `${PREFIX}profile`,
  positions: `${PREFIX}positions`,
  scenario: `${PREFIX}scenario`,
  checklist: `${PREFIX}checklist`,
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadProfile(): ProfileResult | null {
  if (typeof window === "undefined") {
    return null;
  }
  return safeParse<ProfileResult | null>(localStorage.getItem(STORAGE_KEYS.profile), null);
}

export function saveProfile(profile: ProfileResult | null): void {
  if (typeof window === "undefined") {
    return;
  }
  if (!profile) {
    localStorage.removeItem(STORAGE_KEYS.profile);
    return;
  }
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

export function loadPositions(): Position[] {
  if (typeof window === "undefined") {
    return [];
  }
  return safeParse<Position[]>(localStorage.getItem(STORAGE_KEYS.positions), []);
}

export function savePositions(positions: Position[]): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEYS.positions, JSON.stringify(positions));
}

export function loadScenario(): ScenarioState {
  if (typeof window === "undefined") {
    return { mode: "Normal", seed: 42 };
  }
  return safeParse<ScenarioState>(localStorage.getItem(STORAGE_KEYS.scenario), {
    mode: "Normal",
    seed: 42,
  });
}

export function saveScenario(scenario: ScenarioState): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEYS.scenario, JSON.stringify(scenario));
}

export function loadChecklist(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return {};
  }
  return safeParse<Record<string, boolean>>(localStorage.getItem(STORAGE_KEYS.checklist), {});
}

export function saveChecklist(checklist: Record<string, boolean>): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(checklist));
}

export function clearDemoStorage(): void {
  if (typeof window === "undefined") {
    return;
  }
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
