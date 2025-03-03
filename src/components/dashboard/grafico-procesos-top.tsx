"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface Proceso {
  pid: number;
  name: string;
  status: string;
  cpu_percent: number;
  memory_rss: number;
  memory_vms: number;
  create_time: number;
}

interface GraficoProcesosTopProps {
  procesos: Proceso[];
  tipo: "cpu_percent" | "memory_rss";
  titulo: string;
}

function formatMemory(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function GraficoProcesosTop({
  procesos,
  tipo,
  titulo,
}: GraficoProcesosTopProps) {
  // Ordenar procesos por el criterio y tomar los top 10
  const topProcesos = [...procesos]
    .sort((a, b) => b[tipo] - a[tipo])
    .slice(0, 10)
    .map((p) => ({
      name: p.name || `PID ${p.pid}`,
      pid: p.pid,
      valor: p[tipo],
    }));

  // Colores para las barras basados en el tipo de dato
  const getColor = (valor: number) => {
    if (tipo === "cpu_percent") {
      if (valor > 50) return "hsl(var(--chart-3))";
      if (valor > 20) return "hsl(var(--chart-2))";
      return "hsl(var(--chart-1))";
    } else {
      // Para memoria
      return "hsl(var(--chart-4))";
    }
  };

  // Función para formatear el valor en tooltip
  const formatValue = (value: number) => {
    if (tipo === "cpu_percent") {
      return `${value.toFixed(1)}%`;
    } else {
      return formatMemory(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topProcesos}
              margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
            >
              <XAxis
                type="number"
                tickFormatter={(value) =>
                  tipo === "cpu_percent" ? `${value}%` : formatMemory(value)
                }
              />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  value.length > 15 ? `${value.substring(0, 15)}...` : value
                }
              />
              <Tooltip
                formatter={(value: number) => formatValue(value)}
                labelFormatter={(label) => `Proceso: ${label}`}
              />
              <Bar
                dataKey="valor"
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              >
                {topProcesos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.valor)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
