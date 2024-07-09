/* eslint-disable react-hooks/rules-of-hooks */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logouerj.png';
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import { User } from "../../../types/User";
import '../login.css';

const RecuperacaoEtapa2 = () => {
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state as { user: User };

    const handleSenhaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSenha(e.target.value);
    };

    const handleConfirmarSenhaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmarSenha(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const updatedUser = { ...user, senha };
            const auth = useContext(AuthContext);
         
         const response = await auth.updateUserPassword(updatedUser);
           
           if (response) {
            alert("Senha alterada com sucesso!");
           }
            
            navigate('/login'); 
        } catch (error) {
            alert("Erro ao alterar a senha!");
        }
    };

    return (
        <div className="container">
            <img src={Logo} className="imglogo" alt="Logo" />
            <h2>Recuperação de Senha</h2>
            <p>Digite a nova senha</p>

            <div className="card-login">
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={senha}
                        onChange={handleSenhaInput}
                        placeholder="Digite sua nova senha"
                        required
                    />
                    <input
                        type="password"
                        value={confirmarSenha}
                        onChange={handleConfirmarSenhaInput}
                        placeholder="Confirme sua nova senha"
                        required
                    />
                    <button className='buttonForm' type="submit">Alterar Senha</button>
                </form>
            </div>
        </div>
    );
}

export default RecuperacaoEtapa2;
