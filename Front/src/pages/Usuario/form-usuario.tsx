import { useContext, useEffect, useState } from "react";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";
import FuncaoVerificaEmail, { VerificaMatricula } from "../../utils/utils";
import './usuario.css';


const Cadastro:React.FC = () => {
  
  const api = useAPI();
   
  const[Usuario,setUsuario] = useState({
        nome:'',
        login:'',
        matricula:'',
        setor:'Logística',
        role:'ADMIN'
    });
   
    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth.user) {
            setIsAdmin(auth.user.role === 'ADMIN');
            setLoading(false);
        }
    }, [auth.user]);

    if (loading) {
        return <div>Loading...</div>; 
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
            setor:'Logística',
            role: 'ADMIN'
          });
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
            alert("Email ou Matrícula incorretas!");
          }
          
          
        };
      
  return (
    <>
    <NavScroll isAdmin={isAdmin}/>
    <div className='container'>
        <form method="post" onSubmit={handleSubmit}>
          <h1 className='Titulo'>Cadastro de Usuário</h1>
          <br />
          <div className="card-login">
          <div className="form-group ">
            <label htmlFor="nome"><b>Nome:</b></label>
            <input
              type="text"
              className="form-control"
              value={Usuario.nome}
              placeholder="Insira o nome do Usuario"
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
            <label htmlFor="tipo"><b>Setor:</b></label>
            <select
              className="form-select"
              name="setor"
              value={Usuario.setor}
              onChange={handleChange}
              required
            >
              <option value='LOGISTICA'>Logistica</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success btn-submit">Adicionar Usuário</button>
          </div>
        </form>
      </div>
    
    </>
  )
}

export default Cadastro