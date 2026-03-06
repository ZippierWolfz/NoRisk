"use client";

import { todayLabel } from "@/lib/utils";
import { useAppState } from "@/context/app-state";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const { profile, resetDemo } = useAppState();

  const userLabel = profile ? `Perfil ${profile.type}` : "Perfil pendiente";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm font-medium text-slate-700 lg:hidden"
          >
            Menu
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900">{userLabel}</p>
            <p className="text-xs text-slate-500">{todayLabel()}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const confirmed = window.confirm("Esto limpiara perfil, cartera y escenario. ¿Continuar?");
            if (confirmed) {
              resetDemo();
            }
          }}
          className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
        >
          Reset demo
        </button>
      </div>
    </header>
  );
}
