"use client";

import ChartPorcentajes from "@/components/dashboard/chart-porcentajes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSocket from "@/hooks/use-socketio";
import { MetricasCPU, MetricasRAM } from "../../../types/index";

export default function HomePage() {
  const cpuUsage = useSocket<MetricasCPU>("update_cpu");
  const ramUsage = useSocket<MetricasRAM>("update_memory");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Monitoreo de Recursos principales
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10">
        <Card>
          <CardHeader className="items-center">
            <CardTitle>Uso de CPU</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartPorcentajes
              nombre="CPU"
              porcentaje={cpuUsage?.cpu_percent || 0}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center">
            <CardTitle>Uso de Memoria RAM</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartPorcentajes
              nombre="RAM"
              porcentaje={ramUsage?.memory_percent || 0}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center">
            <CardTitle>Uso de Red</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <p>20 Kbps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center">
            <CardTitle>Procesos activos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            100
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
