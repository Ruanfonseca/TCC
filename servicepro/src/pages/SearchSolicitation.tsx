import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import analiseService from "@/services/analiseService";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "approved":
      return "bg-green-100 text-green-700 border-green-300";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendente";
    case "approved":
      return "Aprovado";
    case "rejected":
      return "Rejeitado";
    default:
      return "Desconhecido";
  }
};

export default function SearchSolicitation() {
  const [token, setToken] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!token.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite o token da solicitação",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setNotFound(false);
    setSearchResult(null);

    const result = await analiseService.getSolicitationByToken(token);
    console.log(result);
    if (result) {
      setSearchResult(result);
    } else {
      setNotFound(true);
    }

    setIsSearching(false);
  };

  const copyToken = () => {
    const tokenValue = searchResult?.dados?.token || "";
    if (tokenValue) {
      navigator.clipboard.writeText(tokenValue);
      toast({
        title: "Copiado!",
        description: "Token copiado para a área de transferência",
      });
    }
  };

  const renderSala = (dados: any) => {
    const room = dados.room;

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Disciplina</p>
            <p className="font-medium">{dados.materia || "—"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Número de Pessoas</p>
            <p className="font-medium">{dados.numberOfPeople || "—"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Data</p>
            <p className="font-medium">{dados.dia || "—"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Horário</p>
            <p className="font-medium">
              {dados.scheduleInitial?.startTime && dados.scheduleEnd?.endTime
                ? `${dados.scheduleInitial.startTime} - ${dados.scheduleEnd.endTime}`
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Sala Atribuída</p>
            {room ? (
              <p className="font-medium">
                {room.name} - Capacidade {room.capacity} pessoas
              </p>
            ) : dados.status === "rejected" ? (
              <p className="font-medium text-red-600">
                Requerimento rejeitado — sem sala atribuída
              </p>
            ) : (
              <p className="font-medium text-muted-foreground">
                Sala ainda não atribuída
              </p>
            )}
          </div>

          {dados.equipament?.length > 0 && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Equipamentos</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {dados.equipament.map((eq: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {eq}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exibe motivo da rejeição se existir */}
        {dados.status === "rejected" && (
          <div className="border border-red-200 bg-red-50 rounded-md p-3 mt-4">
            <p className="font-semibold text-red-700">Motivo da Rejeição</p>
            <p className="text-sm text-red-600 mt-1">
              {dados.rejectionReason || "Não especificado"}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderLaboratorio = (dados: any) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Docente</p>
          <p className="font-medium">{dados.nomeDocente}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Disciplina</p>
          <p className="font-medium">{dados.disciplina}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Curso</p>
          <p className="font-medium">{dados.curso}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Tipo de Laboratório</p>
          <p className="font-medium">{dados.tipoLab}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Laboratório Reservado</p>
          <p className="font-medium">{dados.laboratorio}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Data</p>
          <p className="font-medium">{dados.dia}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Horário</p>
          <p className="font-medium">
            {dados.horarioInicio?.startTime} - {dados.horarioFinal?.endTime}
          </p>
        </div>
      </div>

      {dados.utilitarios?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Utilitários
          </p>
          <div className="mt-2 border rounded-md p-3 bg-muted/30">
            {dados.utilitarios.map((u: any, index: number) => (
              <div key={index} className="text-sm space-y-1">
                <div>Reagentes: {u.reagentes || "—"}</div>
                <div>Qtd Reagentes: {u.quantidadeReagentes || "—"}</div>
                <div>Equipamentos/Vidros: {u.equipamentosVidraria || "—"}</div>
                <div>Qtd Vidraria: {u.quantidadeVidraria || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exibe motivo da rejeição se existir */}
      {dados.status === "rejected" && (
        <div className="border border-red-200 bg-red-50 rounded-md p-3 mt-4">
          <p className="font-semibold text-red-700">Motivo da Rejeição</p>
          <p className="text-sm text-red-600 mt-1">
            {dados.rejectionReason || "Não especificado"}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Pesquisar Requerimento
        </h1>
        <p className="text-muted-foreground">
          Digite o token do seu requerimento para verificar o status
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar por Token
          </CardTitle>
          <CardDescription>
            O token é gerado automaticamente quando você faz um requerimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ex: LAB-2025-0345"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="font-mono"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-primary hover:bg-primary/90"
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {notFound && (
        <Card className="border-destructive/20">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive font-medium">
              Requerimento não encontrado
            </div>
            <p className="text-sm text-muted-foreground">
              Verifique se o token está correto ou entre em contato com o
              suporte
            </p>
          </CardContent>
        </Card>
      )}

      {searchResult && (
        <Card className="border-success/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Detalhes do Requerimento ({searchResult.tipo?.toUpperCase()})
              </CardTitle>
              <Badge
                variant="outline"
                className={getStatusColor(searchResult.dados?.status)}
              >
                {getStatusText(searchResult.dados?.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Token</p>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                    {searchResult.dados?.token}
                  </code>
                  <Button variant="ghost" size="icon" onClick={copyToken}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Render dinâmico */}
            {searchResult.tipo === "sala"
              ? renderSala(searchResult.dados)
              : renderLaboratorio(searchResult.dados)}

            <div className="text-xs text-muted-foreground">
              Criado em: {searchResult.dados?.createdAt}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
