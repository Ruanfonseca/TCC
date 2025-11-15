import { Schedule } from "./schedule";

export enum TipoLab {
  DIDATICO,
  DIDATICO_PESQUISA,
}

export interface Laboratorio {
  id?: string;
  nome: string;
  bloco: string;
  capacidade: string;
  equipamento: string[];
  status: "active" | "maintenance" | "inactive";
  andar: string;
  descricao: string;
  tipoLab: TipoLab;
}

export interface Utilitarios {
  reagentes: string;
  quantidadeReagentes: string;
  equipamentosVidraria: string;
  quantidadeVidraria: string;
}

export interface RequerimentoLab {
  nomeDocente: string;
  emailDocente: string;
  matriculaDocente: string;
  disciplina: string;
  curso: string;
  unidadeAcademica: string;
  tituloAula: string;
  dia: string;
  presencaTecnicoLaboratorista: boolean;
  token: string;
  numeroGruposAlunos: string;
  horarioInicio: Schedule;
  horarioFinal: Schedule;
  tipoLab: TipoLab;
  nomeTecnicoLaboratorista: string;
  numeroAluno: string;
  confirmacaoLeitura: string;
  utilitarios: Utilitarios[];
}

export interface RequerimentoResponseLab {
  id?: number | string;
  status?: "pending" | "approved" | "rejected";
  nomeDocente: string;
  emailDocente: string;
  matriculaDocente: string;
  disciplina: string;
  curso: string;
  unidadeAcademica: string;
  tituloAula: string;
  dia: string;
  presencaTecnicoLaboratorista: boolean;
  token?: string | null;
  numeroGruposAlunos: string;
  horarioInicio: Schedule;
  horarioFinal: Schedule;
  tipoLab: TipoLab;
  nomeTecnicoLaboratorista: string;
  numeroAluno: string;
  confirmacaoLeitura: string;
  utilitarios: Utilitarios[];
}
