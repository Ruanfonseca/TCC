import * as z from "zod";

// Room schema
const roomSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  block: z.string(),
  capacity: z.number(),
  type: z.string(),
  equipment: z.array(z.string()),
  status: z.string(),
  floor: z.number(),
  description: z.string(),
});

// Schedule schema
export const scheduleSchema = z.object({
  id: z.number(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  days: z.array(z.string()),
  semester: z.string(),
  status: z.enum(["active", "inactive"]),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

// NewSolicitation schema
export const newSolicitationSchema = z.object({
  id: z.string().optional(),
  scheduleInitial: scheduleSchema,
  scheduleEnd: scheduleSchema,
  materia: z.string().min(1, "Disciplina é obrigatória"),
  numberOfPeople: z.string().min(1, "Número de alunos é obrigatório"),
  dia: z.string().min(1, "Data é obrigatória"), // formato "yyyy-MM-dd"
  blockPrefer: z.string(),
  typeOfRoom: z.string(),
  registration: z.string(),
  equipament: z.array(z.string()),
  observations: z.string(),
  status: z.string(),
});

// Inferindo o tipo TypeScript a partir do schema
export type NewSolicitationForm = z.infer<typeof newSolicitationSchema>;
