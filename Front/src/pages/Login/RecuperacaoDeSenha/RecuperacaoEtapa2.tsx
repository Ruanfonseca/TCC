import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logouerj.png';
import '../login.css';

const RecuperacaoEtapa2 = () => {
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const navigate = useNavigate();

    const handleSenhaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSenha(e.target.value);
    };

    const handleConfirmarSenhaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmarSenha(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }
        // Adicione a lógica para enviar a nova senha para o servidor
        alert("Senha alterada com sucesso!");
        navigate('/login'); // Redirecionar para a página de login após a alteração da senha
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
