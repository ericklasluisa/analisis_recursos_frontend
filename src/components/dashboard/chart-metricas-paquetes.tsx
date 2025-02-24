"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useState, useMemo } from "react";
import React from "react";

interface ChartMetricasPaquetesProps {
  networkHistory: Record<
    string,
    {
      sent: number;
      recv: number;
      timestamp: string;
      sent_packets: number;
      recv_packets: number;
      sent_errs: number;
      recv_errs: number;
      dropin: number;
      dropout: number;
    }[]
  >;
}

interface ProcessedData {
  timestamp: string;
  "Paquetes Enviados/s": number;
  "Paquetes Recibidos/s": number;
}

const METRICAS = {
  "Paquetes Enviados/s": "hsl(var(--chart-1))",
  "Paquetes Recibidos/s": "hsl(var(--chart-2))",
} as const;

const INTERVALOS = {
  "1s": 1000,
  "5s": 5000,
  "10s": 10000,
  "30s": 30000,
} as const;

type IntervaloKey = keyof typeof INTERVALOS;

export function ChartMetricasPaquetes({
  networkHistory,
}: ChartMetricasPaquetesProps) {
  const [selectedInterface, setSelectedInterface] = useState<string>("");
  const [selectedIntervalo, setSelectedIntervalo] =
    useState<IntervaloKey>("5s");

  const interfaces = Object.keys(networkHistory);

  // Establecer la interfaz por defecto
  if (interfaces.length > 0 && !selectedInterface) {
    setSelectedInterface(interfaces[0]);
  }

  const processedData = useMemo(() => {
    if (!selectedInterface) return [];

    const data = networkHistory[selectedInterface] || [];

    return data
      .map((item, index, array) => {
        if (index === 0) return null;

        const prevItem = array[index - 1];
        const timeDiff =
          (new Date(item.timestamp).getTime() -
            new Date(prevItem.timestamp).getTime()) /
          1000;

        // Calcular tasa de paquetes por segundo
        const calcRate = (current: number, prev: number) =>
          Math.max(0, (current - prev) / timeDiff);

        return {
          timestamp: item.timestamp,
          "Paquetes Enviados/s": calcRate(
            item.sent_packets,
            prevItem.sent_packets
          ),
          "Paquetes Recibidos/s": calcRate(
            item.recv_packets,
            prevItem.recv_packets
          ),
        };
      })
      .filter(Boolean) as ProcessedData[];
  }, [networkHistory, selectedInterface]);

  // Calcular promedios
  const averages = useMemo(() => {
    if (processedData.length === 0) return {};

    return Object.keys(METRICAS).reduce((acc, key) => {
      acc[key] =
        processedData.reduce((sum, curr) => sum + (curr[key] || 0), 0) /
        processedData.length;
      return acc;
    }, {} as Record<string, number>);
  }, [processedData]);

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Paquetes por Segundo en Tiempo Real</CardTitle>
        <div className="flex gap-4">
          <Select
            value={selectedInterface}
            onValueChange={setSelectedInterface}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccione interfaz" />
            </SelectTrigger>
            <SelectContent>
              {interfaces.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedIntervalo}
            onValueChange={(v) => setSelectedIntervalo(v as IntervaloKey)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Intervalo" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INTERVALOS).map(([key]) => (
                <SelectItem key={key} value={key}>
                  Cada {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <LineChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                tick={{ fontSize: 12 }}
                allowDataOverflow
              />
              <YAxis
                tickFormatter={(value) => `${value.toFixed(0)}/s`}
                tick={{ fontSize: 12 }}
                allowDataOverflow
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <p className="font-medium mb-2">
                          {new Date(label).toLocaleTimeString()}
                        </p>
                        <div className="space-y-1">
                          {payload.map((entry: any) => (
                            <p
                              key={entry.name}
                              className="text-sm text-muted-foreground"
                            >
                              <span
                                className="inline-block w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: entry.stroke }}
                              />
                              {entry.name}: {entry.value.toFixed(2)}/s
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                isAnimationActive={false}
                cursor={false}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
              {Object.entries(METRICAS).map(([key, color]) => (
                <React.Fragment key={key}>
                  <Line
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                    animationDuration={0}
                  />
                  <ReferenceLine
                    y={averages[key]}
                    stroke={color}
                    strokeDasharray="3 3"
                    strokeOpacity={0.5}
                    label={{
                      value: `Promedio: ${Math.round(averages[key] || 0)}/s`,
                      fill: color,
                      fontSize: 12,
                      position: "right",
                    }}
                  />
                </React.Fragment>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
