import axios from 'axios';
import { MatriculaRequestDTO } from '../types/Dtos/MatriculaRequestDTO';
import { User } from '../types/User';

const api = axios.create({
    baseURL: process.env.REACT_APP_API
});



export const useAuthApi = () => ({
    validateToken: async (token: string) => {
        return {
           
            user:{nome:'Jose',login:'jose@gmail.com',matricula:'2019233307013',telefone:'21969232991'
                ,senha:'Atento2024',
                role:'ADMIN',setor:'LOGÍSTICA',faculdade:''}
        }
        const response = await api.post('/auth/validate', { token });
        return {
            user: {
                nome: response.data.nome,
                login: response.data.login,
                role: response.data.role,
                matricula: response.data.matricula || ''
            }
        };
    },

    signin: async (login: string, matricula: string) => {
        return {
            user:{nome:'Jose',login:'jose@gmail.com',matricula:'2019233307013',telefone:'21969232991'
                ,senha:'Atento2024',
                role:'ADMIN',setor:'LOGÍSTICA',faculdade:''},
            token: '16252616182828'
        }
        const response = await api.post('/auth', { login, matricula });
        if (response) {
            return {
                user: {
                    nome: response.data.nome,
                    login: response.data.login,
                    role: response.data.role,
                    matricula: response.data.matricula || ''
                },
                token: response.data.token
            };
        } else {
            return {
                user: null,
                token: ''
            };
        }
    },

    logout: async () => {
        return { status: true };
    },

    verificaExistente : async(matricula : MatriculaRequestDTO)=>{
        
        const response = await api.post('/auth/recuperacao', { matricula });

        return response.data;
    },

    alterarSenha:async(user:User)=>{
        const response = await api.put('/auth/recuperacao/alterarsenha', { user });

        return response.data;
    }
});
