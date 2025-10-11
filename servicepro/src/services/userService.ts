import { User, UserResponse } from "@/types/userType";
import { api } from "@/utils/api";

const BASE_URL = "/user";
const mockUsers: UserResponse[] = [
  {
    id: "16",
    name: "Root User",
    email: "root@admin.com",
    password: "$2a$10$Ce7f6GLqdhIrhS2dp6shsON2c4lM5hBRMeNsaVChk8MJutAYpZesW",
    department: null,
    registerNumber: "ROOT001",
    role: "ADMIN",
    status: "active",
    phone: "+55 21 99999-9999",
    updatedAt: "2025-10-07",
    createdAt: "2025-10-07",
  },
  {
    id: "17",
    name: "RUAN SOARES DA SILVA FONSECA",
    email: "whitelook22@outlook.com",
    password: "$2a$10$sp.NkeFFNxTM6wzYoxb1U.DSakvUYVLeH5Qaoa8zY/WxuJ2UOxWHi",
    department: null,
    registerNumber: "201923307011",
    role: "LOGISTICA",
    status: "active",
    phone: "(21) 99120-3947",
    updatedAt: "2025-10-07",
    createdAt: "2025-10-07",
  },
  {
    id: "18",
    name: "Andrade Ferreira",
    email: "teste@gmail.com",
    password: "$2a$10$zQg65pd924vCz.vGrV7MyuXZEgMzYO5BZrWcdJWvQs/CY6NDmbTsO",
    department: null,
    registerNumber: "201923307012",
    role: "ADMIN",
    status: "active",
    phone: "(21) 96587-4536",
    updatedAt: null,
    createdAt: "2025-10-07",
  },
];

class UserService {
  // services/userService.ts
  async getUsers(): Promise<UserResponse[]> {
    try {
      const response = await api.get<UserResponse[]>(BASE_URL);
      return response;
    } catch (error) {
      console.warn("⚠️ Falha ao acessar backend, retornando mock de usuários.");
      return mockUsers;
    }
  }

  async getUserById(id: string): Promise<UserResponse> {
    return api.get<UserResponse>(`${BASE_URL}/${id}`);
  }

  async createUser(user: User): Promise<UserResponse> {
    return api.post<UserResponse>(BASE_URL, user);
  }

  async updateUser(id: string, updated: Partial<User>): Promise<UserResponse> {
    return api.put<UserResponse>(`${BASE_URL}/${id}`, updated);
  }

  async deleteUser(id: string): Promise<void> {
    return api.delete(`${BASE_URL}/${id}`);
  }
}

export const userService = new UserService();
export default userService;
