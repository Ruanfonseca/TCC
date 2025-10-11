// Tipos para autenticação JWT com Spring Boot
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string; // "Bearer"
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  registration: string;
  name: string;
  role: "ADMIN" | "LOGISTICA" | "PROFESSOR" | "ADMIN_LAB";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
}
