import { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logouerj.png';
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import { VerificaMatricula } from '../../../utils/utils';
import '../login.css';

const Recuperacao = () => {
  const [matricula, setMatricula] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  
  const handleMatriculaInput = (event: ChangeEvent<HTMLInputElement>) => {
    setMatricula(event.target.value);
}
const handleNext = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();  
  if (VerificaMatricula(matricula)) {
      //const isLogged = await auth.signin(email, senha);
      navigate('/recuperacao/segundaetapa');
      if (false) {
          navigate('');
      } else {
        alert('Usuário não Registrado !')
      }
  }else{
    alert('Matricula Incorreta !')
  }


}


  function handleReset(): void {
    navigate('/')
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
                        <button className='buttonForm' type="submit">Verificar</button>
                        <br/>
                        <button className='buttonRetorno' onClick={handleReset}>Retornar</button>
                        
                    </form>
                    
                </div>
            </div>
        </>
  )
}

export default Recuperacao