"use client";

import { useEffect, useState } from "react";
import useSocket from "@/hooks/use-socketio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchIcon, SortAscIcon, SortDescIcon } from "lucide-react";
import TablaProcesos from "@/components/dashboard/tabla-procesos";
import { GraficoProcesosTop } from "@/components/dashboard/grafico-procesos-top";
import { ResumenProcesos } from "@/components/dashboard/resumen-procesos";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Proceso {
  pid: number;
  name: string;
  status: string;
  cpu_percent: number;
  memory_rss: number;
  memory_vms: number;
  create_time: number;
}

interface ProcesosData {
  foreground: Proceso[];
  background: Proceso[];
}

export default function ProcesosPage() {
  const procesosData = useSocket<ProcesosData>("update_processes");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "cpu_percent",
    direction: "desc",
  });

  // Estado para almacenar procesos filtrados
  const [filteredForeground, setFilteredForeground] = useState<Proceso[]>([]);
  const [filteredBackground, setFilteredBackground] = useState<Proceso[]>([]);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    if (procesosData) {
      // Filtrar por término de búsqueda
      const foreground = procesosData.foreground.filter((proceso) =>
        proceso.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const background = procesosData.background.filter((proceso) =>
        proceso.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Ordenar por campo seleccionado
      const sortFn = (a: Proceso, b: Proceso) => {
        const fieldA = a[sortBy.field as keyof Proceso];
        const fieldB = b[sortBy.field as keyof Proceso];

        if (sortBy.direction === "asc") {
          return fieldA > fieldB ? 1 : -1;
        } else {
          return fieldA < fieldB ? 1 : -1;
        }
      };

      setFilteredForeground(foreground.sort(sortFn));
      setFilteredBackground(background.sort(sortFn));
    }
  }, [procesosData, searchTerm, sortBy]);

  if (!procesosData) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Monitoreo de Procesos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Skeleton para ResumenProcesos */}
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
        </div>

        <Accordion
          type="multiple"
          defaultValue={["charts", "table"]}
          className="w-full space-y-4"
        >
          <AccordionItem value="charts">
            <AccordionTrigger className="font-bold text-lg">
              <div className="flex items-center">Gráficos de Procesos</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Procesos por CPU</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Top Procesos por Memoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="table">
            <AccordionTrigger className="font-bold text-lg">
              Lista de Procesos
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="foreground" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="foreground">
                      Procesos en Primer Plano
                    </TabsTrigger>
                    <TabsTrigger value="background">
                      Procesos en Segundo Plano
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Skeleton className="h-9 w-[200px] rounded-md" />
                    </div>
                    <Skeleton className="h-9 w-[120px] rounded-md" />
                  </div>
                </div>

                <TabsContent value="foreground">
                  <div className="rounded-md border">
                    <div className="p-4">
                      <Skeleton className="h-8 w-full mb-4" />
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full mb-2" />
                        ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  // Todos los procesos combinados para análisis
  const allProcesses = [...filteredForeground, ...filteredBackground];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Monitoreo de Procesos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResumenProcesos
          foregroundCount={procesosData.foreground.length}
          backgroundCount={procesosData.background.length}
          allProcesses={allProcesses}
        />
      </div>

      <Accordion
        type="multiple"
        defaultValue={["charts", "table"]}
        className="w-full space-y-4"
      >
        <AccordionItem value="charts">
          <AccordionTrigger className="font-bold text-lg">
            Gráficos de Procesos
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GraficoProcesosTop
                procesos={allProcesses}
                tipo="cpu_percent"
                titulo="Top Procesos por CPU"
              />
              <GraficoProcesosTop
                procesos={allProcesses}
                tipo="memory_rss"
                titulo="Top Procesos por Memoria"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="table">
          <AccordionTrigger className="font-bold text-lg">
            Lista de Procesos
          </AccordionTrigger>
          <AccordionContent>
            <Tabs defaultValue="foreground" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="foreground">
                    Procesos en Primer Plano ({filteredForeground.length})
                  </TabsTrigger>
                  <TabsTrigger value="background">
                    Procesos en Segundo Plano ({filteredBackground.length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar proceso..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Ordenar por {sortBy.field}{" "}
                        {sortBy.direction === "asc" ? (
                          <SortAscIcon className="ml-2 h-4 w-4" />
                        ) : (
                          <SortDescIcon className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {[
                        "pid",
                        "name",
                        "status",
                        "cpu_percent",
                        "memory_rss",
                        "create_time",
                      ].map((field) => (
                        <DropdownMenuItem
                          key={field}
                          onClick={() =>
                            setSortBy({
                              field,
                              direction:
                                sortBy.field === field &&
                                sortBy.direction === "asc"
                                  ? "desc"
                                  : "asc",
                            })
                          }
                        >
                          {field}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <TabsContent value="foreground">
                <TablaProcesos procesos={filteredForeground} />
              </TabsContent>
              <TabsContent value="background">
                <TablaProcesos procesos={filteredBackground} />
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
