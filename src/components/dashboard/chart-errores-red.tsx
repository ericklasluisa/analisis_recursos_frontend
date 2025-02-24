"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkConnection } from "@/types";

interface ChartErroresRedProps {
  networkData: Record<string, NetworkConnection>;
}

interface ErrorData {
  name: string;
  "Errores de Envío": number;
  "Errores de Recepción": number;
  "Paquetes Descartados (Entrada)": number;
  "Paquetes Descartados (Salida)": number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="font-medium mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.fill }}
              />
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function ChartErroresRed({ networkData }: ChartErroresRedProps) {
  const data: ErrorData[] = Object.entries(networkData)
    .filter(([_, data]) => data.is_up)
    .map(([name, data]) => ({
      name,
      "Errores de Envío": data.network_sent_errs,
      "Errores de Recepción": data.network_recv_errs,
      "Paquetes Descartados (Entrada)": data.network_dropin,
      "Paquetes Descartados (Salida)": data.network_dropout,
    }));

  const colors = {
    "Errores de Envío": "hsl(var(--chart-1))",
    "Errores de Recepción": "hsl(var(--chart-2))",
    "Paquetes Descartados (Entrada)": "hsl(var(--chart-3))",
    "Paquetes Descartados (Salida)": "hsl(var(--chart-4))",
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Estado de Errores por Interfaz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 50, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                height={60}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                width={80}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--accent)", opacity: 0.1 }}
                wrapperStyle={{ zIndex: 1000 }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: "20px" }}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
              {Object.entries(colors).map(([key, color]) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
