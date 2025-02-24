"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";

interface NetworkUsageData {
  sent: number;
  recv: number;
  timestamp: string;
}

interface ChartUsoRedProps {
  data: NetworkUsageData[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: {
    name: string;
    value: number;
    color: string;
  }[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const chartConfig = {
  sent: {
    label: "Enviado",
    color: "hsl(var(--chart-2))",
  },
  recv: {
    label: "Recibido",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="font-medium mb-2">
          {new Date(label || "").toLocaleTimeString()}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}: {formatBytes(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function calculateDomain(data: NetworkUsageData[]): [number, number] {
  if (data.length === 0) return [0, 100];

  const allValues = data.flatMap((item) => [item.sent, item.recv]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);

  // Si los valores son muy pequeños (bytes)
  if (maxValue < 1024) {
    return [0, 1024]; // Mostrar hasta 1KB para mejor visualización
  }

  // Calcular un rango dinámico
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% de padding

  return [Math.max(0, minValue - padding), maxValue + padding];
}

function formatTimeAxis(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ChartUsoRed({ data }: ChartUsoRedProps) {
  const yDomain = calculateDomain(data);

  // Calcular promedios
  const avgSent = data.reduce((acc, curr) => acc + curr.sent, 0) / data.length;
  const avgRecv = data.reduce((acc, curr) => acc + curr.recv, 0) / data.length;

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] h-[350px] w-full">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="sent" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-sent)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-sent)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="recv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-recv)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-recv)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimeAxis}
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatBytes}
            domain={yDomain}
            tick={{ fontSize: 12 }}
            scale="sqrt" // Usar escala sqrt para mejor visualización de valores pequeños
          />
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <ChartTooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className="text-sm font-medium">{value}</span>
            )}
          />
          <ReferenceLine
            y={avgSent}
            stroke="var(--color-sent)"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            label={{
              value: formatBytes(avgSent),
              fill: "var(--color-sent)",
              fontSize: 12,
              position: "right",
            }}
          />
          <ReferenceLine
            y={avgRecv}
            stroke="var(--color-recv)"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            label={{
              value: formatBytes(avgRecv),
              fill: "var(--color-recv)",
              fontSize: 12,
              position: "left",
            }}
          />
          <Area
            type="monotone"
            dataKey="sent"
            name="Enviado"
            stroke="var(--color-sent)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#sent)"
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false} // Desactivar animación para actualizaciones en tiempo real
          />
          <Area
            type="monotone"
            dataKey="recv"
            name="Recibido"
            stroke="var(--color-recv)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#recv)"
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false} // Desactivar animación para actualizaciones en tiempo real
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
