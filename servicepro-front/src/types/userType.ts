// Service para gerenciar usuários
export interface User {
  name: string;
  email: string;
  role: "ADMIN" | "LOGISTICA" | "ADMIN_LAB";
  status: "active" | "inactive";
  department?: string;
  phone?: string;
  password?: string;
  lastLogin?: string;
  registerNumber: string;
}

// Dados que o backend retorna (com id)
export type UserResponse = User & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
