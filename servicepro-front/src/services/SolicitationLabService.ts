// services/solicitationService.ts
import { RequerimentoLab } from "@/types/labType";
import { NewSolicitation, SolicitationResponse } from "@/types/solutionType";
import { api } from "@/utils/api";

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
      console.error(error);
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
      console.error(error);
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
      console.error(error);
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
