// Service para gerenciar professores
export type Teacher = {
  name: string;
  email: string;
  phone: string;
  department: string;
  status: string;
  specialization: string;
  registerNumber: string;
  password?: string;
};

// Dados que o backend retorna (com id)
export type TeacherResponse = Teacher & {
  id: string;
  totalRequests?: string;
  approvedRequests?: string;
  createdAt: string;
  updatedAt: string;
};
