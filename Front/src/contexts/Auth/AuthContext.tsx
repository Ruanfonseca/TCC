import { createContext } from 'react';
import { MatriculaRequestDTO } from '../../types/Dtos/MatriculaRequestDTO';
import { User } from '../../types/User';

export type AuthContextType = {
    user: User | null;
    signin: (email: string, matricula: string) => Promise<boolean>;
    verificaExistente(matriculaDTO: MatriculaRequestDTO): Promise<User | null>;
    updateUserPassword(user: User): Promise<Boolean>;
    signout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);