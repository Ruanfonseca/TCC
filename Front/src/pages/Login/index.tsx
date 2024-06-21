import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/logouerj.png';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import './login.css';

export const Login = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [returnMessage,setReturnMessage] = useState(false);

    const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handleSenhaInput = (event: ChangeEvent<HTMLInputElement>) => {
        setSenha(event.target.value);
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();  
        if (email && senha) {
            const isLogged = await auth.signin(email, senha);
            
            if (isLogged) {
                navigate('/home');
            } else {
                setReturnMessage(true);
            }
        }
    }

    return (
        <>
            <div className="container">
                <img src={Logo} className="imglogo" alt="Logo" />
                <h2>Service Pro</h2>

                <div className="card-login">
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            value={email}
                            onChange={handleEmailInput}
                            placeholder="Digite seu e-mail"
                        />
                        <input
                            type="password"
                            value={senha}
                            onChange={handleSenhaInput}
                            placeholder="Digite sua Senha"
                        />
                        <button type="submit">Acessar</button>
                    </form>

                    {returnMessage &&
                    <div className="messageError">
                         <div className="textMessageError">Senha ou Matrícula incorretas !</div>
                    </div>
                    } 
                    <a className ="criarconta" href="">Criar Conta</a>
                    <p className="esquecesenha">Esqueceu a senha ? <a href="">Clique aqui</a></p>
                    
                </div>
                
            </div>
        </>
    );
}
