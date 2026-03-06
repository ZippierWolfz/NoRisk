"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppState } from "@/context/app-state";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const pieColors = ["#1f4dd1", "#4a7fff", "#6e9eff", "#97bbff", "#bfd5ff", "#dce9ff"];

export function PortfolioDNA() {
  const { metrics } = useAppState();

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="h-[340px]">
        <CardTitle>Portfolio DNA: Sectores</CardTitle>
        <CardDescription>Distribucion de pesos por sector.</CardDescription>
        <div className="mt-4 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={metrics.sectorWeights}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {metrics.sectorWeights.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="h-[340px]">
        <CardTitle>Portfolio DNA: Regiones</CardTitle>
        <CardDescription>Exposicion geografica ponderada.</CardDescription>
        <div className="mt-4 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={metrics.regionWeights}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {metrics.regionWeights.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="h-[340px]">
        <CardTitle>Portfolio DNA: Tipo de activo</CardTitle>
        <CardDescription>Comparacion entre Accion y ETF.</CardDescription>
        <div className="mt-4 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.typeWeights}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2f63f2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
