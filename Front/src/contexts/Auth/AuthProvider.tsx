import { useEffect, useState } from "react";
import { useAuthApi } from "../../hooks/useAuthApi";
import { User } from "../../types/User";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<User | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const api = useAuthApi();


    useEffect(() => {
        
        const validateToken = async () => {
            
            const storageData = localStorage.getItem('authToken');

            if (storageData) {
                const data = await api.validateToken(storageData);
                
                if (data.user) {
                    setUser(data.user);
                }
            }
        }
        validateToken(); 
    }, [api]);

    const signin = async (login: string, matricula: string) => {
            
       const data = await api.signin(login,matricula);
       
       if(data === null){
           return false;
       }
       
        if (data.user && data.token) {
            setUser(data.user);
            setToken(data.token);
            return true;
        }
       
        return false;
    }

    const signout = async () => {
        
        setUser(null);
        setToken('');
        await api.logout();
    }

    const setToken = (token: string) => {
        localStorage.setItem('authToken', token);
    }

    return (
        <AuthContext.Provider value={{ user, signin, signout }}>
            {children}
        </AuthContext.Provider>
    );
}