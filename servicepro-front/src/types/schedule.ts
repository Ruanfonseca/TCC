// Service para gerenciar horários
export type Schedule = {
  id?: string;
  name?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
  semester?: string;
  status?: "active" | "inactive";
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Dados que o backend retorna (com id)
export type ScheduleResponse = Schedule & {
  id: string;
};
