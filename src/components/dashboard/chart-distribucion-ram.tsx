"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { TooltipProps } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartDistribucionRamProps {
  ram_total: number;
  ram_usada: number;
  ram_disponible: number;
}

const chartConfig = {
  gb: {
    label: "GB",
  },
  memoria: {
    label: "Memoria",
  },
  usado: {
    label: "Memoria Usada",
    color: "hsl(var(--chart-1))",
  },
  disponible: {
    label: "Memoria Disponible",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

interface MemoryData {
  tipo: string;
  memoria: number;
  fill: string;
  porcentaje: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: {
    payload: MemoryData;
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="font-medium mb-1">
          {data.tipo === "usado" ? "Memoria Usada" : "Memoria Disponible"}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatBytes(data.memoria)}
        </p>
      </div>
    );
  }
  return null;
};

export function ChartDistribucionRam({
  ram_total,
  ram_usada,
  ram_disponible,
}: ChartDistribucionRamProps) {
  const distribucionRam = React.useMemo(
    () => [
      {
        tipo: "usado",
        memoria: ram_usada,
        fill: "var(--color-usado)",
        porcentaje: (ram_usada / ram_total) * 100,
      },
      {
        tipo: "disponible",
        memoria: ram_disponible,
        fill: "var(--color-disponible)",
        porcentaje: (ram_disponible / ram_total) * 100,
      },
    ],
    [ram_total, ram_disponible, ram_usada]
  );

  const id = "distribution-ram";
  const [activeOption, setActiveOption] = React.useState(
    distribucionRam[0].tipo
  );

  const activeIndex = React.useMemo(
    () => distribucionRam.findIndex((item) => item.tipo === activeOption),
    [activeOption, distribucionRam]
  );
  const tipos = React.useMemo(
    () => distribucionRam.map((item) => item.tipo),
    [distribucionRam]
  );

  return (
    <Card data-chart={id} className="flex flex-col md:col-span-4">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Memoria Total: {formatBytes(ram_total)}</CardTitle>
        </div>
        <Select value={activeOption} onValueChange={setActiveOption}>
          <SelectTrigger
            className="ml-auto h-7 w-auto rounded-lg pl-2.5"
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
              content={<CustomTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
            <Pie
              data={distribucionRam}
              dataKey="memoria"
              nameKey="tipo"
              innerRadius={90}
              outerRadius={120}
              strokeWidth={2}
              activeIndex={activeIndex}
              startAngle={90}
              endAngle={-270}
              activeShape={({
                cx,
                cy,
                innerRadius,
                outerRadius = 0,
                startAngle,
                endAngle,
                fill,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 8}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    {...props}
                  />
                  <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 8}
                    outerRadius={outerRadius + 12}
                    fill={fill}
                    opacity={0.3}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const bytes = distribucionRam[activeIndex].memoria;
                    const formattedValue = formatBytes(bytes);
                    const [value, unit] = formattedValue.split(" ");
                    const tipo = distribucionRam[activeIndex].tipo;
                    const porcentaje = distribucionRam[activeIndex].porcentaje;

                    return (
                      <>
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy! - 15}
                          textAnchor="middle"
                          className="fill-muted-foreground text-sm font-medium"
                        >
                          {tipo === "usado" ? "Usado" : "Disponible"}
                        </text>
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy! + 15}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan className="fill-foreground text-2xl font-bold">
                            {value}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy! + 35}
                            className="fill-muted-foreground text-sm"
                          >
                            {unit} ({porcentaje.toFixed(1)}%)
                          </tspan>
                        </text>
                      </>
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
