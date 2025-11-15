// Dados para criar sala (sem id)
export type Room = {
  id?: string;
  name?: string;
  block?: string;
  capacity?: number;
  type?: string;
  equipment?: string[];
  status?: string;
  floor?: number;
  description?: string;
};

// Dados que o backend retorna (com id)
export type RoomResponse = Room & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
