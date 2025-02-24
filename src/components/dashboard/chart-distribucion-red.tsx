"use client";

import * as React from "react";
import { Pie, PieChart, Sector } from "recharts";
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
import { NetworkConnection } from "@/types";

interface ChartDistribucionRedProps {
  networkData: Record<string, NetworkConnection>;
}

const chartConfig = {
  trafico: {
    label: "Tráfico Total",
    color: "hsl(var(--chart-1))",
  },
  interfaz: {
    label: "Interfaz",
  },
} satisfies ChartConfig;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

interface NetworkData {
  tipo: string;
  nombre: string;
  trafico: number;
  fill: string;
  porcentaje: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: {
    payload: NetworkData;
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="font-medium mb-1">{data.nombre}</p>
        <p className="text-sm text-muted-foreground">
          {formatBytes(data.trafico)}
        </p>
      </div>
    );
  }
  return null;
};

export function ChartDistribucionRed({
  networkData,
}: ChartDistribucionRedProps) {
  const distribucionRed = React.useMemo(() => {
    const interfaces = Object.entries(networkData)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, data]) => data.is_up)
      .map(([name, data], index) => {
        const totalTrafico = data.network_sent + data.network_recv;
        return {
          tipo: name,
          nombre: name,
          trafico: totalTrafico,
          fill: `hsl(var(--chart-${(index % 4) + 1}))`,
          porcentaje: 0, // Se calculará después
        };
      });

    const traficoTotal = interfaces.reduce(
      (sum, item) => sum + item.trafico,
      0
    );
    return interfaces.map((item) => ({
      ...item,
      porcentaje: (item.trafico / traficoTotal) * 100,
    }));
  }, [networkData]);

  const id = "distribution-network";
  const [activeOption, setActiveOption] = React.useState(
    distribucionRed[0]?.tipo || ""
  );

  const activeIndex = React.useMemo(
    () => distribucionRed.findIndex((item) => item.tipo === activeOption),
    [activeOption, distribucionRed]
  );

  const tipos = React.useMemo(
    () => distribucionRed.map((item) => item.tipo),
    [distribucionRed]
  );

  if (distribucionRed.length === 0) return null;

  const traficoTotal = distribucionRed.reduce(
    (sum, item) => sum + item.trafico,
    0
  );

  return (
    <Card data-chart={id} className="flex flex-col md:col-span-4">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Tráfico Total: {formatBytes(traficoTotal)}</CardTitle>
        </div>
        <Select value={activeOption} onValueChange={setActiveOption}>
          <SelectTrigger
            className="ml-auto h-7 w-auto rounded-lg pl-2.5"
            aria-label="Seleccione una interfaz"
          >
            <SelectValue placeholder="Seleccione interfaz" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {tipos.map((key, index) => (
              <SelectItem
                key={key}
                value={key}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: `hsl(var(--chart-${(index % 4) + 1}))`,
                    }}
                  />
                  {key}
                </div>
              </SelectItem>
            ))}
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
              content={<CustomTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
            <Pie
              data={distribucionRed}
              dataKey="trafico"
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
                outerRadius,
                startAngle,
                endAngle,
                fill,
                payload,
              }: PieSectorDataItem) => {
                const data = payload as NetworkData;
                return (
                  <g>
                    <Sector
                      cx={cx}
                      cy={cy}
                      innerRadius={innerRadius}
                      outerRadius={Number(outerRadius) + 8}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      fill={fill}
                    />
                    <Sector
                      cx={cx}
                      cy={cy}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      innerRadius={Number(outerRadius) + 8}
                      outerRadius={Number(outerRadius) + 12}
                      fill={fill}
                      opacity={0.3}
                    />
                    <text
                      x={cx}
                      y={cy! - 15}
                      textAnchor="middle"
                      className="fill-muted-foreground text-sm font-medium"
                    >
                      {data.nombre}
                    </text>
                    <text
                      x={cx}
                      y={cy! + 15}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan className="fill-foreground text-2xl font-bold">
                        {formatBytes(data.trafico).split(" ")[0]}
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy! + 35}
                        className="fill-muted-foreground text-sm"
                      >
                        {formatBytes(data.trafico).split(" ")[1]} (
                        {data.porcentaje.toFixed(1)}%)
                      </tspan>
                    </text>
                  </g>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
