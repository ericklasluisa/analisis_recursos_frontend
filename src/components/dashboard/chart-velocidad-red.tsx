"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkConnection } from "@/types";

interface ChartVelocidadRedProps {
  networkData: Record<string, NetworkConnection>;
}

interface SpeedData {
  name: string;
  speed: number;
  isActive: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Velocidad: {formatSpeed(data.speed)}
          </p>
          <p className="text-sm text-muted-foreground">
            Estado: {data.isActive ? "Activo" : "Inactivo"}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function formatSpeed(speed: number): string {
  if (speed >= 1000) {
    return `${(speed / 1000).toFixed(2)} Gbps`;
  }
  return `${speed} Mbps`;
}

export function ChartVelocidadRed({ networkData }: ChartVelocidadRedProps) {
  const data: SpeedData[] = Object.entries(networkData)
    .map(([name, data]) => ({
      name,
      speed: data.speed,
      isActive: data.is_up,
    }))
    .sort((a, b) => b.speed - a.speed);

  const maxSpeed = Math.max(...data.map((item) => item.speed));
  const yAxisWidth = maxSpeed >= 1000 ? 100 : 80;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Velocidad por Interfaz de Red</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                opacity={0.3}
              />
              <XAxis
                type="number"
                tickFormatter={formatSpeed}
                domain={[0, maxSpeed * 1.1]}
                minTickGap={5}
                allowDataOverflow
              />
              <YAxis
                dataKey="name"
                type="category"
                width={yAxisWidth}
                tick={{ fontSize: 12 }}
                allowDataOverflow
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
                isAnimationActive={false}
              />
              <Bar
                dataKey="speed"
                fill="hsl(var(--chart-1))"
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
                animationDuration={0}
                shape={(props: any) => {
                  const { x, y, width, height, fill } = props;
                  const isActive = props.payload.isActive;

                  return (
                    <g>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={fill}
                        opacity={isActive ? 1 : 0.4}
                      />
                      <circle
                        cx={x + width + 10}
                        cy={y + height / 2}
                        r={4}
                        fill={
                          isActive
                            ? "hsl(var(--success))"
                            : "hsl(var(--destructive))"
                        }
                      />
                    </g>
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
