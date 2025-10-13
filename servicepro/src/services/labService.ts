import { Laboratorio } from "@/types/labType";
import { api } from "@/utils/api";

export interface LaboratorioResponse extends Laboratorio {
  createdAt: string;
  updatedAt: string;
}

class LabService {
  private baseUrl = "/solicitations/lab";
  private baseUrlLab = "/labs";

  async getLabs(): Promise<LaboratorioResponse[]> {
    return api.get<LaboratorioResponse[]>(this.baseUrl);
  }

  async getLaboratorios(): Promise<LaboratorioResponse[]> {
    try {
      const response = await api.get<LaboratorioResponse[]>(this.baseUrlLab);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async createLab(lab: Laboratorio): Promise<LaboratorioResponse> {
    return api.post<LaboratorioResponse>(this.baseUrl, lab);
  }

  async updateLab(id: string, lab: Laboratorio): Promise<LaboratorioResponse> {
    return api.put<LaboratorioResponse>(`${this.baseUrl}/${id}`, lab);
  }

  async deleteLab(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${id}`);
  }

  async darBaixaSolicitacao(id: string, data: any): Promise<any> {
    const response = await api.put<any>(`${this.baseUrl}/${id}/baixa`, data);
    return response;
  }
}

export const labService = new LabService();
export default labService;
