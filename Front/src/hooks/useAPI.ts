import axios from "axios";
import data from '../data/data.json';
import datahorario from '../data/dataHorario.json';
import dataReq from '../data/dataReq.json';
import dataReqFinalizado from '../data/dataReqFinalizado.json';
import datasala from '../data/datasala.json';
import { CodigoDTO } from "../types/Dtos/CodigoDTO";

import { HorarioDTO } from "../types/Dtos/HorarioDTO";
import { RequerimentoDTO } from '../types/Dtos/RequerimentoDTO';
import { StatusDTO } from "../types/Dtos/StatusDTO";
import { Sala } from "../types/Sala";
import { User } from "../types/User";
import { MatriculaRequestDTO } from './../types/Dtos/MatriculaRequestDTO';
import { SalaDTO } from './../types/Dtos/SalaDTO';
import { Horario } from './../types/Horario';
import { Requerimento } from './../types/Requerimento';

const api = axios.create({
    baseURL: process.env.REACT_APP_API
});
export const useAPI = () => ({
  // Chamada para recuperar dados do backend para popular listas
  ListaDeUsuarios: async() => { 
    return data;
    const response = await api.get('/usuario/listagem');
    return response.data;
  },

  ListaDeSalas: async () => {
    return datasala;
    const response = await api.get('/sala/listagem');
    return response.data;
  },
  ListaDeSalasDisponiveis: async () => {
    return datasala;
    const response = await api.get('/sala/listagem/disponiveis');
    return response.data;
  },
  ListaDeReqs:async(dto: StatusDTO)=>{
    
    return dataReq;
   
    // const response = await api.get('/requerimento/listagem', dto);
    // return response;
  },
  ListaDeReqsFinalizados:async()=>{
    
    return dataReqFinalizado;
   
    // const response = await api.get('/requerimento/listagem', dto);
    // return response;
  },
 
  ListaDeHorarios: async () => {
    return datahorario;
    const response = await api.get('/horario/listagem');
    return response.data;
  },

  SalvarEditado: async (usuario: User) => {
    const response = await api.put('/editar', usuario);
    return response;
  },

  AtualizarReq: async (req:RequerimentoDTO) => {
    const response = await api.put('/requerimento/editar/pendente', req);
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

  CadastrarRequerimento:async(requerimento:Requerimento)=>{
    const dto: RequerimentoDTO = {
      sala: requerimento.sala.nome,
      horarioInicial: requerimento.horarioInicial.nome,
      horarioFinal: requerimento.horarioFinal.nome,
      data: requerimento.data.toISOString(),
      matricula: requerimento.matricula,
      nome: requerimento.nome,
      email: requerimento.email,
      telefone: requerimento.telefone,
      motivoJustificativa: requerimento.motivoJustificativa,
      status:'P',
      codigo:requerimento.codigo
  };

  const response = await api.post('/requerimento/cadastrar', dto);
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
    const mockUser = {
      nome: 'João da Silva',
      login: 'joao.silva',
      matricula: '123456',
      faculdade: 'Faculdade de Exemplo',
      setor: 'Setor de Exemplo',
      senha: 'senha123',
      telefone: '1234-5678',
      role: 'ADMIN'
    };
   return mockUser;
    const response = await api.get('/busca/matricula',{data:dto});
   
    return response.data;
  },

  buscarRequerimentoPorCodigo: async (code: CodigoDTO) => {
    // eslint-disable-next-line no-labels
   const mockRequerimento = {
      sala: 'Sala A',
      horarioInicial: '08:00',
      horarioFinal: '12:00',
      data: '2024-06-30',
      matricula: '123456',
      nome: 'João da Silva',
      email: 'joao.silva@example.com',
      telefone: '1234-5678',
      motivoJustificativa: 'Motivo da justificativa',
      status: 'Pendente',
      nomeFunc: 'Funcionário Exemplo',
      matriculaFunc: '654321',
      retorno: 'Retorno da ação',
      codigo: 'REQ-001'
  };

  return mockRequerimento;
    
    const response = await api.get('/busca/requerimento',{data:code});
    return response.data;
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
