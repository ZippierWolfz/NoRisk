"use client";

import Link from "next/link";
import { useAppState } from "@/context/app-state";
import { SeverityBadge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface AlertsPanelProps {
  limit?: number;
}

export function AlertsPanel({ limit }: AlertsPanelProps) {
  const { alerts } = useAppState();
  const list = typeof limit === "number" ? alerts.slice(0, limit) : alerts;

  return (
    <Card>
      <CardTitle>Alertas inteligentes</CardTitle>
      <CardDescription>Panel priorizado por severidad para actuar rapido.</CardDescription>

      <div className="mt-4 space-y-3">
        {list.length === 0 ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            Sin alertas activas ahora.
          </div>
        ) : (
          list.map((alert) => (
            <div key={alert.id} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                <SeverityBadge severity={alert.severity} />
              </div>
              <p className="mb-3 text-sm text-slate-600">{alert.description}</p>
              <Link
                href={alert.href}
                className="inline-flex rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                {alert.actionLabel}
              </Link>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
