import ChartPorcentajes from "@/components/dashboard/chart-porcentajes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
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
            <ChartPorcentajes nombre="CPU" porcentaje={30} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center">
            <CardTitle>Uso de Memoria RAM</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartPorcentajes nombre="RAM" porcentaje={85} />
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
