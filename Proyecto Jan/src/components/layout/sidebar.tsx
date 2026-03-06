"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/cartera", label: "Cartera" },
  { href: "/app/perfil", label: "Perfil" },
  { href: "/app/alertas", label: "Alertas" },
  { href: "/app/anti-panico", label: "Anti-panico" },
  { href: "/app/comparacion", label: "Comparacion" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 border-r border-slate-200 bg-white p-5 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-brand-700">
            NoRisk
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 lg:hidden"
          >
            Cerrar
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "block rounded-xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-relaxed text-blue-800">
          NoRisk no proporciona asesoramiento financiero. Informacion educativa.
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="cerrar sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
        />
      ) : null}
    </>
  );
}
