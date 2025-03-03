import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface Proceso {
  pid: number;
  name: string;
  status: string;
  cpu_percent: number;
  memory_rss: number;
  memory_vms: number;
  create_time: number;
}

interface TablaProcesosProps {
  procesos: Proceso[];
}

function formatMemory(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatTime(timestamp: number): string {
  // Si el timestamp es 0, es un proceso del sistema
  if (timestamp === 0) return "Proceso del sistema";

  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

function getStatusBadgeColor(status: string): string {
  switch (status.toLowerCase()) {
    case "running":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "sleeping":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "stopped":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "zombie":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

function getCpuStyle(percentage: number): string {
  if (percentage > 50) return "text-red-600 font-bold";
  if (percentage > 20) return "text-amber-600 font-medium";
  return "text-green-600";
}

export default function TablaProcesos({ procesos }: TablaProcesosProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">PID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[100px]">CPU %</TableHead>
            <TableHead className="w-[120px]">Memoria (RSS)</TableHead>
            <TableHead className="hidden md:table-cell">
              Tiempo de creación
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {procesos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-muted-foreground"
              >
                No hay procesos para mostrar
              </TableCell>
            </TableRow>
          ) : (
            procesos.map((proceso) => (
              <TableRow key={proceso.pid}>
                <TableCell className="font-mono">{proceso.pid}</TableCell>
                <TableCell className="font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{proceso.name || "Proceso sin nombre"}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>PID: {proceso.pid}</p>
                        <p>
                          Memoria Virtual: {formatMemory(proceso.memory_vms)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeColor(proceso.status)}
                  >
                    {proceso.status}
                  </Badge>
                </TableCell>
                <TableCell className={getCpuStyle(proceso.cpu_percent)}>
                  {proceso.cpu_percent.toFixed(1)}%
                </TableCell>
                <TableCell>{formatMemory(proceso.memory_rss)}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {formatTime(proceso.create_time)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
