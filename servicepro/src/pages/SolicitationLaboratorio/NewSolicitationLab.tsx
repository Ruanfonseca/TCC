import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requerimentoLabSchema } from "@/schemas/labSchema";

import { Plus, Send, Trash, ArrowLeft, ArrowRight } from "lucide-react";
import { ScheduleResponse } from "@/types/schedule";
import { scheduleService } from "@/services/scheduleService";
import { RequerimentoLab } from "@/types/labType";
import { labService, LaboratorioResponse } from "@/services/labService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getDateLimits } from "@/utils/util";
import { solicitationLabService } from "@/services/SolicitationLabService";

export default function NewSolicitationLab() {
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const { minDate } = getDateLimits();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<RequerimentoLab>({
    resolver: zodResolver(requerimentoLabSchema),
    mode: "onChange",
    defaultValues: {
      tipoLab: 0,
      utilitarios: [
        {
          reagentes: "",
          quantidadeReagentes: "",
          equipamentosVidraria: "",
          quantidadeVidraria: "",
        },
      ],
      horarioInicio: {
        id: "",
        name: "",
        status: "active",
        description: "",
        startTime: "",
        endTime: "",
        days: [],
        semester: "",
        createdAt: "",
        updatedAt: "",
      },
      horarioFinal: {
        id: "",
        name: "",
        status: "active",
        description: "",
        startTime: "",
        endTime: "",
        days: [],
        semester: "",
        createdAt: "",
        updatedAt: "",
      },
    },
  });

  // Field Array para utilitários
  const { fields, append, remove } = useFieldArray({
    control,
    name: "utilitarios",
  });

  const presencaTecnicoLaboratorista = watch("presencaTecnicoLaboratorista");

  useEffect(() => {
    scheduleService.getSchedule().then(setSchedules);
  }, []);

  const onSubmit = async (data: RequerimentoLab) => {
    try {
      const response = await solicitationLabService.createLabSolicitation(data);

      if (response.status === 201) {
        alert(response.data || "✅ Solicitação criada com sucesso!");
        reset();
        setCurrentStep(1);
      }
    } catch (error: any) {
      console.error("❌ Erro ao enviar solicitação:", error);

      const backendMessage =
        error.response?.data || error.message || "Erro desconhecido";

      alert(`❌ Falha ao enviar solicitação: ${backendMessage}`);
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4">
      {/* Cabeçalho */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Nova Solicitação</h1>
        <p className="text-base text-muted-foreground">
          Solicite um laboratório para suas atividades acadêmicas
        </p>
      </div>

      {/* Card principal */}
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5" /> Formulário de Solicitação
          </CardTitle>
          <CardDescription>
            O agendamento dos laboratórios didáticos poderá ser suspenso quando
            houver falta de condições mínimas para execução de aulas
            experimentais, tais como: falta de água, energia elétrica e mau
            funcionamento dos aparelhos de ar condicionado. Um novo agendamento
            deverá ser feito após a normalização.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Indicador de etapas */}
          <div className="flex items-center justify-center mb-6 gap-4">
            <div
              className={`flex items-center gap-2 ${
                currentStep === 1
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                1
              </div>
              <span>Formulário</span>
            </div>
            <div className="h-0.5 w-12 bg-border" />
            <div
              className={`flex items-center gap-2 ${
                currentStep === 2
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                2
              </div>
              <span>Termos</span>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* -------- Docente -------- */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Dados do Docente</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Nome *</Label>
                      <Input {...register("nomeDocente")} />
                      {errors.nomeDocente && (
                        <p className="text-red-500 text-sm">
                          {errors.nomeDocente.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input type="email" {...register("emailDocente")} />
                    </div>
                    <div>
                      <Label>Matrícula *</Label>
                      <Input {...register("matriculaDocente")} />
                    </div>
                    <div>
                      <Label>Disciplina *</Label>
                      <Input {...register("disciplina")} />
                    </div>
                    <div>
                      <Label>Curso *</Label>
                      <Input {...register("curso")} />
                    </div>
                    <div>
                      <Label>Unidade Acadêmica *</Label>
                      <Input {...register("unidadeAcademica")} />
                    </div>
                  </div>
                </div>

                {/* -------- Aula -------- */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Informações da Aula</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Título da Aula *</Label>
                      <Input {...register("tituloAula")} />
                    </div>
                    <div>
                      <Label>Dia *</Label>
                      <Input type="date" {...register("dia")} min={minDate} />
                      {errors.dia && (
                        <p className="text-red-500 text-sm">
                          {errors.dia.message}
                        </p>
                      )}
                    </div>

                    {/* Horário Inicial */}
                    <div className="space-y-2">
                      <Label>Horário Inicial *</Label>
                      <Controller
                        control={control}
                        name="horarioInicio"
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

                    {/* Horário Final */}
                    <div className="space-y-2">
                      <Label>Horário Final *</Label>
                      <Controller
                        control={control}
                        name="horarioFinal"
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

                  <div>
                    <Label>Nº de Alunos *</Label>
                    <Input type="text" {...register("numeroAluno")} />
                  </div>
                  <div>
                    <Label>Nº de Grupos *</Label>
                    <Input type="text" {...register("numeroGruposAlunos")} />
                  </div>
                </div>

                {/* Tipo do Laboratório */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Tipo do Laboratório</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="DIDATICO"
                        {...register("tipoLab")}
                      />
                      Didático
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="DIDATICO_PESQUISA"
                        {...register("tipoLab")}
                      />
                      Didático e Pesquisa
                    </label>
                  </div>
                  {errors.tipoLab && (
                    <p className="text-red-500 text-sm">
                      {errors.tipoLab.message}
                    </p>
                  )}
                </div>

                {/* -------- Presença Técnico/Laboratorista -------- */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Técnico/Laboratorista</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("presencaTecnicoLaboratorista")}
                      id="presencaTecnicoLaboratorista"
                    />
                    <Label htmlFor="presencaTecnicoLaboratorista">
                      Presença de técnico ou laboratorista
                    </Label>
                  </div>

                  {presencaTecnicoLaboratorista && (
                    <div className="mt-2">
                      <Label>Nome do técnico ou laboratorista *</Label>
                      <Input {...register("nomeTecnicoLaboratorista")} />
                    </div>
                  )}
                </div>

                {/* -------- Utilitários -------- */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Utilitários</h3>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid gap-4 sm:grid-cols-2 border p-3 rounded relative"
                    >
                      <div>
                        <Label>Reagentes</Label>
                        <Input
                          {...register(`utilitarios.${index}.reagentes`)}
                        />
                      </div>
                      <div>
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          {...register(
                            `utilitarios.${index}.quantidadeReagentes`
                          )}
                        />
                      </div>
                      <div>
                        <Label>Vidraria</Label>
                        <Input
                          {...register(
                            `utilitarios.${index}.equipamentosVidraria`
                          )}
                        />
                      </div>
                      <div>
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          {...register(
                            `utilitarios.${index}.quantidadeVidraria`
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        reagentes: "",
                        quantidadeReagentes: "",
                        equipamentosVidraria: "",
                        quantidadeVidraria: "",
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Utilitário
                  </Button>
                </div>

                {/* -------- Actions Etapa 1 -------- */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" className="flex-1" onClick={handleNext}>
                    Próxima Etapa <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => reset()}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* -------- Etapa 2: Termos -------- */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Termos de Uso */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    Observações – Normas de Uso do Laboratório Didático
                  </h3>

                  {/* Campo oculto apenas para manter a submissão ativa */}
                  <input
                    type="hidden"
                    {...register("confirmacaoLeitura")}
                    value="true"
                  />

                  <div className="border rounded-lg p-4 bg-muted/30 space-y-3 max-h-96 overflow-y-auto text-sm leading-relaxed">
                    <p>
                      <strong>OBSERVAÇÕES:</strong> O responsável pelo uso do
                      laboratório didático deverá orientar os usuários sobre as
                      normas de segurança e utilização dos EPIs.
                    </p>

                    <p>
                      <strong>1)</strong> Este formulário deve ser enviado para
                      o e-mail
                      <strong> marcacaodeaulas@uezo.edu.br</strong> assinado
                      pelo docente responsável pela aula prática{" "}
                      <strong>10 (dez) dias antes</strong> da aula agendada.
                      Também é permitido entregar todos os formulários no início
                      do período letivo para melhor planejamento das aulas
                      (preferencialmente, desde que seja um formulário por
                      aula);
                    </p>

                    <p>
                      <strong>2)</strong> A <strong>Logística de turno</strong>{" "}
                      deve acusar o recebimento e encaminhar por e-mail o
                      formulário e o roteiro de aula para o(s) técnico(s)
                      alocado(s) em cada laboratório didático;
                    </p>

                    <p>
                      <strong>3)</strong> O <strong>técnico responsável</strong>{" "}
                      pelo laboratório se responsabiliza em receber o e-mail e
                      verificar a disponibilidade de reagentes, insumos e o
                      funcionamento dos equipamentos. Caso haja algum problema
                      que impeça a aula prática, o docente deve ser avisado com
                      antecedência de <strong>05 (cinco) dias antes</strong> da
                      aula agendada, para que o planejamento seja refeito. Neste
                      caso, o técnico deve solicitar à Logística que informe ao
                      docente.
                    </p>

                    <p>
                      <strong>4)</strong> O técnico responsável pelo laboratório
                      deve preparar a aula de forma que, no horário de início da
                      aula agendada, todas as bancadas estejam devidamente
                      preparadas para receber os discentes.
                    </p>

                    <p>
                      <strong>5)</strong> O docente que não puder ministrar a
                      aula devido a algum imprevisto deverá comunicar à{" "}
                      <strong>Logística</strong> no prazo de{" "}
                      <strong>24h</strong> anterior à aula agendada. A Logística
                      fica responsável em encaminhar a informação ao técnico
                      responsável.
                    </p>
                  </div>
                </div>

                {/* -------- Ações Etapa 2 -------- */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={!isValid}>
                    Enviar Solicitação
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
