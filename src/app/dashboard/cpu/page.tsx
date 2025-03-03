"use client";

import ChartPorcentajes from "@/components/dashboard/chart-porcentajes";
import { ChartTiempoCPU } from "@/components/dashboard/chart-tiempo-cpu";
import ChartUsoCPU from "@/components/dashboard/chart-uso-cpu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSocket from "@/hooks/use-socketio";
import { MetricasCPU } from "@/types";
import { useEffect, useState } from "react";

export default function CpuPage() {
  const cpuUsage = useSocket<MetricasCPU>("update_cpu");
  const [cpuHistory, setCpuHistory] = useState<{ porcentaje: number }[]>([]);

  useEffect(() => {
    if (cpuUsage?.cpu_percent !== undefined) {
      setCpuHistory((prev) => {
        const updated = [...prev, { porcentaje: cpuUsage.cpu_percent }];
        return updated.slice(-20);
      });
    }
  }, [cpuUsage?.cpu_percent]);

  // Si los datos de CPU no están disponibles, mostrar loader
  if (!cpuUsage) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="text-center">
          <h3 className="text-lg font-medium">Cargando datos de CPU...</h3>
          <p className="text-muted-foreground">Por favor, espere</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Monitoreo de CPU</h2>
      <Accordion
        type="multiple"
        defaultValue={["info", "uso"]}
        className="w-full"
      >
        <AccordionItem value="uso">
          <AccordionTrigger className="font-bold text-lg">
            Uso de la CPU
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-10">
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

              <Card className="col-span-1 md:col-span-3">
                <CardHeader className="items-center">
                  <CardTitle>Uso de CPU</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ChartUsoCPU data={cpuHistory} />
                </CardContent>
              </Card>

              <ChartTiempoCPU
                cpu_user={cpuUsage?.cpu_user}
                cpu_system={cpuUsage?.cpu_system}
                cpu_idle={cpuUsage?.cpu_idle}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="info">
          <AccordionTrigger className="font-bold text-lg">
            Información del CPU
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-10">
              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Nucleos físicos</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {cpuUsage?.cpu_count || 0}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Nucleos lógicos</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {cpuUsage?.cpu_count_logical || 0}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Frecuencia mínima</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {cpuUsage?.cpu_freq_min || 0} GHz
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Frecuencia máxima</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {cpuUsage?.cpu_freq_max || 0} GHz
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Frecuencia actual</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {cpuUsage?.cpu_freq_current || 0} GHz
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Temperatura</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {cpuUsage?.cpu_temp || 0}
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
