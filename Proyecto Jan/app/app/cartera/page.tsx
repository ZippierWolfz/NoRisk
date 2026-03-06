"use client";

import { useMemo, useState } from "react";
import { PositionForm, PositionFormValues } from "@/components/cartera/position-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Table } from "@/components/ui/table";
import { useAppState } from "@/context/app-state";
import { formatCurrency, formatPct } from "@/lib/utils";
import { Position } from "@/types";

function toPosition(values: PositionFormValues): Omit<Position, "id"> {
  return {
    ticker: values.ticker,
    name: values.name,
    quantity: values.quantity,
    avgBuyPrice: values.avgBuyPrice,
    currency: values.currency,
    type: values.type,
    sector: values.sector,
    region: values.region,
    riskBase: values.riskBase,
    vol: values.vol,
    priceNow: values.priceNow,
  };
}

function toFormValues(position: Position): PositionFormValues {
  return {
    ticker: position.ticker,
    quantity: position.quantity,
    avgBuyPrice: position.avgBuyPrice,
    currency: position.currency,
    name: position.name,
    type: position.type,
    sector: position.sector,
    region: position.region,
    riskBase: position.riskBase,
    vol: position.vol,
    priceNow: position.priceNow,
  };
}

export default function CarteraPage() {
  const { loaded, positions, metrics, addPosition, updatePosition, removePosition } = useAppState();
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingPosition = useMemo(
    () => positions.find((position) => position.id === editingId) ?? null,
    [positions, editingId],
  );

  if (!loaded) {
    return <p className="text-sm text-slate-500">Cargando cartera...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Añadir posicion</CardTitle>
        <CardDescription>
          Ticker con autocompletado local, metadatos automaticos y validaciones basicas.
        </CardDescription>
        <div className="mt-4">
          <PositionForm
            submitLabel="Añadir posicion"
            onSubmit={(values) => {
              addPosition(toPosition(values));
            }}
          />
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle>Tabla de cartera</CardTitle>
            <CardDescription>Valor estimado con priceNow simulado + variacion por escenario.</CardDescription>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Valor total: <span className="text-brand-700">{formatCurrency(metrics.totalValue)}</span>
          </p>
        </div>

        <Table
          headers={[
            "Ticker",
            "Cantidad",
            "Avg Buy",
            "Price Now",
            "P/L estimado",
            "Peso %",
            "Acciones",
          ]}
        >
          {metrics.rows.map((row) => (
            <tr key={row.id} className="text-sm text-slate-700">
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-900">{row.ticker}</p>
                <p className="text-xs text-slate-500">{row.name}</p>
              </td>
              <td className="px-4 py-3">{row.quantity}</td>
              <td className="px-4 py-3">{formatCurrency(row.avgBuyPrice)}</td>
              <td className="px-4 py-3">{formatCurrency(row.priceNow)}</td>
              <td
                className={
                  row.pnl >= 0
                    ? "px-4 py-3 font-semibold text-emerald-700"
                    : "px-4 py-3 font-semibold text-red-700"
                }
              >
                {formatCurrency(row.pnl)}
              </td>
              <td className="px-4 py-3">{formatPct(row.weight)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(row.id)}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => removePosition(row.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
                  >
                    Borrar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal open={Boolean(editingPosition)} onClose={() => setEditingId(null)} title="Editar posicion">
        {editingPosition ? (
          <PositionForm
            initial={toFormValues(editingPosition)}
            submitLabel="Guardar cambios"
            onSubmit={(values) => {
              updatePosition(editingPosition.id, toPosition(values));
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : null}
      </Modal>
    </div>
  );
}
