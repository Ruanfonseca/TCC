import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API
});



export const useAuthApi = () => ({
    
    
    //chamadas para validação de login
    validateToken: async (token: string) => {
        
        return {
            user:{nome:'Jose',login:'jose@gmail.com',role:'ADMIN'}
        }
       

        const response = await api.post('/auth/validate', { token });
        
        return {
            user:{nome:response.data.nome,login:response.data.login,role:response.data.role}
        }
    },

    signin: async (login: string, matricula: string) => {
        
        return {
            user:{nome:'Jose',login:'jose@gmail.com',role:'ADMIN'},
            token: '16252616182828'
        }

        const response = await api.post('/auth', { login, matricula });

        if (response) {
            return {
                user: {nome:response.data.nome, login:response.data.login , role:response.data.role },
                token: response.data.token
            };            
        }else{
            return {
                user: null,
                token: ''
            };
        }

    },
    logout: async () => {
        return { status: true };
    },
    /********************************************************************** */

});