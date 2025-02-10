"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "../ui/chart";

interface ChartPorcentajesProps {
  nombre: string;
  porcentaje: number;
}

function getColorByPorcentaje(porcentaje: number): string {
  if (porcentaje <= 40) return "#22c55e";
  if (porcentaje <= 80) return "#f97316";
  return "#ef4444";
}

function ChartPorcentajes({ nombre, porcentaje }: ChartPorcentajesProps) {
  // Asegurar que el porcentaje esté entre 0 y 100
  const porcentajeValido = Math.max(0, Math.min(porcentaje, 100));
  const color = getColorByPorcentaje(porcentajeValido);

  const chartData = [{ recurso: nombre, porcentaje: porcentajeValido }];

  const chartConfig = {
    recurso: {
      label: `Uso de ${nombre}`,
    },
    porcentaje: {
      label: nombre,
      color: color,
    },
  } satisfies ChartConfig;

  // Calcular el ángulo final basado en el porcentaje (rango de 0 a 360 grados)
  const startAngle = 90; // Comienza desde arriba
  const endAngle = 90 - porcentajeValido * 3.6; // Calcula el ángulo según el porcentaje

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RadialBarChart
        data={chartData}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-slate-400 last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar
          dataKey="porcentaje"
          cornerRadius={10}
          fill={color}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {chartData[0].porcentaje.toLocaleString()}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Uso de {nombre}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

export default ChartPorcentajes;
