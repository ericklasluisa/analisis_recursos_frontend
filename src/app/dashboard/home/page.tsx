"use client";

import ChartPorcentajes from "@/components/dashboard/chart-porcentajes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSocket from "@/hooks/use-socketio";
import { MetricasCPU, MetricasRAM, Procesos } from "@/types";
import { NetworkConnection } from "@/types";
import { useEffect, useState } from "react";
import { Activity, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const cpuUsage = useSocket<MetricasCPU>("update_cpu");
  const ramUsage = useSocket<MetricasRAM>("update_memory");
  const networkData =
    useSocket<Record<string, NetworkConnection>>("update_network");
  const procesosData = useSocket<Procesos>("update_processes");

  // Estado para datos de red procesados
  const [networkStats, setNetworkStats] = useState({
    sent: 0,
    recv: 0,
    total: 0,
    activePorts: 0,
  });

  // Procesar datos de red
  useEffect(() => {
    if (networkData) {
      const activeInterfaces = Object.values(networkData).filter(
        (iface) => iface.is_up
      );
      const totalSent = activeInterfaces.reduce(
        (total, iface) => total + iface.network_sent,
        0
      );
      const totalRecv = activeInterfaces.reduce(
        (total, iface) => total + iface.network_recv,
        0
      );

      setNetworkStats({
        sent: totalSent,
        recv: totalRecv,
        total: totalSent + totalRecv,
        activePorts: activeInterfaces.length,
      });
    }
  }, [networkData]);

  // Contar procesos totales
  const totalProcesos = procesosData
    ? procesosData.foreground.length + procesosData.background.length
    : 0;

  // Formatear bytes para mostrar
  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Si alguno de los datos principales no está disponible, mostrar skeletons
  if (!cpuUsage || !ramUsage || !networkData || !procesosData) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Monitoreo de Recursos principales
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10">
          {/* Skeleton para CPU */}
          <Card>
            <CardHeader className="items-center">
              <CardTitle className="flex items-center gap-2">
                Uso de CPU
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-[200px] w-[200px] relative flex items-center justify-center">
                <Skeleton className="h-[200px] w-[200px] rounded-full" />
                <Skeleton className="absolute h-[160px] w-[160px] rounded-full bg-background" />
              </div>
            </CardContent>
          </Card>

          {/* Skeleton para RAM */}
          <Card>
            <CardHeader className="items-center">
              <CardTitle className="flex items-center gap-2">
                Uso de Memoria RAM
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-[200px] w-[200px] relative flex items-center justify-center">
                <Skeleton className="h-[200px] w-[200px] rounded-full" />
                <Skeleton className="absolute h-[160px] w-[160px] rounded-full bg-background" />
              </div>
            </CardContent>
          </Card>

          {/* Skeleton para Red */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" /> Uso de Red
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-20 mb-2 ml-auto" />
                  <Skeleton className="h-4 w-24 ml-auto" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skeleton para Procesos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> Procesos activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <Skeleton className="h-10 w-16 mb-2 mx-auto" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" /> Uso de Red
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-medium">
                  Total: {formatBytes(networkStats.total)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Interfaces activas: {networkStats.activePorts}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Enviado: {formatBytes(networkStats.sent)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Recibido: {formatBytes(networkStats.recv)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" /> Procesos activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{totalProcesos}</p>
                <p className="text-sm text-muted-foreground">
                  Procesos totales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
