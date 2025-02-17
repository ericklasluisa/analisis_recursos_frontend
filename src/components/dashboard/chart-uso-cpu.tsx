"use client";

import { Area, AreaChart, CartesianGrid, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

interface ChartUsoCPUProps {
  data: { porcentaje: number }[];
}

const chartConfig = {
  porcentaje: {
    label: "Uso CPU",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ChartUsoCPU({ data }: ChartUsoCPUProps) {
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
        <YAxis domain={[0, 100]} />
        <CartesianGrid vertical={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Area
          dataKey="porcentaje"
          type="linear"
          fill="var(--color-porcentaje)"
          fillOpacity={0.4}
          stroke="var(--color-porcentaje)"
          animationDuration={0}
        />
      </AreaChart>
    </ChartContainer>
  );
}
