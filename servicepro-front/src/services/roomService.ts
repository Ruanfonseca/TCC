// services/roomsService.ts
import { Room, RoomResponse } from "@/types/roomType";
import { api } from "@/utils/api";

const BASE_URL = "/room";

export const roomsService = {
  async getRooms(): Promise<RoomResponse[]> {
    try {
      const response = await api.get<RoomResponse[]>(BASE_URL);
      return response;
    } catch (error) {
      console.error(error);
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
