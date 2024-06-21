import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import NavScroll from '../../components/navbar';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useAPI } from '../../hooks/useAPI';
import FuncaoVerificaEmail, { VerificaMatricula } from '../../utils/utils';


const CadastroProfessor: React.FC = () => {
  const api = useAPI();
   
  const[Usuario,setUsuario] = useState({
        nome:'',
        login:'',
        matricula:'',
        senha:'',
        telefone:'',
        faculdade:'',
        role:'USER'
    });
   
    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
  

    useEffect(() => {
        if (auth.user) {
            setIsAdmin(auth.user.role === 'ADMIN');
            setLoading(false);
        }
    }, [auth.user]);

    if (loading) {
        return <div>Carregando...</div>; 
    }
  

      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          const { name, value } = e.target;
          setUsuario({
            ...Usuario,
            [name]: value
          });
        };


        const resetForm = () => {
          setUsuario({
            nome: '',
            login: '',
            matricula: '',
            senha:'',
            telefone:'',
            faculdade:'',
            role: 'USER'
          });
        };
        
        const toggleShowPassword = () => {
          setShowPassword(!showPassword);
        };
        
        const handleSubmit = async(e: React.FormEvent) => {
          e.preventDefault();
          
        
         const VerificacaoEmail = FuncaoVerificaEmail(Usuario.login);
          const VerificacaoMatricula = VerificaMatricula(Usuario.matricula);

          if (VerificacaoEmail && VerificacaoMatricula) {
           try {
            const cadastrado = await api.CadastrarUsuario(Usuario)
             
            if (cadastrado.data) {
               alert('Usuario cadastrado');

               resetForm();
               
              } else {
              alert("Email já cadastrado !");
              }
           } catch (error) {
             console.error(error);
           }
          }else{
            alert('Email ou Matrícula incorretas !')
          }
          
          
        };

  return (
    <>
    <NavScroll isAdmin={isAdmin} />
    <div className='container'>
      <form method="post" onSubmit={handleSubmit}>
        <h1 className='Titulo'>Cadastro de Professor</h1>
        <br />
        
        <div className="card-login">

          <div className="form-group">
            <label htmlFor="nome"><b>Nome:</b></label>
            <input
              type="text"
              className="form-control"
              value={Usuario.nome}
              placeholder="Insira o nome do Usuário"
              name="nome"
              onChange={handleChange}
              required
            />
            <small className="form-text text-muted"><i>* Nome completo.</i></small>
          </div>

          <div className="form-group">
            <label htmlFor="email"><b>E-mail:</b></label>
            <input
              type="email"
              value={Usuario.login}
              name="login"
              className="form-control"
              placeholder="email@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="matricula"><b>Matricula:</b></label>
            <input
              type="text"
              value={Usuario.matricula}
              name="matricula"
              className="form-control"
              placeholder="Ex.:201923307011"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone"><b>Telefone:</b></label>
            <InputMask
              mask="(99) 99999-9999"
              className="form-control"
              value={Usuario.telefone}
              placeholder="Insira o seu número de celular"
              name="telefone"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha"><b>Senha:</b></label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={Usuario.senha}
                placeholder="Insira uma senha de 8 dígitos"
                name="senha"
                onChange={handleChange}
                required
              />
              <div className="input-group-append">
                <button type="button" className="btn btn-outline-secondary" onClick={toggleShowPassword}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <small className="form-text text-muted"><i>* contendo pelo menos uma letra maiúscula, uma letra minúscula e um número.</i></small>
          </div>



          <div className="form-group">
            <label htmlFor="tipo"><b>Faculdade:</b></label>
            <select
              className="form-select"
              name="faculdade"
              value={Usuario.faculdade}
              onChange={handleChange}
              required
            >
              <option value='FCBS'>FCBS</option>
              <option value='FCEE'>FCEE</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success btn-submit">Adicionar Professor</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CadastroProfessor;
