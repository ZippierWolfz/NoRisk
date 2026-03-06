"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { tickerOptions, getTickerMeta } from "@/data/tickers";
import { Position } from "@/types";

export interface PositionFormValues {
  ticker: string;
  quantity: number;
  avgBuyPrice: number;
  currency?: string;
  name: string;
  type: Position["type"];
  sector: string;
  region: string;
  riskBase: number;
  vol: number;
  priceNow: number;
}

interface PositionFormProps {
  initial?: PositionFormValues;
  submitLabel: string;
  onSubmit: (values: PositionFormValues) => void;
  onCancel?: () => void;
}

function defaults(): PositionFormValues {
  const meta = getTickerMeta("SPY");
  return {
    ticker: meta.ticker,
    quantity: 1,
    avgBuyPrice: meta.priceNow,
    currency: "USD",
    name: meta.name,
    type: meta.type,
    sector: meta.sector,
    region: meta.region,
    riskBase: meta.riskBase,
    vol: meta.vol,
    priceNow: meta.priceNow,
  };
}

export function PositionForm({ initial, submitLabel, onSubmit, onCancel }: PositionFormProps) {
  const [values, setValues] = useState<PositionFormValues>(initial ?? defaults());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setValues(initial);
    }
  }, [initial]);

  const meta = useMemo(() => getTickerMeta(values.ticker), [values.ticker]);

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      ticker: meta.ticker,
      name: meta.name,
      type: meta.type,
      sector: meta.sector,
      region: meta.region,
      riskBase: meta.riskBase,
      vol: meta.vol,
      priceNow: meta.priceNow,
    }));
  }, [meta]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.ticker.trim()) {
      setError("Ticker obligatorio.");
      return;
    }
    if (Number.isNaN(values.quantity) || values.quantity <= 0) {
      setError("Cantidad debe ser mayor a 0.");
      return;
    }
    if (Number.isNaN(values.avgBuyPrice) || values.avgBuyPrice <= 0) {
      setError("Precio medio debe ser mayor a 0.");
      return;
    }

    setError(null);
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Ticker</span>
          <input
            list="ticker-list"
            value={values.ticker}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                ticker: event.target.value.toUpperCase(),
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="AAPL"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Cantidad</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={values.quantity}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                quantity: Number(event.target.value),
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Precio medio de compra</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={values.avgBuyPrice}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                avgBuyPrice: Number(event.target.value),
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Divisa (opcional)</span>
          <input
            value={values.currency ?? ""}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                currency: event.target.value.toUpperCase(),
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="USD"
          />
        </label>
      </div>

      <datalist id="ticker-list">
        {tickerOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Activo:</span> {values.name}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Tipo:</span> {values.type} | <span className="font-semibold text-slate-800">Sector:</span> {values.sector} | <span className="font-semibold text-slate-800">Region:</span> {values.region}
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
