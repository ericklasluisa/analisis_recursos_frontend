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
