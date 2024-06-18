import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Footer from "../../components/footer";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";

interface Horario{
    nome:string;
     periodo:string;
  }

const HorariosList = () => {
    const [Horarios, setHorarios] = useState<Horario[]>([]);

    const api = useAPI();

    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    api.ListaDeHorarios()
        .then(response => {
          setHorarios(response);
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
            <th>Periodo</th>
            
            
          </tr>
        </thead>
        <tbody>
          {Horarios.map((item) => (
            <tr>
              <td>{item.nome}</td>
              <td>{item.periodo}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    <Footer/>
      </>
    );
  }

export default HorariosList