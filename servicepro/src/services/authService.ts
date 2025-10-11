import { LoginRequest, LoginResponse, UserInfo } from "@/types/auth";
import { axiosInstance } from "@/utils/api";

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
        email,
        password,
      } as LoginRequest);

      // Armazena o token e informações do usuário no localStorage
      this.setToken(data.token);
      this.setUser(data.user);

      return data;
    } catch (error: any) {
      console.error(" Resposta completa do erro:", error.response);
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Obter token armazenado
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // Armazenar token
  private setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  // Obter usuário armazenado
  getUser(): UserInfo | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // getUser(): UserInfo | null {
  //   return mockUser;
  // }

  // Armazenar usuário
  private setUser(user: UserInfo): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Obter headers com token
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Validar token (opcional - chama endpoint do backend)
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      await axiosInstance.get("/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;
