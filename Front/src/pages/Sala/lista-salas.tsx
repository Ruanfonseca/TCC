import { useContext, useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import ModalSala from "../../components/SalaModals/modalSala";
import ModalDeleteSalaConfirmacao from "../../components/SalaModals/modelDelete";
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
    const [selectedUsuario, setSelectedUsuario] = useState<Sala | null>(null);
    const api = useAPI();

    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    
  const [modalShow, setModalShow] = useState(false);
  const [DeletemodalShow, setDeleteModalShow] = useState(false);

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
  
    const handleEditClick = (sala: Sala) => {
      setSelectedUsuario(sala);
      setModalShow(true);
    };
  
    const handleDeleteClick = (sala: Sala) => {
      setSelectedUsuario(sala);
      setDeleteModalShow(true);
    };
  
    return (

      <>
      <NavScroll isAdmin={isAdmin} />
      <Container>
        <br />
        <h1>Lista de Salas</h1>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Capacidade</th>
                <th>Status</th>
                <th colSpan={2}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Salas.map((item) => (
                <tr key={item.nome}>
                  <td>{item.nome}</td>
                  <td>{item.capacidade}</td>
                  <td>{item.status_da_sala}</td>

                  <td>
                    <Button variant="primary" onClick={() => handleEditClick(item)}>
                      Editar
                    </Button>
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteClick(item)}>
                      Deletar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>

      {selectedUsuario && (
        <ModalSala
          show={modalShow}
          onHide={() => setModalShow(false)}
          sala={selectedUsuario}
        />
      )}

      {selectedUsuario && (
        <ModalDeleteSalaConfirmacao
          show={DeletemodalShow}
          onHide={() => setDeleteModalShow(false)}
          sala={selectedUsuario}
        />
      )}

      <Footer />
      </>
    );
  }

export default SalasList