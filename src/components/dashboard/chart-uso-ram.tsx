"use client";

import { Area, AreaChart, CartesianGrid, YAxis, ReferenceLine } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

interface ChartUsoRAMProps {
  data: { porcentaje: number }[];
}

const chartConfig = {
  porcentaje: {
    label: "Uso RAM",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type ChartValue = string | number | Array<number | string>;

export default function ChartUsoRAM({ data }: ChartUsoRAMProps) {
  // Calcular el valor promedio para la línea de referencia
  const avgValue =
    data.reduce((acc, curr) => acc + curr.porcentaje, 0) / data.length;
  // Encontrar el valor mínimo y máximo para ajustar el dominio
  const minValue = Math.floor(Math.min(...data.map((d) => d.porcentaje)));
  const maxValue = Math.ceil(Math.max(...data.map((d) => d.porcentaje)));
  // Ajustar el dominio para dar un poco de espacio
  const yDomain = [Math.max(0, minValue - 5), Math.min(100, maxValue + 5)];

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] max-h-52 w-full"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <YAxis
          domain={yDomain}
          scale="linear"
          allowDecimals={true}
          tickCount={5}
        />
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <ReferenceLine
          y={avgValue}
          stroke="var(--color-porcentaje)"
          strokeDasharray="3 3"
          strokeOpacity={0.6}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              hideLabel
              formatter={(value: ChartValue) => {
                if (typeof value === "number" || typeof value === "string") {
                  const numValue = Number(value);
                  return isNaN(numValue) ? value : `${numValue.toFixed(2)}%`;
                }
                return String(value);
              }}
            />
          }
        />
        <Area
          dataKey="porcentaje"
          type="monotone"
          fill="var(--color-porcentaje)"
          fillOpacity={0.4}
          stroke="var(--color-porcentaje)"
          strokeWidth={2}
          animationDuration={0}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
