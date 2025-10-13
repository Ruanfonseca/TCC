// services/solicitationService.ts
import { NewSolicitation, SolicitationResponse } from "@/types/solutionType";
import { api } from "@/utils/api";

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
      console.error(error);
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
