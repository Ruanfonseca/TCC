import { DashboardData } from "@/types/dashType";
import { api } from "@/utils/api";

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
      console.error(error);
    }
  }

  async getSolicitationByToken(token: string): Promise<any> {
    try {
      const response = await api.get<any>(`${this.baseUrl}/token/${token}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export const analiseService = new AnaliseService();
export default analiseService;
