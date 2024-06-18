import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Footer from "../../components/footer";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";

interface Usuario{
  nome: string;
  login: string;
  matricula?: string;
  role?:string;
  setor?:string;
  faculdade?:string;
}

function UsuariosList() {
    
    const [Usuarios, setUsuarios] = useState<Usuario[]>([]);

    const api = useAPI();

    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    api.ListaDeUsuarios()
        .then(response => {
          setUsuarios(response);
        })
        .catch(error => {
          console.error('Erro ao renderizar os dados:', error);
        });

        if (auth.user) {
            setIsAdmin(auth.user.role === 'ADMIN');
            setLoading(false);
        }
    },[auth.user]);

    if (loading) {
        return <div>Carrengando...</div>; 
    }
  
    return (

     <>
     <NavScroll isAdmin={isAdmin} /> 
     <br/>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Login</th>
            <th>Faculdade</th>
            <th>Setor</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {Usuarios.map((item) => (
            <tr>
              <td>{item.nome}</td>
              <td>{item.login}</td>
              <td>{item.faculdade}</td>
              <td>{item.setor}</td>
              <td>{item.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
       <Footer/>
      </>
    );
  }
  
  export default UsuariosList;