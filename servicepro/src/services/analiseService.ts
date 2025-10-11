import { DashboardData } from "@/types/dashType";
import { api } from "@/utils/api";

const MOCK_DASHBOARD: DashboardData = {
  qtdPending: 3,
  qtdRejected: 2,
  qtdCancelled: 1,
  qtdTotal: 10,
  qtdApproved: 4,
};

const MOCK_SOLICITATION_BY_TOKEN = {
  tipo: "laboratorio",
  dados: {
    token: "LAB-2025-0345",
    nomeDocente: "Profa. Maria Souza",
    disciplina: "Química Experimental",
    curso: "Engenharia Química",
    tipoLab: "Química Geral",
    dia: "2025-10-09",
    laboratorio: "Laboratorio teste",
    horarioInicio: { startTime: "08:00" },
    horarioFinal: { endTime: "10:00" },
    utilitarios: [
      {
        reagentes: "Ácido clorídrico, hidróxido de sódio",
        quantidadeReagentes: "2",
        equipamentosVidraria: "Béquer, pipeta, bureta",
        quantidadeVidraria: "3",
      },
    ],
    status: "approved",
    createdAt: "2025-10-08T10:15:00",
  },
};

class AnaliseService {
  private baseUrl = "/analise";

  private handleError<T>(error: any, context: string, fallback: T): T {
    console.warn(
      `[AnaliseService] Falha em ${context}. Usando dados mockados.`,
      error
    );
    return fallback;
  }

  async getData(): Promise<DashboardData> {
    try {
      return await api.get<DashboardData>(this.baseUrl);
    } catch (error) {
      return this.handleError(error, "getData", MOCK_DASHBOARD);
    }
  }

  async getSolicitationByToken(token: string): Promise<any> {
    try {
      const response = await api.get<any>(`${this.baseUrl}/token/${token}`);
      return response;
    } catch (error) {
      return this.handleError(
        error,
        `getSolicitationByToken(${token})`,
        MOCK_SOLICITATION_BY_TOKEN
      );
    }
  }
}

export const analiseService = new AnaliseService();
export default analiseService;
