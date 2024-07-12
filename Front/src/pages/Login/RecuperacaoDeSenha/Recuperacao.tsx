import 'bootstrap/dist/css/bootstrap.min.css';
import { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logouerj.png';
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import { requestDTO } from '../../../types/Dtos/RequestDTO';
import { VerificaMatricula } from '../../../utils/utils';
import '../login.css';

const Recuperacao = () => {
  const [matricula, setMatricula] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  const handleMatriculaInput = (event: ChangeEvent<HTMLInputElement>) => {
    setMatricula(event.target.value);
  }
  const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handleNext = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();  

    if (VerificaMatricula(matricula)) {

      const requestDTO: requestDTO = { matricula,email };

      const user = await auth.verificaExistente(requestDTO);
      
      if (user) {
        navigate('/recuperacao/segundaetapa', { state: { user } });
      } else {
        alert('Usuário não Registrado!');
      }
    } else {
      alert('Matricula Incorreta!');
    }
  }

  const handleReset = () => {
    navigate('/');
  }

  return (
    <>
      <div className="container">
        <img src={Logo} className="imglogo" alt="Logo" />
        <h2>Recuperação de Senha</h2>
        
        <div className="card-login">
          <p>Digite seu email cadastrado e matrícula</p>
          
          <form onSubmit={handleNext}>
            
            <label >Email</label>
            <input
              type="text"
              value={email}
              onChange={handleEmailInput}
              placeholder="Email"
              required
            />

             <label >Matrícula</label>
            <input
              type="text"
              value={matricula}
              onChange={handleMatriculaInput}
              placeholder="Matrícula"
              required
            />

            <button className="buttonForm" type="submit">Verificar</button>
            <br/>
            <button className="buttonRetorno" type="button" onClick={handleReset}>Retornar</button>
          </form>
          
        </div>
      </div>
    </>
  )
}

export default Recuperacao;
