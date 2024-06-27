import { Requerimento } from "./Requerimento";

export type Sala = {
   nome:string;
   capacidade:string;
   status_da_sala:string;
   requerimentos?: Requerimento[];
}