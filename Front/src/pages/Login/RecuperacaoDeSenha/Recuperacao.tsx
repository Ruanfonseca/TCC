import 'bootstrap/dist/css/bootstrap.min.css';
import { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logouerj.png';
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import { MatriculaRequestDTO } from '../../../types/Dtos/MatriculaRequestDTO';
import { VerificaMatricula } from '../../../utils/utils';
import '../login.css';

const Recuperacao = () => {
  const [matricula, setMatricula] = useState<string>('');

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleMatriculaInput = (event: ChangeEvent<HTMLInputElement>) => {
    setMatricula(event.target.value);
  }

  const handleNext = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();  

    if (VerificaMatricula(matricula)) {
      const matriculaDTO: MatriculaRequestDTO = { matricula };

      const user = await auth.verificaExistente(matriculaDTO);
      
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
          <p>Digite sua Matrícula</p>
          
          <form onSubmit={handleNext}>
            <input
              type="text"
              value={matricula}
              onChange={handleMatriculaInput}
              placeholder="Matrícula"
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
