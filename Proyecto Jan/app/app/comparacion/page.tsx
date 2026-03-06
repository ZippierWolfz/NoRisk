"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/context/app-state";

export default function ComparacionPage() {
  const { loaded, profile, metrics, comparison } = useAppState();

  if (!loaded) {
    return <p className="text-sm text-slate-500">Cargando comparacion...</p>;
  }

  if (!profile || !comparison) {
    return (
      <Card>
        <CardTitle>Comparacion anonima</CardTitle>
        <CardDescription>
          Completa primero el perfil para comparar tu cartera contra el grupo correcto.
        </CardDescription>
      </Card>
    );
  }

  const compareBars = [
    { label: "Tu score", value: metrics.score },
    { label: "Media perfil", value: comparison.groupMean },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle className="text-sm">Percentil</CardTitle>
          <p className="mt-1 text-3xl font-black text-brand-700">{comparison.percentile}</p>
          <p className="text-xs text-slate-500">vs perfil {profile.type}</p>
        </Card>
        <Card>
          <CardTitle className="text-sm">Estado</CardTitle>
          <p className="mt-1 text-2xl font-black text-slate-900">{comparison.status}</p>
          <p className="text-xs text-slate-500">Grupo de {comparison.groupCount} carteras</p>
        </Card>
        <Card>
          <CardTitle className="text-sm">Recomendacion</CardTitle>
          <p className="mt-1 text-sm text-slate-700">{comparison.recommendation}</p>
        </Card>
      </section>

      <Card className="h-[320px]">
        <CardTitle>Tu score vs media del grupo</CardTitle>
        <div className="mt-4 h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareBars}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#2f63f2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="h-[320px]">
        <CardTitle>Distribucion de scores en tu perfil</CardTitle>
        <div className="mt-4 h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparison.histogram}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6e9eff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="text-sm text-slate-700">
        Insight: estas {comparison.status.toLowerCase()} respecto a carteras del mismo perfil. Usa esta señal como referencia, no como garantia de resultados.
      </Card>
    </div>
  );
}
