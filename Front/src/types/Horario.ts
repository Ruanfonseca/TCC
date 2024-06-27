import { Requerimento } from "./Requerimento";

export type Horario = {
   nome:string;
   periodo:string;
   horaInicio:string,
   horaFim:string,
   requerimentos?: Requerimento[];
}