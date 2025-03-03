"use client";

import { ChartDistribucionRam } from "@/components/dashboard/chart-distribucion-ram";
import ChartPorcentajes from "@/components/dashboard/chart-porcentajes";
import ChartUsoRAM from "@/components/dashboard/chart-uso-ram";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSocket from "@/hooks/use-socketio";
import { MetricasRAM } from "@/types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RamPage() {
  const ramUsage = useSocket<MetricasRAM>("update_memory");
  const [ramHistory, setRamHistory] = useState<{ porcentaje: number }[]>([]);

  useEffect(() => {
    if (ramUsage?.memory_percent !== undefined) {
      setRamHistory((prev) => {
        const updated = [...prev, { porcentaje: ramUsage.memory_percent }];
        return updated.slice(-20);
      });
    }
  }, [ramUsage?.memory_percent]);

  // Si los datos de RAM no están disponibles, mostrar skeletons
  if (!ramUsage) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Monitoreo de RAM</h2>
        <Accordion
          type="multiple"
          defaultValue={["info", "distribucion", "uso"]}
          className="w-full"
        >
          <AccordionItem value="uso">
            <AccordionTrigger className="font-bold text-lg">
              Uso de la Memoria RAM
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-10">
                <Card>
                  <CardHeader className="items-center">
                    <CardTitle>Uso de RAM</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="h-[200px] w-[200px] relative flex items-center justify-center">
                      <Skeleton className="h-[200px] w-[200px] rounded-full" />
                      <Skeleton className="absolute h-[160px] w-[160px] rounded-full bg-background" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-3">
                  <CardHeader className="items-center">
                    <CardTitle>Uso de RAM en el tiempo</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-[200px]">
                    <Skeleton className="h-full w-full" />
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="distribucion">
            <AccordionTrigger className="font-bold text-lg">
              Distribución de uso de la Memoria RAM
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="md:col-span-4 flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Memoria Total</span>
                      <Skeleton className="h-4 w-32" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 justify-center pb-0">
                    <div className="h-[300px] w-full max-w-[300px]">
                      <Skeleton className="h-full w-full rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="info">
            <AccordionTrigger className="font-bold text-lg">
              Información adicional de la Memoria RAM
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-10">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="items-center">
                        <Skeleton className="h-6 w-32" />
                      </CardHeader>
                      <CardContent className="flex items-center justify-center">
                        <Skeleton className="h-8 w-20" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Monitoreo de RAM</h2>
      <Accordion
        type="multiple"
        defaultValue={["info", "distribucion", "uso"]}
        className="w-full"
      >
        <AccordionItem value="uso">
          <AccordionTrigger className="font-bold text-lg">
            Uso de la Memoria RAM
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-10">
              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Uso de RAM</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ChartPorcentajes
                    nombre="RAM"
                    porcentaje={ramUsage?.memory_percent || 0}
                  />
                </CardContent>
              </Card>

              <Card className="col-span-1 md:col-span-3">
                <CardHeader className="items-center">
                  <CardTitle>Uso de RAM en el tiempo</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ChartUsoRAM data={ramHistory} />
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="distribucion">
          <AccordionTrigger className="font-bold text-lg">
            Distribución de uso de la Memoria RAM
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ChartDistribucionRam
                ram_total={ramUsage?.memory_total || 0}
                ram_usada={ramUsage?.memory_used || 0}
                ram_disponible={ramUsage?.memory_available || 0}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="info">
          <AccordionTrigger className="font-bold text-lg">
            Información adicional de la Memoria RAM
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-10">
              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Buffer de Memoria</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {ramUsage?.memory_buffers || 0}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Memoria Caché</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {ramUsage?.memory_cached || 0}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Memoria Compartida</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {ramUsage?.memory_shared || 0}
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
