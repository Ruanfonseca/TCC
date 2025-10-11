import { RequerimentoLab } from "./labType";
import { SolicitationResponse } from "./solutionType";

export interface Report {
  startDate?: Date; // formato ISO (ex: "2025-10-08")
  endDate?: Date;
  reportType?: string; // exemplo: "mensal", "anual", etc.
  requerimentsType: string; // "sala" | "laboratorio" | "todos"
  requerimentos?: SolicitationResponse[];
  requerimentoLaboratorios?: RequerimentoLab[];
}
