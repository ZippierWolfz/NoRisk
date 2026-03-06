"use client";

import { useState } from "react";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { AssistantChat } from "@/components/dashboard/assistant-chat";
import { InvestorScoreCard } from "@/components/dashboard/investor-score-card";
import { PortfolioDNA } from "@/components/dashboard/portfolio-dna";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useAppState } from "@/context/app-state";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { loaded, metrics, alerts } = useAppState();
  const [tab, setTab] = useState("resumen");

  if (!loaded) {
    return <p className="text-sm text-slate-500">Cargando datos locales...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Valor estimado</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{formatCurrency(metrics.totalValue)}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Posiciones</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{metrics.positionsCount}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Drawdown simulado</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{metrics.drawdown.toFixed(1)}%</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alertas activas</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{alerts.length}</p>
        </Card>
      </section>

      <Tabs
        tabs={[
          { key: "resumen", label: "Resumen" },
          { key: "asistente", label: "Asistente" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "resumen" ? (
        <div className="space-y-6">
          <InvestorScoreCard />
          <PortfolioDNA />
          <AlertsPanel limit={4} />
        </div>
      ) : (
        <AssistantChat />
      )}

      <Card className="border-brand-100 bg-brand-50 text-xs text-brand-800">
        NoRisk no proporciona asesoramiento financiero. Informacion educativa.
      </Card>
    </div>
  );
}
