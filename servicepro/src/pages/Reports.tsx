import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getReportData } from "@/services/reports";

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendente";
    case "approved":
      return "Aprovada";
    case "rejected":
      return "Rejeitada";
    default:
      return "Desconhecido";
  }
};

export default function Reports() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reportType, setReportType] = useState("all");
  const [reportData, setReportData] = useState<{
    sala: any[];
    laboratorio: any[];
  }>({
    sala: [],
    laboratorio: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [noData, setNoData] = useState(false);

  const generateReport = async () => {
    if (!startDate || !endDate) return;
    setIsGenerating(true);
    setNoData(false);

    try {
      const data = await getReportData(startDate, endDate, reportType);

      console.log(data);
      const safeData = {
        sala: Array.isArray(data?.sala) ? data.sala : [],
        laboratorio: Array.isArray(data?.laboratorio) ? data.laboratorio : [],
      };

      setReportData(safeData);

      if (safeData.sala.length === 0 && safeData.laboratorio.length === 0) {
        setNoData(true);
      }
    } catch (err) {
      console.error("❌ Erro ao gerar relatório:", err);
      setNoData(true);
      setReportData({ sala: [], laboratorio: [] });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportPDF = () => {
    if (!startDate || !endDate) return;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const margin = 40;
    let y = 40;

    doc.setFontSize(14);
    doc.text("Relatório de Solicitações de Salas e Laboratórios", margin, y);
    y += 20;
    doc.setFontSize(11);
    doc.text(
      `Período: ${format(startDate, "dd/MM/yyyy")} até ${format(
        endDate,
        "dd/MM/yyyy"
      )}`,
      margin,
      y
    );
    y += 30;

    const addSection = (
      title: string,
      data: any[],
      columns: string[],
      mapRow: (item: any) => any[]
    ) => {
      if (!data?.length) return;
      doc.setFontSize(12);
      doc.text(title, margin, y);
      y += 10;

      const rows = data.map(mapRow);
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: y,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        didDrawPage: (dataArg) => {
          y = dataArg.cursor.y + 20;
        },
      });
      y += 20;
    };

    // SALAS
    addSection(
      "Solicitações de Salas",
      reportData.sala,
      [
        "Token",
        "Matéria",
        "Professor",
        "Data",
        "Horário",
        "Equipamentos",
        "Status",
      ],
      (item) => [
        item.token,
        item.materia,
        item.requiredBy?.nome || "Não informado",
        item.dia,
        `${item.scheduleInitial?.startTime || "-"} - ${
          item.scheduleEnd?.endTime || "-"
        }`,
        item.equipament?.join(", ") || "-",
        getStatusText(item.status),
      ]
    );

    // LABORATÓRIOS
    addSection(
      "Solicitações de Laboratórios",
      reportData.laboratorio,
      [
        "Professor",
        "Disciplina",
        "Curso",
        "Data",
        "Horário",
        "Nº Alunos",
        "Status",
      ],
      (item) => [
        item.nomeDocente,
        item.disciplina,
        item.curso,
        item.dia,
        `${item.horarioInicio?.startTime || "-"} - ${
          item.horarioFinal?.endTime || "-"
        }`,
        item.numeroAluno || "-",
        getStatusText(item.status),
      ]
    );

    doc.save(`relatorio-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  // Totais combinando sala + laboratorio
  const allRequests = [
    ...(reportData.sala || []),
    ...(reportData.laboratorio || []),
  ];
  const totalRequests = allRequests.length;
  const approvedRequests = allRequests.filter(
    (r) => r.status === "approved"
  ).length;
  const pendingRequests = allRequests.filter(
    (r) => r.status === "pending"
  ).length;
  const rejectedRequests = allRequests.filter(
    (r) => r.status === "rejected"
  ).length;

  const hasData = totalRequests > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Gere relatórios detalhados sobre solicitações de salas e laboratórios
        </p>
        <div className="mt-2">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary"
          >
            🔒 Acesso restrito à função LOGÍSTICA
          </Badge>
        </div>
      </div>

      {/* FILTROS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Gerador de Relatórios
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para gerar seu relatório personalizado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Data início */}
            <div className="space-y-2">
              <Label>Data de Início *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? format(startDate, "PPP", { locale: ptBR })
                      : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data fim */}
            <div className="space-y-2">
              <Label>Data de Fim *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate
                      ? format(endDate, "PPP", { locale: ptBR })
                      : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Apenas Aprovadas</SelectItem>
                  <SelectItem value="pending">Apenas Pendentes</SelectItem>
                  <SelectItem value="rejected">Apenas Rejeitadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateReport}
            disabled={!startDate || !endDate || isGenerating}
            className="w-full md:w-auto bg-primary hover:bg-primary/90"
          >
            {isGenerating ? "Gerando..." : "Gerar Relatório"}
          </Button>
        </CardContent>
      </Card>

      {/* RESULTADOS */}
      {noData && (
        <Card className="border-dashed border-muted text-center py-10">
          <CardContent>
            <p className="text-muted-foreground">
              Nenhum resultado encontrado para o período selecionado.
            </p>
          </CardContent>
        </Card>
      )}

      {hasData && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total de Solicitações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {totalRequests}
                </div>
                <p className="text-sm text-muted-foreground">
                  No período selecionado
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Aprovadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">
                  {approvedRequests}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">
                  {pendingRequests}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Rejeitadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">
                  {rejectedRequests}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={exportPDF}
            className="bg-secondary hover:bg-secondary/90 border border-gray-300 text-black"
          >
            Exportar PDF
          </Button>
        </>
      )}
    </div>
  );
}
