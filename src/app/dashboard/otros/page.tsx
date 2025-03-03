"use client";

import { useState, useEffect } from "react";
import useSocket from "@/hooks/use-socketio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ChartPorcentajes from "@/components/dashboard/chart-porcentajes";
import { Progress } from "@/components/ui/progress";
import {
  HardDrive,
  ArrowUp,
  ArrowDown,
  Clock,
  Database,
  FileText,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MetricasDisco {
  disk_usage: number;
  disk_total: number;
  disk_used: number;
  disk_free: number;
  disk_read: number;
  disk_write: number;
  disk_read_count: number;
  disk_write_count: number;
  disk_read_time: number;
  disk_write_time: number;
}

interface DiskDataItem {
  name: string;
  value: number;
  fill: string;
}

interface ActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: DiskDataItem;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function OtrosPage() {
  const diskMetrics = useSocket<MetricasDisco>("update_disk");
  const [operationHistory, setOperationHistory] = useState<
    {
      read: number;
      write: number;
      timestamp: string;
    }[]
  >([]);
  // Definir el estado activeIndex al inicio del componente, no dentro de una condición
  const [activeIndex, setActiveIndex] = useState(0);

  // Actualizar el historial de operaciones
  useEffect(() => {
    if (diskMetrics) {
      setOperationHistory((prev) => {
        const updated = [
          ...prev,
          {
            read: diskMetrics.disk_read_count,
            write: diskMetrics.disk_write_count,
            timestamp: new Date().toISOString(),
          },
        ];
        return updated.slice(-20); // Mantener solo los últimos 20 puntos
      });
    }
  }, [diskMetrics]);

  // Función para renderizar el sector activo del gráfico circular con tipos específicos
  const renderActiveShape = (props: ActiveShapeProps) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-20}
          textAnchor="middle"
          fill="var(--foreground)"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={20}
          textAnchor="middle"
          fill="var(--foreground)"
        >
          {formatBytes(payload.value)}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
          opacity={0.4}
        />
      </g>
    );
  };

  // Función onPieEnter con tipos específicos
  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  // Si los datos no están disponibles, mostrar skeletons
  if (!diskMetrics) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Monitoreo de Almacenamiento</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-28 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </CardContent>
                </Card>
              ))}
          </div>

          <Accordion
            type="multiple"
            defaultValue={["uso", "operaciones", "rendimiento"]}
            className="w-full space-y-4"
          >
            <AccordionItem value="uso">
              <AccordionTrigger className="font-bold text-lg">
                Uso del Disco
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Uso de Disco</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                      <div className="h-[200px] w-[200px] relative flex items-center justify-center">
                        <Skeleton className="h-[200px] w-[200px] rounded-full" />
                        <Skeleton className="absolute h-[160px] w-[160px] rounded-full bg-background" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Distribución de Espacio</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="operaciones">
              <AccordionTrigger className="font-bold text-lg">
                Operaciones de Disco
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Historial de Operaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-40 w-full" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-40 w-full" />
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rendimiento">
              <AccordionTrigger className="font-bold text-lg">
                Rendimiento
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-4 w-full" />
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Skeleton className="h-4 w-24 mb-1" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <div>
                              <Skeleton className="h-4 w-24 mb-1" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }

  // Preparar datos para visualizaciones
  const diskData: DiskDataItem[] = [
    {
      name: "Usado",
      value: diskMetrics.disk_used,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Libre",
      value: diskMetrics.disk_free,
      fill: "hsl(var(--chart-2))",
    },
  ];

  // Procesar datos para el gráfico de operaciones
  const operationData = operationHistory
    .map((item, index, array) => {
      if (index === 0) {
        return {
          timestamp: item.timestamp,
          lectura: 0,
          escritura: 0,
        };
      }

      const prevItem = array[index - 1];
      const readDiff = item.read - prevItem.read;
      const writeDiff = item.write - prevItem.write;

      return {
        timestamp: item.timestamp,
        lectura: readDiff,
        escritura: writeDiff,
      };
    })
    .slice(1);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Monitoreo de Almacenamiento</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Capacidad Total
              </CardTitle>
              <HardDrive className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBytes(diskMetrics.disk_total)}
              </div>
              <Progress
                value={diskMetrics.disk_usage}
                className={`h-2 mt-2 ${
                  diskMetrics.disk_usage > 80
                    ? "bg-red-500"
                    : diskMetrics.disk_usage > 60
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formatBytes(diskMetrics.disk_used)} usado de{" "}
                {formatBytes(diskMetrics.disk_total)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Datos Transferidos
              </CardTitle>
              <Database className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBytes(diskMetrics.disk_read + diskMetrics.disk_write)}
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(diskMetrics.disk_read)}
                  </span>
                </div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(diskMetrics.disk_write)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Operaciones Totales
              </CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  diskMetrics.disk_read_count + diskMetrics.disk_write_count
                ).toLocaleString()}
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {diskMetrics.disk_read_count.toLocaleString()} lecturas
                  </span>
                </div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {diskMetrics.disk_write_count.toLocaleString()} escrituras
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["uso", "operaciones", "rendimiento"]}
          className="w-full space-y-4"
        >
          <AccordionItem value="uso">
            <AccordionTrigger className="font-bold text-lg">
              Uso del Disco
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Uso de Disco</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <ChartPorcentajes
                      nombre="Disco"
                      porcentaje={diskMetrics.disk_usage}
                    />
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Distribución de Espacio</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={diskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                          isAnimationActive={false}
                        >
                          {diskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatBytes(value)}
                          contentStyle={{
                            background: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                          }}
                        />
                        <Legend
                          formatter={(value: string) =>
                            `${value} (${
                              value === "Usado"
                                ? formatBytes(diskMetrics.disk_used)
                                : formatBytes(diskMetrics.disk_free)
                            })`
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="operaciones">
            <AccordionTrigger className="font-bold text-lg">
              Operaciones de Disco
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Historial de Operaciones</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={operationData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(value) =>
                            new Date(value).toLocaleTimeString()
                          }
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(label) =>
                            new Date(label).toLocaleTimeString()
                          }
                          formatter={(value: any) => [
                            value.toLocaleString(),
                            "",
                          ]}
                          contentStyle={{
                            background: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                          }}
                        />
                        <Legend />
                        <Line
                          name="Operaciones de Lectura"
                          type="monotone"
                          dataKey="lectura"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />
                        <Line
                          name="Operaciones de Escritura"
                          type="monotone"
                          dataKey="escritura"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Operaciones de Lectura</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <ArrowDown className="h-8 w-8 text-green-500 mb-2" />
                      <div className="text-3xl font-bold mb-2">
                        {diskMetrics.disk_read_count.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total de operaciones de lectura
                      </p>
                      <div className="mt-4 w-full">
                        <div className="text-sm font-medium mb-1">
                          Datos leídos
                        </div>
                        <div className="text-lg">
                          {formatBytes(diskMetrics.disk_read)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Operaciones de Escritura</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <ArrowUp className="h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-3xl font-bold mb-2">
                        {diskMetrics.disk_write_count.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total de operaciones de escritura
                      </p>
                      <div className="mt-4 w-full">
                        <div className="text-sm font-medium mb-1">
                          Datos escritos
                        </div>
                        <div className="text-lg">
                          {formatBytes(diskMetrics.disk_write)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rendimiento">
            <AccordionTrigger className="font-bold text-lg">
              Rendimiento
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" /> Tiempo de Operaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        {(
                          diskMetrics.disk_read_time +
                          diskMetrics.disk_write_time
                        ).toLocaleString()}{" "}
                        ms
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tiempo total de operaciones de E/S
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">
                            Tiempo de lectura
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {diskMetrics.disk_read_time.toLocaleString()} ms
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Tiempo de escritura
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {diskMetrics.disk_write_time.toLocaleString()} ms
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tiempo Promedio por Operación</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Lectura",
                            tiempo:
                              diskMetrics.disk_read_time /
                              Math.max(1, diskMetrics.disk_read_count),
                            color: "hsl(var(--chart-1))",
                          },
                          {
                            name: "Escritura",
                            tiempo:
                              diskMetrics.disk_write_time /
                              Math.max(1, diskMetrics.disk_write_count),
                            color: "hsl(var(--chart-2))",
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" />
                        <YAxis
                          tickFormatter={(value) => `${value.toFixed(2)} ms`}
                        />
                        <Tooltip
                          formatter={(value: number) =>
                            `${value.toFixed(2)} ms`
                          }
                          contentStyle={{
                            background: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                          }}
                        />
                        <Bar dataKey="tiempo" isAnimationActive={false}>
                          {[
                            { name: "Lectura", color: "hsl(var(--chart-1))" },
                            { name: "Escritura", color: "hsl(var(--chart-2))" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
