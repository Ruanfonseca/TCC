import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/logouerj.png';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import './login.css';

export const Login = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [matricula, setMatricula] = useState('');
    const [returnMessage,setReturnMessage] = useState(false);

    const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handleMatriculaInput = (event: ChangeEvent<HTMLInputElement>) => {
        setMatricula(event.target.value);
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();  
        if (email && matricula) {
            const isLogged = await auth.signin(email, matricula);
            
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
                            type="text"
                            value={matricula}
                            onChange={handleMatriculaInput}
                            placeholder="Digite sua matrícula"
                        />
                        <button type="submit">Acessar</button>
                    </form>

                    {returnMessage &&
                    <div className="messageError">
                         <div className="textMessageError">Senha ou Matrícula incorretas !</div>
                    </div>
 } 
                </div>
            </div>
        </>
    );
}
