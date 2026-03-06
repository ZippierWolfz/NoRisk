"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/context/app-state";

const checklistItems = [
  { key: "horizon", label: "Revisar horizonte temporal" },
  { key: "diversification", label: "Revisar diversificacion" },
  { key: "impulsive", label: "Evitar venta impulsiva" },
  { key: "liquidity", label: "Revisar liquidez" },
  { key: "rebalance", label: "Considerar rebalanceo" },
  { key: "thesis", label: "Confirmar tesis de inversion" },
];

export default function AntiPanicoPage() {
  const {
    loaded,
    scenario,
    setScenarioMode,
    randomizeScenarioSeed,
    metrics,
    checklist,
    toggleChecklistItem,
  } = useAppState();

  if (!loaded) {
    return <p className="text-sm text-slate-500">Cargando anti-panico...</p>;
  }

  const panicActive = metrics.drawdown > 8;

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Escenario de mercado</CardTitle>
        <CardDescription>
          Simulacion local: Normal / Volatil / Crisis guardada en localStorage.
        </CardDescription>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={scenario.mode}
            onChange={(event) => setScenarioMode(event.target.value as "Normal" | "Volatil" | "Crisis")}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="Normal">Normal</option>
            <option value="Volatil">Volatil</option>
            <option value="Crisis">Crisis</option>
          </select>

          <button
            type="button"
            onClick={randomizeScenarioSeed}
            className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700"
          >
            Generar escenario alternativo
          </button>

          <span className="text-xs text-slate-500">Seed actual: {scenario.seed}</span>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Caida simulada estimada (drawdown):</p>
          <p className="text-3xl font-black text-slate-900">{metrics.drawdown.toFixed(1)}%</p>
        </div>
      </Card>

      {panicActive ? (
        <Card className="space-y-5 border-amber-200 bg-amber-50">
          <div>
            <CardTitle>Modo Anti-panico activo</CardTitle>
            <p className="mt-2 text-sm text-amber-900">
              El mercado simulado esta tenso, pero una respuesta calmada suele proteger mejores decisiones.
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-amber-900">Checklist interactiva</p>
            <div className="space-y-2">
              {checklistItems.map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm text-amber-900"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checklist[item.key])}
                    onChange={() => toggleChecklistItem(item.key)}
                    className="h-4 w-4"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-4 text-sm text-slate-700">
            <p className="mb-2 font-semibold text-slate-900">Plan de accion (3 pasos)</p>
            <ol className="space-y-1">
              <li>1. Espera 24h antes de ejecutar cambios grandes para reducir sesgo emocional.</li>
              <li>2. Prioriza rebalancear pesos extremos en vez de liquidar toda la cartera.</li>
              <li>3. Define limites de riesgo y revisa si cada posicion mantiene tesis valida.</li>
            </ol>
          </div>
        </Card>
      ) : (
        <Card className="border-emerald-200 bg-emerald-50 text-sm text-emerald-800">
          Drawdown por debajo de 8%. Modo anti-panico no necesario ahora, mantén seguimiento regular.
        </Card>
      )}

      <Card className="border-brand-100 bg-brand-50 text-xs text-brand-800">
        NoRisk no proporciona asesoramiento financiero. Informacion educativa.
      </Card>
    </div>
  );
}
