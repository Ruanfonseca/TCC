import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Footer from "../../components/footer";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";

interface Sala{
    nome:string;
   capacidade:string;
   status_da_sala:string;
  }
  

function SalasList (){
  
    const [Salas, setSalas] = useState<Sala[]>([]);

    const api = useAPI();

    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    api.ListaDeSalas()
        .then(response => {
          setSalas(response);
        })
        .catch(error => {
        // alert('Erro ao renderizar os dados') 
         console.error('Erro:', error);
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
            <th>Capacidade</th>
            <th>Status</th>
            
          </tr>
        </thead>
        <tbody>
          {Salas.map((item) => (
            <tr>
              <td>{item.nome}</td>
              <td>{item.capacidade}</td>
              <td>{item.status_da_sala}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    <Footer/>
      </>
    );
  }

export default SalasList