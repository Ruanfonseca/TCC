import { z } from "zod";
import { scheduleSchema } from "./schemas";

// Enum para Zod
export enum TipoLab {
  DIDATICO = "DIDATICO",
  DIDATICO_PESQUISA = "DIDATICO_PESQUISA",
}

// Laboratório
export const laboratorioSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  bloco: z.string().min(1, "Bloco é obrigatório"),
  capacidade: z.string().min(1, "Capacidade é obrigatória"),
  equipamento: z.array(z.string()).default([]),
  status: z.string().min(1, "Status é obrigatório"),
  andar: z.string().min(1, "Andar é obrigatório"),
  descricao: z.string().optional(),
  tipoLab: z.nativeEnum(TipoLab),
});

// Utilitários
export const utilitariosSchema = z.object({
  reagentes: z.string().optional(),
  quantidadeReagentes: z.string().optional(),
  equipamentosVidraria: z.string().optional(),
  quantidadeVidraria: z.string().optional(),
});

// Requerimento do Lab
export const requerimentoLabSchema = z.object({
  nomeDocente: z.string().min(3, "Nome do docente é obrigatório"),
  emailDocente: z.string().email("E-mail inválido"),
  matriculaDocente: z.string().min(1, "Matrícula é obrigatória"),
  disciplina: z.string().min(1, "Disciplina é obrigatória"),
  curso: z.string().min(1, "Curso é obrigatório"),
  unidadeAcademica: z.string().min(1, "Unidade acadêmica é obrigatória"),
  tituloAula: z.string().min(1, "Título da aula é obrigatório"),
  dia: z.string().min(1, "Dia é obrigatório"),
  presencaTecnicoLaboratorista: z.boolean().optional(),
  nomeTecnicoLaboratorista: z.string().optional(),
  token: z.string().optional(),
  numeroGruposAlunos: z.string().optional(),
  horarioInicio: scheduleSchema,
  horarioFinal: scheduleSchema,
  tipoLab: z.nativeEnum(TipoLab),
  confirmacaoLeitura: z.string(),
  numeroAluno: z.string().min(1, "Número de alunos é obrigatório"),
  utilitarios: z
    .array(utilitariosSchema)
    .min(1, "Pelo menos um utilitário é obrigatório"),
});

// Tipos derivados do schema
export type Laboratorio = z.infer<typeof laboratorioSchema>;
export type Utilitarios = z.infer<typeof utilitariosSchema>;
export type RequerimentoLab = z.infer<typeof requerimentoLabSchema>;
