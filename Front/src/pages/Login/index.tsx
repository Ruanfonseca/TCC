import 'bootstrap/dist/css/bootstrap.min.css';
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
    const [returnMessage, setReturnMessage] = useState(false);

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
    const handleRecuperarConta =  (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate('/recuperacao');
    }
    const handleCriarConta = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate('/criarConta');
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
                            
                            onChange={handleEmailInput}
                            placeholder="Digite seu e-mail"
                        />
                        <input
                            type="password"
                            
                            onChange={handleSenhaInput}
                            placeholder="Digite sua Senha"
                        />
                        <button className='buttonForm' type="submit">Acessar</button>
                    </form>

                    
                    <a className="criarconta" href="" onClick={handleCriarConta}>Criar Conta</a>
                    <p className="esquecesenha">Esqueceu a senha ? <a href="" onClick={handleRecuperarConta}>Clique aqui</a></p>
                </div>
            </div>
        </>
    );
}
