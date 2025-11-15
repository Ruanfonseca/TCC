import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { solicitationService } from "@/services/solicitationService";
import { SolicitationResponse } from "@/types/solutionType";
import authService from "@/services/authService";
import { Search, Trash2, CheckCircle2, XCircle, Eye } from "lucide-react";
import { UserInfo } from "@/types/auth";
import { Room, RoomResponse } from "@/types/roomType";
import { roomsService } from "@/services/roomService";

export default function SolicitationList() {
  const navigate = useNavigate();
  const [solicitations, setSolicitations] = useState<SolicitationResponse[]>(
    []
  );
  const [filteredSolicitations, setFilteredSolicitations] = useState<
    SolicitationResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSolicitation, setSelectedSolicitation] =
    useState<SolicitationResponse | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "delete" | null
  >(null);
  const [reason, setReason] = useState("");

  const [viewSolicitation, setViewSolicitation] =
    useState<SolicitationResponse | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // novo estado: modal de baixa
  const [baixaModalOpen, setBaixaModalOpen] = useState(false);

  const currentUser = authService.getUser();
  const isLogistica = currentUser?.role === "LOGISTICA";

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    loadSolicitations();
    roomsService
      .getRooms()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const safeRooms = list.map((r: any) => ({
          ...r,
          equipment: Array.isArray(r.equipment) ? r.equipment : [],
        }));
        setRooms(safeRooms);
      })
      .catch(() => {
        setRooms([]); // fallback em caso de erro na API
      });
  }, []);

  useEffect(() => {
    filterSolicitations();
  }, [solicitations, searchTerm, statusFilter]);

  const loadSolicitations = async () => {
    try {
      setLoading(true);
      const data = await solicitationService.getAll();
      console.log(data);
      setSolicitations(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar solicitações",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSolicitations = () => {
    let filtered = [...solicitations];
    if (searchTerm) {
      filtered = filtered.filter((sol) =>
        sol.token.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((sol) => sol.status === statusFilter);
    }
    setFilteredSolicitations(filtered);
  };

  const handleAction = (
    solicitation: SolicitationResponse,
    type: "approve" | "reject" | "delete"
  ) => {
    setSelectedSolicitation(solicitation);
    setActionType(type);
    setReason("");
  };

  const handleBaixa = (solicitation: SolicitationResponse) => {
    setSelectedSolicitation(solicitation);
    setReason("");
    setBaixaModalOpen(true);
  };

  const confirmAction = async (actionType: any) => {
    if (!selectedSolicitation || !actionType) return;

    try {
      if (actionType === "delete") {
        await solicitationService.deleteById(selectedSolicitation.id);

        toast({
          title: "Solicitação excluída",
          description: "A solicitação foi removida com sucesso.",
        });
      } else {
        const status = actionType === "approve" ? "approved" : "rejected";

        const payload = {
          ...selectedSolicitation,
          status,
          approvedReason: reason || "OK",
          approvedBy: status === "approved" ? user?.registration : null,
          rejectedBy: status === "rejected" ? user?.registration : null,
          rejectionReason:
            status === "rejected" ? reason || "Sem motivo informado" : null,
          observations: reason,
          roomId: selectedRoom ? Number(selectedRoom) : null,
        };

        if (actionType === "approve" && !selectedRoom) {
          toast({
            variant: "destructive",
            title: "Selecione uma sala",
            description: "Você precisa escolher uma sala antes de aprovar.",
          });
          return;
        }

        // envia para o endpoint de baixa
        await solicitationService.darBaixaSolicitacao(
          selectedSolicitation.id,
          payload
        );

        toast({
          title: `Solicitação ${
            status === "approved" ? "aprovada" : "rejeitada"
          }`,
          description: `A solicitação foi ${
            status === "approved" ? "aprovada" : "rejeitada"
          } com sucesso.`,
        });
      }

      await loadSolicitations();
      closeDialog();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao processar ação",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const closeDialog = () => {
    setSelectedSolicitation(null);
    setActionType(null);
    setReason("");
    setBaixaModalOpen(false);
    setSelectedRoom(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      pending: { variant: "secondary", label: "Pendente" },
      approved: { variant: "default", label: "Aprovado" },
      rejected: { variant: "destructive", label: "Rejeitado" },
      closed: { variant: "outline", label: "Baixado" },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando requerimentos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Lista de Requerimentos
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Gerencie todos os requerimentos de salas
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Filtros</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Busque e filtre os requerimentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row md:flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por token, professor ou disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            <div className="w-full sm:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                  <SelectItem value="closed">Baixado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Requerimentos ({filteredSolicitations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Versão desktop/tablet */}
          <div className="hidden md:block overflow-x-auto">
            <div className="overflow-y-auto max-h-[70vh] pr-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Sala</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSolicitations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Nenhum requerimento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSolicitations.map((solicitation) => (
                      <TableRow key={solicitation.id}>
                        <TableCell className="font-medium">
                          {solicitation.token}
                        </TableCell>
                        <TableCell>
                          {solicitation.requiredBy?.nome || "—"}
                        </TableCell>
                        <TableCell>{solicitation.materia}</TableCell>
                        <TableCell>
                          {new Date(solicitation.dia).toLocaleDateString(
                            "pt-BR"
                          )}
                        </TableCell>
                        <TableCell>
                          {solicitation.room
                            ? `${solicitation.room.name} — (${solicitation.room.capacity} pessoas)`
                            : "Não atribuída"}
                        </TableCell>
                        <TableCell>
                          {solicitation.scheduleInitial?.startTime} -{" "}
                          {solicitation.scheduleEnd?.endTime}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(solicitation.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewSolicitation(solicitation)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {isLogistica &&
                              solicitation.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleBaixa(solicitation)}
                                >
                                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}

                            {isLogistica && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleAction(solicitation, "delete")
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Versão mobile com Scroll */}
          <div className="block md:hidden overflow-y-auto max-h-[70vh] space-y-3 pr-1">
            {filteredSolicitations.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nenhum requerimento encontrado
              </p>
            ) : (
              filteredSolicitations.map((solicitation) => (
                <div
                  key={solicitation.id}
                  className="border rounded-xl p-3 bg-card shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-primary">
                      {solicitation.token}
                    </h3>
                    {getStatusBadge(solicitation.status)}
                  </div>
                  <p className="text-sm mt-1">
                    <strong>Professor:</strong>{" "}
                    {solicitation.requiredBy?.nome || "—"}
                  </p>
                  <p className="text-sm">
                    <strong>Disciplina:</strong> {solicitation.materia}
                  </p>
                  <p className="text-sm">
                    <strong>Data:</strong>{" "}
                    {new Date(solicitation.dia).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-sm">
                    <strong>Sala:</strong>{" "}
                    {solicitation.room
                      ? `${solicitation.room.name} — (${solicitation.room.capacity} pessoas)`
                      : "Não atribuída"}
                  </p>

                  <p className="text-sm">
                    <strong>Horário:</strong>{" "}
                    {solicitation.scheduleInitial?.startTime} -{" "}
                    {solicitation.scheduleEnd?.endTime}
                  </p>

                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewSolicitation(solicitation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {isLogistica && solicitation.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBaixa(solicitation)}
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      </Button>
                    )}

                    {isLogistica && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction(solicitation, "delete")}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      {/* modais */}
      <AlertDialog open={baixaModalOpen} onOpenChange={setBaixaModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dar baixa no requerimento</AlertDialogTitle>
            <AlertDialogDescription>
              Escolha se deseja <strong>Aprovar</strong> ou{" "}
              <strong>Rejeitar</strong> este requerimento.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Matrícula do Responsável
            </label>
            <Input
              type="text"
              value={user?.registration || ""}
              readOnly
              className="bg-muted cursor-not-allowed"
            />
          </div>

          {/* SELECT DE SALA */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Selecione a Sala</label>
            <Select value={selectedRoom || ""} onValueChange={setSelectedRoom}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha uma sala" />
              </SelectTrigger>
              <SelectContent>
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name} — Bloco {room.block} ({room.capacity} pessoas)
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    Nenhuma sala disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Motivo</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Digite aqui..."
              rows={3}
            />
          </div>

          <AlertDialogFooter className="flex justify-between">
            <AlertDialogCancel onClick={() => closeDialog()}>
              Cancelar
            </AlertDialogCancel>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  confirmAction("reject");
                  setBaixaModalOpen(false);
                }}
              >
                Rejeitar
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  confirmAction("approve");
                  setBaixaModalOpen(false);
                }}
              >
                Aprovar
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={actionType === "delete"}
        onOpenChange={() => closeDialog()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Requerimento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O requerimento será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button onClick={confirmAction}>Confirmar</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!viewSolicitation}
        onOpenChange={() => setViewSolicitation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Detalhes do Requerimento</AlertDialogTitle>
          </AlertDialogHeader>

          {viewSolicitation && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Token:</strong> {viewSolicitation.token}
              </p>

              <p>
                <strong>Professor:</strong>{" "}
                {viewSolicitation.requiredBy?.nome || "—"}
              </p>
              <p>
                <strong>Sala atribuída:</strong>{" "}
                {viewSolicitation.room
                  ? `${viewSolicitation.room.name} — (${viewSolicitation.room.capacity} pessoas)`
                  : "Não atribuída"}
              </p>

              <p>
                <strong>Departamento:</strong>{" "}
                {viewSolicitation.requiredBy?.departamento || "—"}
              </p>

              <p>
                <strong>Disciplina:</strong> {viewSolicitation.materia}
              </p>

              <p>
                <strong>Data:</strong>{" "}
                {new Date(viewSolicitation.dia).toLocaleDateString("pt-BR")}
              </p>

              <p>
                <strong>Horário:</strong>{" "}
                {viewSolicitation.scheduleInitial?.startTime} -{" "}
                {viewSolicitation.scheduleEnd?.endTime}
              </p>

              <p>
                <strong>Número de Pessoas:</strong>{" "}
                {viewSolicitation.numberOfPeople || "—"}
              </p>

              <p>
                <strong>Equipamentos:</strong>{" "}
                {viewSolicitation.equipament?.length
                  ? viewSolicitation.equipament.join(", ")
                  : "—"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {getStatusBadge(viewSolicitation.status)}
              </p>

              {viewSolicitation.rejectionReason && (
                <p>
                  <strong>Motivo da Rejeição:</strong>{" "}
                  {viewSolicitation.rejectionReason}
                </p>
              )}

              {viewSolicitation.observations && (
                <p>
                  <strong>Observações:</strong> {viewSolicitation.observations}
                </p>
              )}

              <p>
                <strong>Data de Criação:</strong>{" "}
                {new Date(viewSolicitation.createdAt).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setViewSolicitation(null)}>
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
