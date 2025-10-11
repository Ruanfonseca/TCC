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

const MOCK_AGENDA: AgendaItem[] = [
  {
    id: "1",
    type: "sala",
    date: "2025-10-09",
    timeStart: "08:00",
    timeEnd: "10:00",
    title: "Aula de Algoritmos",
    professorName: "Prof. João Silva",
    subject: "Algoritmos e Programação",
    numberOfStudents: "25",
    status: "approved",
    location: "Bloco A - Sala 101",
    observations: "Projetor necessário",
    token: "REQ-12345",
  },
  {
    id: "2",
    type: "laboratorio",
    date: "2025-10-09",
    timeStart: "10:00",
    timeEnd: "12:00",
    title: "Prática de Redes",
    professorName: "Profa. Maria Souza",
    subject: "Redes de Computadores",
    numberOfStudents: "18",
    status: "pending",
    location: "Lab 3 - Informática",
    token: "REQ-67890",
  },
  {
    id: "3",
    type: "sala",
    date: "2025-10-10",
    timeStart: "13:00",
    timeEnd: "15:00",
    title: "Reunião do Departamento",
    professorName: "Prof. Carlos Oliveira",
    subject: "Gestão Acadêmica",
    numberOfStudents: "10",
    status: "cancelled",
    location: "Sala de Reuniões - Bloco C",
    token: "REQ-11111",
  },
];

class AgendaService {
  private readonly AGENDA_ENDPOINT = "/analise/agenda";

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private handleError(error: any, context: string): AgendaItem[] {
    console.warn(
      `[AgendaService] Falha ao carregar ${context}. Usando lista mockada.`,
      error
    );
    return MOCK_AGENDA;
  }

  async getAll(date: Date): Promise<AgendaItem[]> {
    const dto: AgendaDTO = { dataSolicitada: this.formatDate(date) };
    try {
      return await api.post<AgendaItem[]>(this.AGENDA_ENDPOINT, dto);
    } catch (error) {
      return this.handleError(error, "getAll");
    }
  }

  async getByDate(date: string): Promise<AgendaItem[]> {
    const dto: AgendaDTO = { dataSolicitada: new Date(date).toISOString() };
    try {
      return await api.post<AgendaItem[]>(this.AGENDA_ENDPOINT, dto);
    } catch (error) {
      return this.handleError(error, "getByDate");
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
      return this.handleError(error, "getByDateRange");
    }
  }
}

export const agendaService = new AgendaService();
