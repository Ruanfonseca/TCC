import { Horario } from "./Horario";
import { Sala } from "./Sala";

export type Requerimento = {
    sala: Sala;         
    horarioInicial: Horario;
    horarioFinal: Horario;   
    data: Date;
    matricula:string;
    nome:string;   
    email:string;
    telefone:string;   
    motivoJustificativa: string;
    codigo:string;
};