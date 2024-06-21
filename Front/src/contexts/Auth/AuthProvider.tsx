import { useEffect, useState } from "react";
import { useAuthApi } from "../../hooks/useAuthApi";
import { User } from "../../types/User";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const api = useAuthApi();

  useEffect(() => {
    const validateToken = async () => {
      const storageData = localStorage.getItem('authToken');
      if (storageData) {
        try {
          const data = await api.validateToken(storageData);
          if (data.user) {
            setUser(data.user);
          }
        } catch (error) {
          console.error('Erro ao validar o token:', error);
        }
      }
    };

    validateToken();
  }, [api]);

  const signin = async (login: string, matricula: string) => {
    try {
      const data = await api.signin(login, matricula);
      if (!data) {
        return false;
      }
      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const signout = async () => {
    setUser(null);
    setToken('');
    await api.logout();
  };

  const setToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
