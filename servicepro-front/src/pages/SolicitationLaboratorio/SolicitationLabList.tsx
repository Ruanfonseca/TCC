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
import { Search, Trash2, CheckCircle2, Eye } from "lucide-react";
import authService from "@/services/authService";
import { UserInfo } from "@/types/auth";
import { RoomResponse } from "@/types/roomType";
import { roomsService } from "@/services/roomService";
import { solicitationLabService } from "@/services/SolicitationLabService";
import labService, { LaboratorioResponse } from "@/services/labService";

export default function SolicitationLabList() {
  const navigate = useNavigate();
  const [solicitations, setSolicitations] = useState<any[]>([]);
  const [filteredSolicitations, setFilteredSolicitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSolicitation, setSelectedSolicitation] = useState<any | null>(
    null,
  );
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "delete" | null
  >(null);
  const [reason, setReason] = useState("");

  const [viewSolicitation, setViewSolicitation] = useState<any | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [labs, setLabs] = useState<LaboratorioResponse[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [baixaModalOpen, setBaixaModalOpen] = useState(false);

  const currentUser = authService.getUser();
  const isLogistica =
    currentUser?.role === "ADMIN" || currentUser?.role === "ADMIN_LAB";

  useEffect(() => {
    setUser(currentUser);
    loadSolicitations();
    labService
      .getLaboratorios()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const safeRooms = list.map((r: any) => ({
          ...r,
          equipment: Array.isArray(r.equipment) ? r.equipment : [],
        }));
        setLabs(safeRooms);
      })
      .catch(() => setLabs([]));
  }, []);

  useEffect(() => {
    filterSolicitations();
  }, [solicitations, searchTerm, statusFilter]);

  const loadSolicitations = async () => {
    try {
      setLoading(true);
      const response = await solicitationLabService.getLabSolicitations();

      setSolicitations(response);
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
        sol.token.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((sol) => sol.status === statusFilter);
    }
    setFilteredSolicitations(filtered);
  };

  const handleAction = (
    solicitation: any,
    type: "approve" | "reject" | "delete",
  ) => {
    setSelectedSolicitation(solicitation);
    setActionType(type);
    setReason("");
  };

  const handleBaixa = (solicitation: any) => {
    setSelectedSolicitation(solicitation);
    setReason("");
    setBaixaModalOpen(true);
  };

  const confirmAction = async (actionType: any) => {
    if (!selectedSolicitation || !actionType) return;

    try {
      if (actionType === "delete") {
        await labService.deleteLab(selectedSolicitation.id);
        toast({ title: "Solicitação excluída com sucesso." });
      } else {
        const status = actionType === "approve" ? "approved" : "rejected";

        const payload = {
          ...selectedSolicitation,
          status,
          approvedReason: status === "approved" ? reason : "",
          approvedBy: status === "approved" ? user?.registration : null,
          rejectedBy: status === "rejected" ? user?.registration : null,
          rejectionReason:
            status === "rejected" ? reason || "Sem motivo informado" : null,
          observations: reason,
          laboratorioId: selectedRoom ? Number(selectedRoom) : null,
        };

        if (actionType === "approved" && !selectedRoom) {
          toast({
            variant: "destructive",
            title: "Selecione um laboratório",
            description:
              "Você precisa escolher um laboratório antes de aprovar.",
          });
          return;
        }

        await labService.darBaixaSolicitacao(selectedSolicitation.id, payload);

        toast({
          title: `Solicitação ${
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
        <div className="text-lg">Carregando solicitações...</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Lista de Requerimentos
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Gerencie e acompanhe os requerimentos de uso de laboratórios.
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Filtros</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Busque por token, docente ou disciplina
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row md:flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por token ou docente..."
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

      {/* Lista de Solicitações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Solicitações ({filteredSolicitations.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Contêiner com scroll vertical */}
          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
            {/* Versão desktop/tablet */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Docente</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredSolicitations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSolicitations.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.token}</TableCell>
                        <TableCell>{s.nomeDocente}</TableCell>
                        <TableCell>{s.disciplina}</TableCell>
                        <TableCell>{s.curso}</TableCell>
                        <TableCell>
                          {new Date(s.dia).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {s.horarioInicio?.startTime} -{" "}
                          {s.horarioFinal?.endTime}
                        </TableCell>
                        <TableCell>{getStatusBadge(s.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewSolicitation(s)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {isLogistica && s.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBaixa(s)}
                              >
                                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                              </Button>
                            )}

                            {isLogistica && s.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAction(s, "delete")}
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

            {/* Versão mobile */}
            <div className="block md:hidden space-y-3">
              {filteredSolicitations.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Nenhum registro encontrado
                </p>
              ) : (
                filteredSolicitations.map((s) => (
                  <div
                    key={s.id}
                    className="border rounded-xl p-3 bg-card shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-primary">{s.token}</h3>
                      {getStatusBadge(s.status)}
                    </div>
                    <p className="text-sm mt-1">
                      <strong>Docente:</strong> {s.nomeDocente}
                    </p>
                    <p className="text-sm">
                      <strong>Disciplina:</strong> {s.disciplina}
                    </p>
                    <p className="text-sm">
                      <strong>Curso:</strong> {s.curso}
                    </p>
                    <p className="text-sm">
                      <strong>Data:</strong>{" "}
                      {new Date(s.dia).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm">
                      <strong>Horário:</strong> {s.horarioInicio?.startTime} -{" "}
                      {s.horarioFinal?.endTime}
                    </p>

                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewSolicitation(s)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {isLogistica && s.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBaixa(s)}
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}

                      {isLogistica && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(s, "delete")}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={baixaModalOpen} onOpenChange={setBaixaModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dar baixa no Requerimento</AlertDialogTitle>
            <AlertDialogDescription>
              Escolha se deseja <strong>Aprovar</strong> ou{" "}
              <strong>Rejeitar</strong> este requerimento.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
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

          {/* Selecione a sala */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Selecione a Laboratório
            </label>
            <Select value={selectedRoom || ""} onValueChange={setSelectedRoom}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha uma laboratório" />
              </SelectTrigger>
              <SelectContent>
                {labs?.length ? (
                  labs.map((labs) => (
                    <SelectItem key={labs.id} value={labs.id.toString()}>
                      {labs.nome} — Bloco {labs.bloco} ({labs.capacidade}{" "}
                      pessoas)
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    Nenhum Laboratório disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Motivo / Observação</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Digite aqui..."
              rows={3}
            />
          </div>

          <AlertDialogFooter className="flex justify-between">
            <AlertDialogCancel onClick={closeDialog}>
              Cancelar
            </AlertDialogCancel>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => confirmAction("rejected")}
              >
                Rejeitar
              </Button>
              <Button
                variant="default"
                onClick={() => confirmAction("approve")}
              >
                Aprovar
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL: Excluir requerimento */}
      <AlertDialog open={actionType === "delete"} onOpenChange={closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Requerimento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação <strong>não pode ser desfeita.</strong> O requerimento
              será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => confirmAction(actionType)}
            >
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL: Visualizar detalhes do Requerimento de Laboratório */}
      <AlertDialog
        open={!!viewSolicitation}
        onOpenChange={() => setViewSolicitation(null)}
      >
        <AlertDialogContent className="max-w-3xl w-full rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-center">
              Detalhes do Requerimento
            </AlertDialogTitle>
          </AlertDialogHeader>

          {viewSolicitation && (
            <div className="space-y-6 text-sm text-foreground">
              {/* Seção 1: Informações Gerais */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-base font-semibold mb-3 text-primary">
                  Informações Gerais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <p>
                    <strong>Token:</strong> {viewSolicitation.token}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(viewSolicitation.status)}
                  </p>
                  <p>
                    <strong>Professor:</strong>{" "}
                    {viewSolicitation.requiredBy?.nome || "—"}
                  </p>
                  <p>
                    <strong>Departamento:</strong>{" "}
                    {viewSolicitation.requiredBy?.departamento || "—"}
                  </p>
                  <p>
                    <strong>Disciplina:</strong> {viewSolicitation.disciplina}
                  </p>
                  <p>
                    <strong>Curso:</strong> {viewSolicitation.curso}
                  </p>
                  <p>
                    <strong>Tipo de Laboratório:</strong>{" "}
                    {viewSolicitation.tipoLab}
                  </p>
                  <p>
                    <strong>Unidade Acadêmica:</strong>{" "}
                    {viewSolicitation.unidadeAcademica}
                  </p>
                </div>
              </div>

              {/* Seção 2: Horário e Laboratório */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-base font-semibold mb-3 text-primary">
                  Horário e Laboratório
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(viewSolicitation.dia).toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    <strong>Horário:</strong>{" "}
                    {viewSolicitation.horarioInicio?.startTime} -{" "}
                    {viewSolicitation.horarioFinal?.endTime}
                  </p>
                  <p>
                    <strong>Laboratório Atribuído:</strong>{" "}
                    {viewSolicitation.laboratorio
                      ? `${viewSolicitation.laboratorio.nome} (${viewSolicitation.laboratorio.capacidade})`
                      : "Não atribuída"}
                  </p>
                  <p>
                    <strong>Número de Alunos:</strong>{" "}
                    {viewSolicitation.numeroAluno || "—"}
                  </p>
                  <p>
                    <strong>Número de Grupos:</strong>{" "}
                    {viewSolicitation.numeroGruposAlunos || "—"}
                  </p>
                  <p>
                    <strong>Presença Técnico:</strong>{" "}
                    {viewSolicitation.presencaTecnicoLaboratorista
                      ? "Sim"
                      : "Não"}
                  </p>
                </div>
              </div>

              {/* Seção 3: Utilitários / Equipamentos */}
              {viewSolicitation.utilitarios?.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-3 text-primary">
                    Utilitários Solicitados
                  </h3>
                  <div className="divide-y divide-muted">
                    {viewSolicitation.utilitarios.map((item, index) => (
                      <div
                        key={index}
                        className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-3"
                      >
                        <p>
                          <strong>Reagentes:</strong>{" "}
                          {item.reagentes
                            ? `${item.reagentes} (${item.quantidadeReagentes})`
                            : "—"}
                        </p>
                        <p>
                          <strong>Equipamentos/Vidraria:</strong>{" "}
                          {item.equipamentosVidraria
                            ? `${item.equipamentosVidraria} (${item.quantidadeVidraria})`
                            : "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seção 4: Observações e Rejeição */}
              {(viewSolicitation.rejectionReason ||
                viewSolicitation.observations) && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-3 text-primary">
                    Observações
                  </h3>
                  {viewSolicitation.userOfAction && (
                    <>
                      <p className="text-red-500">
                        <strong>Usuário que realizou a ação:</strong>{" "}
                        {viewSolicitation.userOfAction.name}
                      </p>
                      <p className="text-red-500">
                        <strong>Matrícula:</strong>{" "}
                        {viewSolicitation.userOfAction.registerNumber}
                      </p>
                    </>
                  )}

                  {viewSolicitation.rejectionReason && (
                    <p className="text-red-500">
                      <strong>Motivo da Rejeição:</strong>{" "}
                      {viewSolicitation.rejectionReason}
                    </p>
                  )}
                  {viewSolicitation.observations && (
                    <p>
                      <strong>Observações:</strong>{" "}
                      {viewSolicitation.observations}
                    </p>
                  )}
                </div>
              )}

              {(viewSolicitation.approvedReason ||
                viewSolicitation.observations) && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-3 text-primary">
                    Observações
                  </h3>
                  {viewSolicitation.userOfAction && (
                    <>
                      <p className="text-red-500">
                        <strong>Usuário que realizou a ação:</strong>{" "}
                        {viewSolicitation.userOfAction.name}
                      </p>
                      <p className="text-red-500">
                        <strong>Matrícula:</strong>{" "}
                        {viewSolicitation.userOfAction.registerNumber}
                      </p>
                    </>
                  )}

                  {viewSolicitation.rejectionReason && (
                    <p className="text-red-500">
                      <strong>Motivo da Aprovação:</strong>{" "}
                      {viewSolicitation.rejectionReason}
                    </p>
                  )}
                  {viewSolicitation.observations && (
                    <p>
                      <strong>Observações:</strong>{" "}
                      {viewSolicitation.observations}
                    </p>
                  )}
                </div>
              )}

              {/* Seção 5: Datas */}
              <div className="text-xs text-muted-foreground text-right">
                Criado em:{" "}
                {new Date(viewSolicitation.createdAt).toLocaleDateString(
                  "pt-BR",
                )}
              </div>
            </div>
          )}

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel
              onClick={() => setViewSolicitation(null)}
              className="w-full sm:w-auto"
            >
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
