"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartTiempoCPUProps {
  cpu_user: number | undefined;
  cpu_system: number | undefined;
  cpu_idle: number | undefined;
}

const chartConfig = {
  segundos: {
    label: "Segundos",
  },
  tiempo: {
    label: "Tiempo",
  },
  usuario: {
    label: "Usuario",
    color: "hsl(var(--chart-1))",
  },
  kernel: {
    label: "Kernel",
    color: "hsl(var(--chart-2))",
  },
  inactivo: {
    label: "Inactivo",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function ChartTiempoCPU({
  cpu_user,
  cpu_system,
  cpu_idle,
}: ChartTiempoCPUProps) {
  const cpuTimeData = React.useMemo(
    () => [
      { tipo: "usuario", tiempo: cpu_user || 0, fill: "var(--color-usuario)" },
      { tipo: "kernel", tiempo: cpu_system || 0, fill: "var(--color-kernel)" },
      { tipo: "inactivo", tiempo: cpu_idle || 0, fill: "var(--color-inactivo)" },
    ],
    [cpu_user, cpu_system, cpu_idle]
  );

  const id = "tiempo-cpu";
  const [activeOption, setActiveOption] = React.useState(cpuTimeData[0].tipo);

  const activeIndex = React.useMemo(
    () => cpuTimeData.findIndex((item) => item.tipo === activeOption),
    [activeOption, cpuTimeData]
  );
  const tipos = React.useMemo(
    () => cpuTimeData.map((item) => item.tipo),
    [cpuTimeData]
  );

  return (
    <Card data-chart={id} className="flex flex-col md:col-span-4">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Tiempo de uso de la CPU</CardTitle>
        </div>
        <Select value={activeOption} onValueChange={setActiveOption}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Seleccione un valor"
          >
            <SelectValue placeholder="Seleccione un tipo" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {tipos.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={cpuTimeData}
              dataKey="tiempo"
              nameKey="tipo"
              innerRadius={90}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {cpuTimeData[activeIndex].tiempo.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Segundos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
