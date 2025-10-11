// services/roomsService.ts
import { Room, RoomResponse } from "@/types/roomType";
import { api } from "@/utils/api";

const BASE_URL = "/room";

// 🔹 Mock de salas
const mockRooms: RoomResponse[] = [
  {
    id: "2",
    name: "201",
    block: "Bloco A",
    capacity: 30,
    type: "Sala de Aula",
    equipment: ["Projetor", "Computador", "Ar Condicionado"],
    status: "active",
    floor: 2,
    description: "",
    createdAt: null,
    updatedAt: null,
  },
];

export const roomsService = {
  async getRooms(): Promise<RoomResponse[]> {
    try {
      const response = await api.get<RoomResponse[]>(BASE_URL);
      return response;
    } catch (error) {
      console.warn("⚠️ Falha ao acessar backend, retornando mock de salas.");
      return mockRooms;
    }
  },

  async createRoom(room: Room): Promise<RoomResponse> {
    return api.post<RoomResponse>(BASE_URL, room);
  },

  async updateRoom(
    id: string,
    updated: Partial<Room>
  ): Promise<RoomResponse | null> {
    return api.put<RoomResponse>(`${BASE_URL}/${id}`, updated);
  },

  async deleteRoom(id: string): Promise<void> {
    return api.delete(`${BASE_URL}/${id}`);
  },
};
