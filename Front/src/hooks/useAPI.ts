import axios from "axios";
import { Sala } from "../types/Sala";
import { User } from "../types/User";
import { Horario } from './../types/Horario';


const api = axios.create({
    baseURL: process.env.REACT_APP_API
});

export const useAPI = () =>({
  //chamada para recuperar dados do backend para popular listas
   
   ListaDeUsuarios: async (): Promise<User[]> => {
    const response = await api.get('/usuario/listagem');
    return response.data;
  },

  ListaDeSalas: async (): Promise<Sala[]> => {
   const response = await api.get('/sala/listagem');
   return response.data;
 },
 
 ListaDeHorarios: async (): Promise<Horario[]> => {
   const response = await api.get('/horario/listagem');
   return response.data;
 },

   CadastrarUsuario:async(Usuario:User)=>{
    
    const response  = await api.post('/usuario/cadastrar',Usuario);
     
    return response;
   },

   CadastrarProfessor:async(Usuario:User) => {
      
    const response = await api.post('/usuario/professor/cadastrar',Usuario);

    return response;

   },
   CadastrarSala:async(Sala:Sala) => {
      
    const response = await api.post('/sala/cadastrar',Sala);

    return response;

   },
   CadastrarHorario:async(Horario:Horario)=>{
    const response = await api.post('/horario/cadastrar',Horario);

    return response;
   }

   


});
