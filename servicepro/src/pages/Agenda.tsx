import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  Eye,
  Clock,
  Users,
  MapPin,
  Monitor,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { agendaService, AgendaItem } from "@/services/agendaService";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./agenda-calendar.css";

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AgendaItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchAgenda = async () => {
      setLoading(true);
      try {
        const data = await agendaService.getAll(selectedDate);
        setAgenda(data);
      } catch (error) {
        console.error("Erro ao buscar agenda:", error);
        setAgenda([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, [selectedDate]);

  const handleViewDetails = (item: AgendaItem) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const hasItems = agenda.some((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === date.getFullYear() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getDate() === date.getDate()
      );
    });
    return hasItems ? "has-events" : "";
  };

  return (
    <div className="space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Agenda de Requerimentos
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Visualize os requerimentos organizados por data
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {agenda.filter((item) => item.status === "approved").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {agenda.filter((item) => item.status === "pending").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {agenda.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Items */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendário
            </CardTitle>
            <CardDescription>
              Selecione uma data para ver os requerimentos
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ReactCalendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              locale="pt-BR"
              tileClassName={tileClassName}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Items for selected date */}
        <Card>
          <CardHeader>
            <CardTitle>
              Requerimentos -{" "}
              {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
            </CardTitle>
            <CardDescription>
              {agenda.length} requerimento(s) nesta data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : agenda.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Nenhum requerimento nesta data
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {agenda.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => handleViewDetails(item)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`flex items-center gap-1 px-2 py-1 rounded ${
                                item.type?.toLowerCase() === "sala"
                                  ? "bg-primary/10 text-primary border border-primary"
                                  : "bg-primary/10 text-primary border border-primary"
                              }`}
                            >
                              {item.type?.toLowerCase() === "sala"
                                ? "Sala"
                                : "Laboratório"}
                            </Badge>

                            <Badge
                              variant="outline"
                              className={
                                item.status === "pending"
                                  ? "bg-warning/10 text-warning border-warning"
                                  : item.status === "approved"
                                  ? "bg-success/10 text-success border-success"
                                  : "bg-destructive/10 text-destructive border-destructive"
                              }
                            >
                              {item.status === "approved"
                                ? "Aprovado"
                                : item.status === "pending"
                                ? "Pendente"
                                : "Rejeitado"}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.professorName}
                          </p>
                          <div className="text-sm flex items-center gap-3 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.timeStart} - {item.timeEnd}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {item.numberOfStudents}
                            </span>
                          </div>
                          {item.location && (
                            <p className="text-sm flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.location}
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Requerimento</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold">Token</Label>
                  <p className="font-mono">{selectedItem.token}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold">Tipo</Label>
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 px-2 py-1 rounded ${
                      selectedItem.type?.toLowerCase() === "sala"
                        ? "bg-primary/10 text-primary border border-primary"
                        : "bg-primary/10 text-primary border border-primary"
                    }`}
                  >
                    {selectedItem.type?.toLowerCase() === "sala"
                      ? "Sala"
                      : "Laboratório"}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Título</Label>
                <p className="text-lg font-semibold">{selectedItem.title}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold">Professor</Label>
                  <p>{selectedItem.professorName}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Disciplina</Label>
                  <p>{selectedItem.subject}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold">Data</Label>
                  <p>
                    {format(new Date(selectedItem.date), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Horário</Label>
                  <p>
                    {selectedItem.timeStart} - {selectedItem.timeEnd}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold">Local</Label>
                  <p>{selectedItem.location || "A definir"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">
                    Número de Alunos
                  </Label>
                  <p>{selectedItem.numberOfStudents}</p>
                </div>
              </div>

              {selectedItem.observations && (
                <div>
                  <Label className="text-sm font-semibold">Observações</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.observations}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={() => setDetailsOpen(false)}>Fechar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
