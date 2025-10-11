import { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import analiseService from "@/services/analiseService";
import { DashboardData } from "@/types/dashType";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await analiseService.getData();
        if (!mounted) return;
        setData(resp);
      } catch (err: any) {
        console.error("Erro ao buscar dados do dashboard:", err);
        if (!mounted) return;
        setError("Não foi possível carregar os dados.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Conversão segura para number (o serviço pode retornar strings)
  const toNumber = (v?: string | number | null) => {
    if (v === undefined || v === null) return 0;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isNaN(n) ? 0 : n;
  };

  const total = useMemo(() => toNumber(data?.qtdTotal), [data]);
  const approved = useMemo(() => toNumber(data?.qtdApproved), [data]);
  const rejected = useMemo(
    () => toNumber(data?.qtdRejected ?? data?.qtdCancelled),
    [data]
  );
  const pending = useMemo(() => toNumber(data?.qtdPending), [data]);

  const chartData = useMemo(
    () => [
      { name: "Aprovados", value: approved, color: "#10B981" },
      { name: "Reprovados", value: rejected, color: "#EF4444" },
      { name: "Pendentes", value: pending, color: "#F59E0B" },
    ],
    [approved, rejected, pending]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Bem-vindo ao Sistema de Reserva de Salas da UERJ
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>Total de Requerimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "—" : total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader>
            <CardTitle>Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {loading ? "—" : approved}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader>
            <CardTitle>Reprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {loading ? "—" : rejected}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle>Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {loading ? "—" : pending}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico */}
      <div className="w-full h-80 bg-card rounded-xl shadow p-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                label
                outerRadius={120}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
