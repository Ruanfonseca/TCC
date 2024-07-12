import { createContext } from 'react';
import { requestDTO } from '../../types/Dtos/RequestDTO';
import { User } from '../../types/User';

export type AuthContextType = {
    user: User | null;
    signin: (email: string, matricula: string) => Promise<boolean>;
    verificaExistente(requestDTO: requestDTO): Promise<User | null>;
    updateUserPassword(user: User): Promise<Boolean>;
    signout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);