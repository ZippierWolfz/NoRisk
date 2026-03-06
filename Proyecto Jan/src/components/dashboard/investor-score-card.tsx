"use client";

import { useAppState } from "@/context/app-state";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatPct } from "@/lib/utils";

function progressClass(value: number): string {
  if (value >= 90) {
    return "w-full";
  }
  if (value >= 75) {
    return "w-5/6";
  }
  if (value >= 60) {
    return "w-4/6";
  }
  if (value >= 45) {
    return "w-3/6";
  }
  if (value >= 30) {
    return "w-2/6";
  }
  if (value >= 15) {
    return "w-1/6";
  }
  return "w-0";
}

export function InvestorScoreCard() {
  const { metrics, profile } = useAppState();

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <CardTitle>Investor Score</CardTitle>
          <CardDescription>Resumen transparente de calidad estructural (0-100).</CardDescription>
        </div>
        <div className="rounded-2xl bg-brand-600 px-5 py-3 text-right text-white">
          <p className="text-xs uppercase tracking-wide text-brand-100">Score actual</p>
          <p className="text-4xl font-black leading-none">{metrics.score}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {metrics.scoreBreakdown.map((item) => (
          <div key={item.key} className="rounded-xl border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="text-sm font-bold text-brand-700">{Math.round(item.value)}</p>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className={`h-2 rounded-full bg-brand-500 ${progressClass(item.value)}`} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-800">Que significa</p>
          <ul className="space-y-1 text-sm text-slate-600">
            {metrics.recommendations.meaning.map((line) => (
              <li key={line}>- {line}</li>
            ))}
            <li>
              - Perfil actual: <span className="font-medium">{profile?.type ?? "Sin completar"}</span>
            </li>
            <li>- Concentracion top1: {formatPct(metrics.top1)}</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-800">Que puedes hacer</p>
          <ul className="space-y-1 text-sm text-slate-600">
            {metrics.recommendations.actions.map((line) => (
              <li key={line}>- {line}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
