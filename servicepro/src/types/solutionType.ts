import { Room } from "./roomType";
import { User } from "./userType";

// Service para gerenciar solicitações de salas
export interface SolicitationResponse {
  id: string;
  token: string;
  room: Room | null;
  scheduleInitial: Schedule;
  scheduleEnd: Schedule;
  materia: string;
  numberOfPeople: string;
  dia: string;
  requiredBy: Professor | null;
  rejectedBy: string;
  approvedReason: string;
  blockPrefer: string;
  typeOfRoom: string;
  registration: string;
  userOfAction: User;
  equipament: string[];
  observations?: string;
  status: "pending" | "approved" | "rejected" | "closed";
  approvedBy?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Schedule {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  semester: string;
  status: "active" | "inactive";
  description: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface Professor {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  phone: string;
  departamento: string;
  status: string;
  especialidade: string;
  totalRequests?: number | null;
  approvedRequests?: number | null;
  senha?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewSolicitation {
  id?: string;
  scheduleInitial: Schedule;
  scheduleEnd: Schedule;
  materia: string;
  numberOfPeople: string;
  dia: string;
  blockPrefer: string;
  typeOfRoom: string;
  registration: string;
  equipament: string[];
  observations: string;
  status: string;
}
