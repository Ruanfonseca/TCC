// services/scheduleService.ts
import { Schedule, ScheduleResponse } from "@/types/schedule";
import { api } from "@/utils/api";

const BASE_URL = "/schedule";

export const scheduleService = {
  async getSchedule(): Promise<ScheduleResponse[]> {
    try {
      const response = await api.get<ScheduleResponse[]>(BASE_URL);
      return response;
    } catch (error) {
      console.error(error);
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
