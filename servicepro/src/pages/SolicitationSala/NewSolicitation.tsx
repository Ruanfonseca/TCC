import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { CalendarIcon, Copy, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { scheduleService } from "@/services/scheduleService";
import { solicitationService } from "@/services/solicitationService";
import { ScheduleResponse } from "@/types/schedule";
import { newSolicitationSchema, NewSolicitationForm } from "@/schemas/schemas";
import { getMinDatePlus7Days } from "@/utils/util";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NewSolicitation() {
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenModal, setTokenModal] = useState<any | null>(null); // Token retornado
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<NewSolicitationForm>({
    resolver: zodResolver(newSolicitationSchema),
  });

  useEffect(() => {
    scheduleService
      .getSchedule()
      .then((data) => {
        setSchedules(data || []);
      })
      .catch((err) => {
        console.error("Erro ao buscar horários:", err);
        setSchedules([]);
      });
  }, []);

  const handleCreateSolicitation = async () => {
    try {
      setIsSubmitting(true);

      const data = getValues();

      const solicitation = {
        materia: data.materia,
        numberOfPeople: data.numberOfPeople,
        dia: format(new Date(data.dia), "yyyy-MM-dd"),
        blockPrefer: data.blockPrefer || "",
        typeOfRoom: data.typeOfRoom || "",
        registration: data.registration || "",
        equipament: data.equipament || [],
        observations: data.observations || "",
        status: "pending",
        scheduleInitial: {
          ...data.scheduleInitial,
          id: data.scheduleInitial.id || 0,
          name: data.scheduleInitial.name || "",
          startTime: data.scheduleInitial.startTime || "",
          endTime: data.scheduleInitial.endTime || "",
          days: data.scheduleInitial.days || [],
          semester: data.scheduleInitial.semester || "",
          status: data.scheduleInitial.status || ("active" as const),
          description: data.scheduleInitial.description || "",
          createdAt: data.scheduleInitial.createdAt || "",
          updatedAt: data.scheduleInitial.updatedAt || "",
        },
        scheduleEnd: {
          ...data.scheduleEnd,
          id: data.scheduleEnd.id || 0,
          name: data.scheduleEnd.name || "",
          startTime: data.scheduleEnd.startTime || "",
          endTime: data.scheduleEnd.endTime || "",
          days: data.scheduleEnd.days || [],
          semester: data.scheduleEnd.semester || "",
          status: data.scheduleEnd.status || ("active" as const),
          description: data.scheduleEnd.description || "",
          createdAt: data.scheduleEnd.createdAt || "",
          updatedAt: data.scheduleEnd.updatedAt || "",
        },
      };

      const token = await solicitationService.createSolicitation(solicitation);
      if (token) {
        setTokenModal(token); // Abre o modal com o token
      } else {
        alert("Solicitação enviada, mas nenhum token foi retornado.");
      }
    } catch (err) {
      console.error("❌ Erro ao enviar solicitação:", err);
      alert("Erro ao enviar solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (tokenModal) {
      await navigator.clipboard.writeText(tokenModal);
      setCopied(true);
      resetForm();
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const resetForm = () => {
    reset({
      materia: "",
      registration: "",
      numberOfPeople: "",
      dia: "",
      blockPrefer: "",
      typeOfRoom: "",
      equipament: [],
      observations: "",
      scheduleInitial: null,
      scheduleEnd: null,
    });
  };

  const selectedEquipament = watch("equipament") || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4">
      {/* Cabeçalho */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Nova Solicitação</h1>
        <p className="text-base text-muted-foreground">
          Solicite uma sala para suas atividades acadêmicas
        </p>
      </div>

      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5" /> Formulário de Solicitação
          </CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para fazer sua solicitação.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            {/* Seção: Disciplina e Número de Alunos */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="materia">Disciplina *</Label>
                <Input
                  id="materia"
                  {...register("materia")}
                  placeholder="Nome da disciplina"
                />
                {errors.materia && (
                  <span className="text-red-500 text-sm">
                    {errors.materia.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration">Matrícula do Solicitante *</Label>
                <Input
                  id="registration"
                  {...register("registration")}
                  placeholder="Matrícula do solicitante"
                />
                {errors.registration && (
                  <span className="text-red-500 text-sm">
                    {errors.registration.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfPeople">Número de Alunos *</Label>
                <Input
                  id="numberOfPeople"
                  type="text"
                  {...register("numberOfPeople")}
                  placeholder="Ex: 30"
                />
                {errors.numberOfPeople && (
                  <span className="text-red-500 text-sm">
                    {errors.numberOfPeople.message}
                  </span>
                )}
              </div>
            </div>

            {/* Seção: Data e Horário */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Data *</Label>
                <Controller
                  control={control}
                  name="dia"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(
                                new Date(field.value + "T00:00:00"),
                                "PPP",
                                {
                                  locale: ptBR,
                                }
                              )
                            : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? new Date(field.value + "T00:00:00")
                              : undefined
                          }
                          onSelect={(d) => {
                            if (!d) return field.onChange("");
                            // Converte para yyyy-MM-dd SEM timezone
                            const formatted = format(d, "yyyy-MM-dd");
                            field.onChange(formatted);
                          }}
                          disabled={(d) => d < getMinDatePlus7Days()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />

                {errors.dia && (
                  <span className="text-red-500 text-sm">
                    {errors.dia.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label>Horário Inicial *</Label>
                <Controller
                  control={control}
                  name="scheduleInitial"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) =>
                        field.onChange(
                          schedules.find((s) => s.name === value) || null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(schedules) &&
                          schedules
                            .filter((s) => s.status === "active")
                            .map((s) => (
                              <SelectItem key={s.id} value={s.name}>
                                {s.name} ({s.startTime} - {s.endTime})
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Horário Final *</Label>
                <Controller
                  control={control}
                  name="scheduleEnd"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) =>
                        field.onChange(
                          schedules.find((s) => s.name === value) || null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {schedules
                          .filter((s) => s.status === "active")
                          .map((s) => (
                            <SelectItem key={s.id} value={s.name}>
                              {s.name} ({s.startTime} - {s.endTime})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Seção: Equipamentos */}
            <div className="space-y-3">
              <Label>Equipamentos Necessários</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Projetor",
                  "Computador",
                  "Sistema de Som",
                  "Quadro Interativo",
                ].map((eq) => (
                  <label key={eq} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedEquipament.includes(eq)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue("equipament", [...selectedEquipament, eq]);
                        } else {
                          setValue(
                            "equipament",
                            selectedEquipament.filter((item) => item !== eq)
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{eq}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                onClick={handleCreateSolicitation}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full sm:flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de Token */}
      <Dialog open={!!tokenModal} onOpenChange={() => setTokenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitação Enviada com Sucesso!</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Guarde este token para acompanhar sua solicitação:
            </p>

            <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
              <span className="font-mono text-sm break-all">{tokenModal}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                title="Copiar Token"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {copied && (
              <p className="text-green-600 text-sm text-center font-medium">
                Copiado!
              </p>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setTokenModal(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
