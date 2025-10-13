import { User, UserResponse } from "@/types/userType";
import { api } from "@/utils/api";

const BASE_URL = "/user";

class UserService {
  // services/userService.ts
  async getUsers(): Promise<UserResponse[]> {
    try {
      const response = await api.get<UserResponse[]>(BASE_URL);
      return response;
    } catch (error) {
      console.error(error);
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
