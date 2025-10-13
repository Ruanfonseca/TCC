// services/agendaService.ts
import { api } from "@/utils/api";

export interface AgendaItem {
  id: string;
  type: "sala" | "laboratorio";
  date: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  professorName: string;
  subject: string;
  numberOfStudents: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  location?: string;
  observations?: string;
  token: string;
}

export interface AgendaDTO {
  dataSolicitada: string; // formato 'YYYY-MM-DD'
}

class AgendaService {
  private readonly AGENDA_ENDPOINT = "/analise/agenda";

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async getAll(date: Date): Promise<AgendaItem[]> {
    const dto: AgendaDTO = { dataSolicitada: this.formatDate(date) };
    try {
      return await api.post<AgendaItem[]>(this.AGENDA_ENDPOINT, dto);
    } catch (error) {
      console.error(error);
    }
  }

  async getByDate(date: string): Promise<AgendaItem[]> {
    const dto: AgendaDTO = { dataSolicitada: new Date(date).toISOString() };
    try {
      return await api.post<AgendaItem[]>(this.AGENDA_ENDPOINT, dto);
    } catch (error) {
      console.error(error);
    }
  }

  async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<AgendaItem[]> {
    const startDTO: AgendaDTO = {
      dataSolicitada: new Date(startDate).toISOString(),
    };
    const endDTO: AgendaDTO = {
      dataSolicitada: new Date(endDate).toISOString(),
    };

    try {
      const [startAgenda, endAgenda] = await Promise.all([
        api.post<AgendaItem[]>(this.AGENDA_ENDPOINT, startDTO),
        api.post<AgendaItem[]>(this.AGENDA_ENDPOINT, endDTO),
      ]);

      const allItems = [...startAgenda, ...endAgenda].filter(
        (item) => item.date >= startDate && item.date <= endDate
      );

      return allItems;
    } catch (error) {
      console.error(error);
    }
  }
}

export const agendaService = new AgendaService();
