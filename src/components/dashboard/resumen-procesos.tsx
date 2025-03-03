import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Activity, ListChecks, Layers, Clock } from "lucide-react";

interface Proceso {
  pid: number;
  name: string;
  status: string;
  cpu_percent: number;
  memory_rss: number;
  memory_vms: number;
  create_time: number;
}

interface ResumenProcesosProps {
  foregroundCount: number;
  backgroundCount: number;
  allProcesses: Proceso[];
}

export function ResumenProcesos({
  foregroundCount,
  backgroundCount,
  allProcesses,
}: ResumenProcesosProps) {
  // Calcular proceso con mayor uso de CPU
  const maxCpuProcess = allProcesses.reduce(
    (max, process) => (process.cpu_percent > max.cpu_percent ? process : max),
    { name: "Ninguno", cpu_percent: 0 } as Proceso
  );

  // Calcular proceso con mayor uso de memoria
  const maxMemoryProcess = allProcesses.reduce(
    (max, process) => (process.memory_rss > max.memory_rss ? process : max),
    { name: "Ninguno", memory_rss: 0 } as Proceso
  );

  // Contar estados de procesos
  const statusCounts = allProcesses.reduce((counts, process) => {
    const status = process.status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Procesos</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {foregroundCount + backgroundCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {foregroundCount} en primer plano, {backgroundCount} en segundo
            plano
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Mayor Uso de CPU
          </CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="truncate text-2xl font-bold">
            {maxCpuProcess.name || `PID ${maxCpuProcess.pid}`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {maxCpuProcess.cpu_percent.toFixed(1)}% de CPU
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Mayor Uso de Memoria
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="truncate text-2xl font-bold">
            {maxMemoryProcess.name || `PID ${maxMemoryProcess.pid}`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatMemory(maxMemoryProcess.memory_rss)}
          </p>
        </CardContent>
      </Card>
    </>
  );
}

function formatMemory(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
