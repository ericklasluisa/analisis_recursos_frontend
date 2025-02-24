"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSocket from "@/hooks/use-socketio";
import { NetworkConnection } from "@/types";
import ChartUsoRed from "@/components/dashboard/chart-uso-red";
import { ChartDistribucionRed } from "@/components/dashboard/chart-distribucion-red";
import { ChartErroresRed } from "@/components/dashboard/chart-errores-red";
import { ChartVelocidadRed } from "@/components/dashboard/chart-velocidad-red";
import { ChartMetricasPaquetes } from "@/components/dashboard/chart-metricas-paquetes";
import { useState, useEffect } from "react";

function formatSpeed(speed: number): string {
  if (speed >= 1000) {
    return `${(speed / 1000).toFixed(2)} Gbps`;
  }
  return `${speed} Mbps`;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function RedPage() {
  const networkData =
    useSocket<Record<string, NetworkConnection>>("update_network");

  const [networkHistory, setNetworkHistory] = useState<
    Record<
      string,
      {
        sent: number;
        recv: number;
        timestamp: string;
      }[]
    >
  >({});

  const [packetsHistory, setPacketsHistory] = useState<
    Record<
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
    >
  >({});

  useEffect(() => {
    if (networkData) {
      setNetworkHistory((prev) => {
        const newHistory = { ...prev };
        Object.entries(networkData).forEach(([interface_name, data]) => {
          if (data.is_up) {
            const interfaceHistory = prev[interface_name] || [];
            newHistory[interface_name] = [
              ...interfaceHistory,
              {
                sent: data.network_sent,
                recv: data.network_recv,
                timestamp: new Date().toISOString(),
              },
            ].slice(-20);
          }
        });
        return newHistory;
      });

      setPacketsHistory((prev) => {
        const newHistory = { ...prev };
        Object.entries(networkData).forEach(([interface_name, data]) => {
          if (data.is_up) {
            const interfaceHistory = prev[interface_name] || [];
            newHistory[interface_name] = [
              ...interfaceHistory,
              {
                sent: data.network_sent,
                recv: data.network_recv,
                timestamp: new Date().toISOString(),
                sent_packets: data.network_sent_packets,
                recv_packets: data.network_recv_packets,
                sent_errs: data.network_sent_errs,
                recv_errs: data.network_recv_errs,
                dropin: data.network_dropin,
                dropout: data.network_dropout,
              },
            ].slice(-20);
          }
        });
        return newHistory;
      });
    }
  }, [networkData]);

  const interfaces = Object.entries(networkData || {}).reduce<{
    active: [string, NetworkConnection][];
    inactive: [string, NetworkConnection][];
  }>(
    (acc, entry) => {
      if (entry[1].is_up) {
        acc.active.push(entry);
      } else {
        acc.inactive.push(entry);
      }
      return acc;
    },
    { active: [], inactive: [] }
  );

  const renderInterfaceCard = ([name, data]: [string, NetworkConnection]) => (
    <AccordionItem key={name} value={name}>
      <AccordionTrigger className="font-bold text-lg">
        <div className="flex justify-between items-center w-full pr-4">
          <span>Interfaz: {name}</span>
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              data.is_up
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {data.is_up ? "Activo" : "Inactivo"}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          {data.is_up && networkHistory[name] && (
            <Card>
              <CardHeader>
                <CardTitle>Uso de Red en Tiempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartUsoRed data={networkHistory[name]} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium mb-2">Información General</h3>
                  <p className="text-sm text-muted-foreground">
                    IP: {data.ip_address || "No disponible"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    MAC: {data.mac_address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Velocidad: {formatSpeed(data.speed)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium mb-2">Estadísticas de Tráfico</h3>
                  <p className="text-sm text-muted-foreground">
                    Datos enviados: {formatBytes(data.network_sent)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Datos recibidos: {formatBytes(data.network_recv)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Paquetes enviados: {data.network_sent_packets}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Paquetes recibidos: {data.network_recv_packets}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium mb-2">Errores y Descartes</h3>
                  <p className="text-sm text-muted-foreground">
                    Errores de envío: {data.network_sent_errs}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Errores de recepción: {data.network_recv_errs}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Paquetes descartados (entrada): {data.network_dropin}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Paquetes descartados (salida): {data.network_dropout}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Monitoreo de Red</h2>
      <div className="space-y-6">
        <Accordion
          type="multiple"
          defaultValue={[
            "metricas",
            "velocidad",
            "errores",
            "distribucion",
            ...interfaces.active.map(([name]) => name),
          ]}
          className="w-full space-y-4"
        >
          <AccordionItem value="metricas">
            <AccordionTrigger className="font-bold text-lg">
              Métricas y Tendencias de Paquetes
            </AccordionTrigger>
            <AccordionContent>
              {networkData && Object.keys(packetsHistory).length > 0 && (
                <ChartMetricasPaquetes networkHistory={packetsHistory} />
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="velocidad">
            <AccordionTrigger className="font-bold text-lg">
              Velocidades de Red
            </AccordionTrigger>
            <AccordionContent>
              {networkData && <ChartVelocidadRed networkData={networkData} />}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="errores">
            <AccordionTrigger className="font-bold text-lg">
              Resumen de Errores y Paquetes Descartados
            </AccordionTrigger>
            <AccordionContent>
              {networkData && <ChartErroresRed networkData={networkData} />}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="distribucion">
            <AccordionTrigger className="font-bold text-lg">
              Análisis de Tráfico por Interfaz
            </AccordionTrigger>
            <AccordionContent>
              {networkData && (
                <ChartDistribucionRed networkData={networkData} />
              )}
            </AccordionContent>
          </AccordionItem>

          {interfaces.active.map(renderInterfaceCard)}
        </Accordion>

        {interfaces.inactive.length > 0 && (
          <div>
            <Accordion
              type="multiple"
              defaultValue={[]}
              className="w-full space-y-4"
            >
              {interfaces.inactive.map(renderInterfaceCard)}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
