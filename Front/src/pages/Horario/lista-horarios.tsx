import { useContext, useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import ModalHorario from "../../components/HorarioModals/modalHorario";
import ModalDeleteHorarioConfirmacao from "../../components/HorarioModals/modelDelete";
import Footer from "../../components/footer";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";

interface Horario{
     nome:string;
     periodo:string;
     horaInicio:string;
     horaFim:string;
  }

const HorariosList = () => {
    const [Horarios, setHorarios] = useState<Horario[]>([]);

    const api = useAPI();

    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [DeletemodalShow, setDeleteModalShow] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);

    const handleEditClick = (horario: Horario) => {
      setSelectedHorario(horario);
      setModalShow(true);
    };
  
    const handleDeleteClick = (horario: Horario) => {
      setSelectedHorario(horario);
      setDeleteModalShow(true);
    };

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
      <Container>
        <br />
        <h1>Lista de Horarios</h1>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Periodo</th>
                <th>Hora Inicio</th>
                <th>Hora Fim</th>
                <th colSpan={2}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Horarios.map((item) => (
                <tr key={item.nome}>
                  <td>{item.nome}</td>
                  <td>{item.periodo}</td>
                  <td>{item.horaInicio}</td>
                  <td>{item.horaFim}</td>

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

      {selectedHorario && (
        <ModalHorario
          show={modalShow}
          onHide={() => setModalShow(false)}
          horario={selectedHorario}
        />
      )}

      {selectedHorario && (
        <ModalDeleteHorarioConfirmacao
          show={DeletemodalShow}
          onHide={() => setDeleteModalShow(false)}
          horario={selectedHorario}
        />
      )}

      <Footer />
      </>
    );
  }

export default HorariosList