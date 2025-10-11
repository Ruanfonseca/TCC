// services/solicitationService.ts
import { RequerimentoLab } from "@/types/labType";
import { NewSolicitation, SolicitationResponse } from "@/types/solutionType";
import { api } from "@/utils/api";

// 🔹 Mock de solicitações de laboratório
const mockSolicitations: SolicitationResponse[] = [
  {
    id: 17,
    nomeDocente: "Denis ",
    matriculaDocente: "2019233070",
    emailDocente: "Teste@gmail.com",
    disciplina: "teste lab",
    curso: "teste lab",
    tipoLab: "DIDATICO_PESQUISA",
    unidadeAcademica: "FCBS",
    tituloAula: "teste lab",
    dia: "2025-10-23",
    presencaTecnicoLaboratorista: true,
    token: "LAB-2025-8702",
    numeroGruposAlunos: "1",
    nomeTecnicoLaboratorista: "Testando fonseca",
    confirmacaoLeitura: "true",
    horarioInicio: {
      id: 1,
      name: "M1",
      startTime: "08:00",
      endTime: "08:50",
      days: ["Segunda", "Quarta", "Sexta", "Terça", "Quinta"],
      semester: "2025.2",
      status: "active",
      description: "",
      createdAt: "2025-10-07",
      updatedAt: null,
    },
    horarioFinal: {
      id: 3,
      name: "M2",
      startTime: "08:50",
      endTime: "09:40",
      days: ["Segunda", "Quarta", "Sexta", "Terça", "Quinta"],
      semester: "2025.2",
      status: "inactive",
      description: "",
      createdAt: "2025-10-08",
      updatedAt: null,
    },
    laboratorio: null,
    requiredBy: {
      id: 1,
      nome: "Denis Cople",
      matricula: "2019233070",
      email: "whitelook22@outlook.com",
      phone: "21991203947",
      departamento: "FCEE",
      status: "active",
      especialidade: "Computação",
      totalRequests: null,
      approvedRequests: null,
      senha: null,
      createdAt: "2025-10-06",
      updatedAt: "2025-10-06",
    },
    userOfAction: null,
    numeroAluno: "4",
    utilitarios: [
      {
        reagentes: "",
        quantidadeReagentes: "",
        equipamentosVidraria: "",
        quantidadeVidraria: "",
      },
    ],
    approvedReason: "",
    status: "rejected",
    observations: null,
    approvedBy: null,
    rejectedBy: "201923307011",
    rejectionReason: "Não foi possivel reservar , evento na faculdade.",
    createdAt: "2025-10-09",
    updatedAt: "2025-10-09",
  },
  {
    id: 18,
    nomeDocente: "Denis",
    matriculaDocente: "2019233070",
    emailDocente: "Teste@gmail.com",
    disciplina: "teste lab",
    curso: "teste lab",
    tipoLab: "DIDATICO_PESQUISA",
    unidadeAcademica: "FCBS",
    tituloAula: "teste lab",
    dia: "2025-10-21",
    presencaTecnicoLaboratorista: true,
    token: "LAB-2025-6347",
    numeroGruposAlunos: "1",
    nomeTecnicoLaboratorista: "adadasdasadasd",
    confirmacaoLeitura: "true",
    horarioInicio: {
      id: 1,
      name: "M1",
      startTime: "08:00",
      endTime: "08:50",
      days: ["Segunda", "Quarta", "Sexta", "Terça", "Quinta"],
      semester: "2025.2",
      status: "active",
      description: "",
      createdAt: "2025-10-07",
      updatedAt: null,
    },
    horarioFinal: {
      id: 3,
      name: "M2",
      startTime: "08:50",
      endTime: "09:40",
      days: ["Segunda", "Quarta", "Sexta", "Terça", "Quinta"],
      semester: "2025.2",
      status: "inactive",
      description: "",
      createdAt: "2025-10-08",
      updatedAt: null,
    },
    laboratorio: null,
    requiredBy: {
      id: 1,
      nome: "Denis Cople",
      matricula: "2019233070",
      email: "whitelook22@outlook.com",
      phone: "21991203947",
      departamento: "FCEE",
      status: "active",
      especialidade: "Computação",
      totalRequests: null,
      approvedRequests: null,
      senha: null,
      createdAt: "2025-10-06",
      updatedAt: "2025-10-06",
    },
    userOfAction: {
      id: 17,
      name: "RUAN SOARES DA SILVA FONSECA",
      email: "whitelook22@outlook.com",
      password: "$2a$10$sp.NkeFFNxTM6wzYoxb1U.DSakvUYVLeH5Qaoa8zY/WxuJ2UOxWHi",
      department: null,
      registerNumber: "201923307011",
      role: "LOGISTICA",
      status: "active",
      phone: "(21) 99120-3947",
      updatedAt: "2025-10-07",
      createdAt: "2025-10-07",
    },
    numeroAluno: "5",
    utilitarios: [
      {
        reagentes: "",
        quantidadeReagentes: "",
        equipamentosVidraria: "",
        quantidadeVidraria: "",
      },
    ],
    approvedReason: "",
    status: "rejected",
    observations: null,
    approvedBy: null,
    rejectedBy: "201923307011",
    rejectionReason: "rejeitei mesmo",
    createdAt: "2025-10-09",
    updatedAt: "2025-10-09",
  },
];

class SolicitationLabService {
  private baseUrl = "/solicitations/lab";

  async createLabSolicitation(data: RequerimentoLab): Promise<any> {
    return api.post<any>(this.baseUrl, data, undefined, true);
  }

  async getLabSolicitations(filters?: {
    status?: string;
    professorId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any[]> {
    try {
      const response = await api.get<any[]>(this.baseUrl, { params: filters });
      return response;
    } catch (error) {
      console.warn(
        "⚠️ Falha ao acessar backend, retornando mock de solicitações."
      );
      return mockSolicitations;
    }
  }

  async getLabSolicitationByToken(
    token: string
  ): Promise<SolicitationResponse> {
    try {
      const response = await api.get<SolicitationResponse>(
        `${this.baseUrl}/token/${token}`
      );
      return response;
    } catch (error) {
      console.warn(
        "⚠️ Falha ao acessar backend, retornando mock de solicitação por token."
      );
      const found = mockSolicitations.find((s) => s.token === token);
      if (!found) throw new Error("Token não encontrado no mock");
      return found;
    }
  }

  async updateLabSolicitationStatus(
    id: string,
    status: "approved" | "rejected",
    reason?: string,
    approvedBy?: string
  ): Promise<SolicitationResponse> {
    return api.put<SolicitationResponse>(`${this.baseUrl}/${id}/status`, {
      status,
      reason,
      approvedBy,
    });
  }

  async deleteLabSolicitation(id: string, reason: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`, { data: { reason } });
  }

  async getLabAll(): Promise<SolicitationResponse[]> {
    try {
      const response = await api.get<SolicitationResponse[]>(this.baseUrl);
      return response;
    } catch (error) {
      console.warn(
        "⚠️ Falha ao acessar backend, retornando mock de todas as solicitações."
      );
      return mockSolicitations;
    }
  }

  async deleteLabById(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async darBaixaSolicitacaoLab(
    id: string,
    reason: string,
    user?: string
  ): Promise<SolicitationResponse> {
    return api.put<SolicitationResponse>(`${this.baseUrl}/${id}/dar-baixa`, {
      reason,
      user,
    });
  }
}

export const solicitationLabService = new SolicitationLabService();
