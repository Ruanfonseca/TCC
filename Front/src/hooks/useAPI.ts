import axios from "axios";
import data from '../data/data.json';
import datasala from '../data/datasala.json';
import { HorarioDTO } from "../types/Dtos/HorarioDTO";
import { Sala } from "../types/Sala";
import { User } from "../types/User";
import { MatriculaRequestDTO } from './../types/Dtos/MatriculaRequestDTO';
import { SalaDTO } from './../types/Dtos/SalaDTO';
import { Horario } from './../types/Horario';

const api = axios.create({
    baseURL: process.env.REACT_APP_API
});



export const useAPI = () => ({
  // Chamada para recuperar dados do backend para popular listas
  ListaDeUsuarios: async (): Promise<User[]> => {
    return data;
    const response = await api.get('/usuario/listagem');
    return response.data;
  },

  ListaDeSalas: async (): Promise<Sala[]> => {
    return datasala;
    const response = await api.get('/sala/listagem');
    return response.data;
  },
 
  ListaDeHorarios: async (): Promise<Horario[]> => {
    const response = await api.get('/horario/listagem');
    return response.data;
  },

  SalvarEditado: async (usuario: User) => {
    const response = await api.put('/editar', usuario);
    return response;
  },

  SalvarSalaEditada: async (sala: Sala) => {
    const response = await api.put('/sala/editar',sala);
    return response;
  },

  SalvarHorarioEditado:async(horario:Horario) =>{
    const response = await api.put('/horario/editar',horario);
    return response;
  },
  CadastrarUsuario: async (usuario: User) => {
    const response = await api.post('/usuario/cadastrar', usuario);
    return response;
  },

  CadastrarProfessor: async (usuario: User) => {
    const response = await api.post('/usuario/professor/cadastrar', usuario);
    return response;
  },

  CadastrarSala: async (sala: Sala) => {
    const response = await api.post('/sala/cadastrar', sala);
    return response;
  },

  CadastrarHorario: async (horario: Horario) => {
    const response = await api.post('/horario/cadastrar', horario);
    return response;
  },

  buscarUsuarioPorMatricula: async (dto:MatriculaRequestDTO) => {
   
    const response = await api.get('/busca/matricula',{data:dto});
   
    return response.data;
  },

  buscarRequerimentoPorCpf: async (cpf: string): Promise<string> => {
   
    return `Requerimento encontrado para CPF: ${cpf}`;
  },

  deleteUsuario: async (dto: MatriculaRequestDTO) => {
    console.log(dto)
    const response = await api.delete('/usuario/deletar', { data: dto });
    return response.data;
  },
  deleteSala: async (dto: SalaDTO) => {
    const response = await api.delete('/sala/deletar', { data: dto });
    return response.data;
  }
  ,deleteHorario: async (dto: HorarioDTO) => {
    console.log(dto)
    const response = await api.delete('/horario/deletar', { data: dto });
    return response.data;
  }

});
