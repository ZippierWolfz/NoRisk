"use client";

import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { Card, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/context/app-state";

export default function AlertasPage() {
  const { loaded, alerts } = useAppState();

  if (!loaded) {
    return <p className="text-sm text-slate-500">Cargando alertas...</p>;
  }

  const high = alerts.filter((alert) => alert.severity === "Alta").length;
  const mid = alerts.filter((alert) => alert.severity === "Media").length;
  const low = alerts.filter((alert) => alert.severity === "Baja").length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardTitle className="text-sm">Alta</CardTitle>
          <p className="mt-2 text-3xl font-black text-red-700">{high}</p>
        </Card>
        <Card>
          <CardTitle className="text-sm">Media</CardTitle>
          <p className="mt-2 text-3xl font-black text-amber-700">{mid}</p>
        </Card>
        <Card>
          <CardTitle className="text-sm">Baja</CardTitle>
          <p className="mt-2 text-3xl font-black text-blue-700">{low}</p>
        </Card>
      </section>

      <AlertsPanel />

      <Card className="text-xs text-slate-600">
        Por que importa: actuar primero en alertas Alta suele reducir riesgos estructurales mas rapido.
      </Card>
    </div>
  );
}
