// services/teacherService.ts
import { Teacher, TeacherResponse } from "@/types/teacherType";
import { api } from "@/utils/api";

// 🔹 Mock de professores
const mockTeachers: TeacherResponse[] = [
  {
    id: "1",
    name: "Denis Cople",
    email: "whitelook22@outlook.com",
    phone: "21991203947",
    department: "FCEE",
    status: "active",
    registerNumber: "2019233070",
    specialization: "Computação",
    totalRequests: null,
    approvedRequests: null,
    createdAt: "2025-10-06",
    updatedAt: "2025-10-06",
  },
  {
    id: "2",
    name: "Carlos Sicsu",
    email: "carlos@uezo.edu.br",
    phone: "21991203947",
    department: "FCEE",
    status: "inactive",
    registerNumber: "2020233070",
    specialization: "Computação",
    totalRequests: null,
    approvedRequests: null,
    createdAt: "2025-10-06",
    updatedAt: "2025-10-06",
  },
  {
    id: "4",
    name: "Adriana Sicsu",
    email: "adrianasicsu@uerj.br",
    phone: "21969232991",
    department: "FCEE",
    status: "active",
    registerNumber: "651655577506",
    specialization: "Computação",
    totalRequests: null,
    approvedRequests: null,
    createdAt: "2025-10-06",
    updatedAt: null,
  },
  {
    id: "5",
    name: "Teste Senha",
    email: "root@revan.com",
    phone: "2196987536",
    department: "FCEE",
    status: "active",
    registerNumber: "2019233077",
    specialization: "Computação",
    totalRequests: null,
    approvedRequests: null,
    createdAt: "2025-10-06",
    updatedAt: null,
  },
];

class TeacherService {
  private baseUrl = "/teachers";

  async getTeachers(): Promise<TeacherResponse[]> {
    try {
      const response = await api.get<TeacherResponse[]>(this.baseUrl);
      return response;
    } catch (error) {
      console.warn(
        "⚠️ Falha ao acessar backend, retornando mock de professores."
      );
      return mockTeachers;
    }
  }

  async getTeacherById(id: string): Promise<TeacherResponse> {
    try {
      const response = await api.get<TeacherResponse>(`${this.baseUrl}/${id}`);
      return response;
    } catch (error) {
      console.warn(
        `⚠️ Falha ao acessar backend, retornando mock do professor ${id}.`
      );
      const found = mockTeachers.find((t) => t.id === id);
      if (!found) throw new Error("Professor não encontrado no mock");
      return found;
    }
  }

  async createTeacher(teacher: Teacher): Promise<TeacherResponse> {
    try {
      return await api.post<TeacherResponse>(this.baseUrl, teacher);
    } catch (error) {
      console.warn(
        "⚠️ Falha ao criar professor no backend, retornando mock temporário."
      );
      const mock: TeacherResponse = {
        ...teacher,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalRequests: null,
        approvedRequests: null,
      };
      return mock;
    }
  }

  async updateTeacher(
    id: string,
    updated: Partial<Teacher>
  ): Promise<TeacherResponse> {
    try {
      return await api.put<TeacherResponse>(`${this.baseUrl}/${id}`, updated);
    } catch (error) {
      console.warn(
        `⚠️ Falha ao atualizar professor ${id}, retornando mock atualizado.`
      );
      const index = mockTeachers.findIndex((t) => t.id === id);
      if (index !== -1) {
        const updatedMock = {
          ...mockTeachers[index],
          ...updated,
          updatedAt: new Date().toISOString(),
        };
        mockTeachers[index] = updatedMock;
        return updatedMock;
      }
      throw new Error("Professor não encontrado no mock");
    }
  }

  async deleteTeacher(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.warn(
        `⚠️ Falha ao deletar professor ${id}, removendo do mock local.`
      );
      const index = mockTeachers.findIndex((t) => t.id === id);
      if (index !== -1) mockTeachers.splice(index, 1);
    }
  }
}

export const teacherService = new TeacherService();
export default teacherService;
