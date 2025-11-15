// services/teacherService.ts
import { Teacher, TeacherResponse } from "@/types/teacherType";
import { api } from "@/utils/api";

class TeacherService {
  private baseUrl = "/teachers";

  async getTeachers(): Promise<TeacherResponse[]> {
    try {
      const response = await api.get<TeacherResponse[]>(this.baseUrl);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getTeacherById(id: string): Promise<TeacherResponse> {
    try {
      const response = await api.get<TeacherResponse>(`${this.baseUrl}/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async createTeacher(teacher: Teacher): Promise<TeacherResponse> {
    try {
      return await api.post<TeacherResponse>(this.baseUrl, teacher);
    } catch (error) {
      console.error(error);
    }
  }

  async updateTeacher(
    id: string,
    updated: Partial<Teacher>
  ): Promise<TeacherResponse> {
    try {
      return await api.put<TeacherResponse>(`${this.baseUrl}/${id}`, updated);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteTeacher(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(error);
    }
  }
}

export const teacherService = new TeacherService();
export default teacherService;
