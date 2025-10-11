// services/scheduleService.ts
import { Schedule, ScheduleResponse } from "@/types/schedule";
import { api } from "@/utils/api";

const BASE_URL = "/schedule";

// 🔹 Mock de horários
const mockSchedules: ScheduleResponse[] = [
  {
    id: "1",
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
  {
    id: "3",
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
];

export const scheduleService = {
  async getSchedule(): Promise<ScheduleResponse[]> {
    try {
      const response = await api.get<ScheduleResponse[]>(BASE_URL);
      return response;
    } catch (error) {
      console.warn("⚠️ Falha ao acessar backend, retornando mock de horários.");
      return mockSchedules;
    }
  },

  async createSchedule(schedule: Schedule): Promise<ScheduleResponse> {
    return api.post<ScheduleResponse>(BASE_URL, schedule);
  },

  async deleteSchedule(id: string): Promise<void> {
    return api.delete(`${BASE_URL}/${id}`);
  },

  async updateSchedule(
    id: string,
    updated: Partial<Schedule>
  ): Promise<ScheduleResponse | null> {
    return api.put<ScheduleResponse>(`${BASE_URL}/${id}`, updated);
  },
};
