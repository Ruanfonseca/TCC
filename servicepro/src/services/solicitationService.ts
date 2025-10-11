// services/solicitationService.ts
import { NewSolicitation, SolicitationResponse } from "@/types/solutionType";
import { api } from "@/utils/api";

// 🔹 Mock de solicitações de salas
const mockSolicitations: SolicitationResponse[] = [
  {
    id: "4",
    room: null,
    scheduleInitial: {
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
    scheduleEnd: {
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
    materia: "Calculo 2",
    numberOfPeople: "40",
    dia: "2025-10-14",
    requiredBy: null,
    token: "SAL-2025-7683",
    blockPrefer: "",
    typeOfRoom: "",
    registration: "2019233070",
    rejectedBy: null,
    approvedReason: null,
    equipament: ["Computador", "Projetor"],
    userOfAction: null,
    observations: "",
    status: "approved",
    approvedBy: "201923307011",
    rejectionReason: null,
    createdAt: "2025-10-07",
    updatedAt: "2025-10-08",
  },
  {
    id: "5",
    room: null,
    scheduleInitial: {
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
    scheduleEnd: {
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
    materia: "Calculo 2",
    numberOfPeople: "40",
    dia: "2025-10-14",
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
    token: "SAL-2025-3755",
    blockPrefer: "",
    typeOfRoom: "",
    registration: "2019233070",
    rejectedBy: null,
    approvedReason: null,
    equipament: ["Projetor", "Sistema de Som"],
    userOfAction: null,
    observations: "",
    status: "approved",
    approvedBy: "201923307011",
    rejectionReason: null,
    createdAt: "2025-10-07",
    updatedAt: "2025-10-08",
  },
  // ... outros registros podem ser adicionados aqui seguindo o mesmo padrão
];

class SolicitationService {
  private baseUrl = "/solicitations";

  async createSolicitation(
    data: NewSolicitation
  ): Promise<SolicitationResponse> {
    const response = await api.post<SolicitationResponse>(this.baseUrl, data);
    return response;
  }

  async getSolicitations(filters?: {
    status?: string;
    professorId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<SolicitationResponse[]> {
    try {
      const response = await api.get<SolicitationResponse[]>(this.baseUrl, {
        params: filters,
      });
      return response;
    } catch (error) {
      console.warn(
        "⚠️ Falha ao acessar backend, retornando mock de solicitações."
      );
      return mockSolicitations;
    }
  }

  async updateSolicitationStatus(
    id: string,
    status: "approved" | "rejected",
    reason?: string,
    approvedBy?: string
  ): Promise<SolicitationResponse> {
    const response = await api.put<SolicitationResponse>(
      `${this.baseUrl}/${id}/status`,
      {
        status,
        reason,
        approvedBy,
      }
    );
    return response;
  }

  async deleteSolicitation(id: string, reason: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`, {
      data: { reason },
    });
  }

  async getAll(): Promise<SolicitationResponse[]> {
    return this.getSolicitations();
  }

  async deleteById(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async darBaixaSolicitacao(
    id: string,
    data: any
  ): Promise<SolicitationResponse> {
    const response = await api.put<SolicitationResponse>(
      `${this.baseUrl}/${id}/baixa`,
      data
    );
    return response;
  }
}

export const solicitationService = new SolicitationService();
