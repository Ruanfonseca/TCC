import { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import ModalHorario from "../../components/HorarioModals/modalHorario";
import ModalDeleteHorarioConfirmacao from "../../components/HorarioModals/modelDelete";
import Footer from "../../components/footer";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";

interface Horario {
  nome: string;
  periodo: string;
  horaInicio: string;
  horaFim: string;
}

const HorariosList = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const api = useAPI();
  const auth = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);

  // Paginação
  const [horariosPorPage, setHorariosPorPage] = useState(5);
  const [paginaCorrente, setPaginaCorrente] = useState(0);
  const paginas = Math.ceil(horarios.length / horariosPorPage);
  const startIndex = paginaCorrente * horariosPorPage;
  const endIndex = startIndex + horariosPorPage;
  const horariosCorrente = horarios.slice(startIndex, endIndex);

  const handleEditClick = (horario: Horario) => {
    setSelectedHorario(horario);
    setModalShow(true);
  };

  const handleDeleteClick = (horario: Horario) => {
    setSelectedHorario(horario);
    setDeleteModalShow(true);
  };

  const handleNextPage = () => {
    if (paginaCorrente < paginas - 1) {
      setPaginaCorrente(paginaCorrente + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginaCorrente > 0) {
      setPaginaCorrente(paginaCorrente - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.ListaDeHorarios();
        setHorarios(response);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [api]);

  useEffect(() => {
    if (auth.user) {
      setIsAdmin(auth.user.role === "ADMIN");
    }
  }, [auth.user]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <NavScroll isAdmin={isAdmin} />
        <br />
        <h1 className="titulo">Lista de Horários</h1>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Período</th>
                <th>Hora Início</th>
                <th>Hora Fim</th>
                <th colSpan={2}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {horariosCorrente.map((item) => (
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


      <div className="paginacao">
        <Button onClick={handlePreviousPage} disabled={paginaCorrente === 0}>
          Anterior
        </Button>
        <Button onClick={handleNextPage} disabled={paginaCorrente >= paginas - 1}>
          Próximo
        </Button>
      </div>

      {selectedHorario && (
        <ModalHorario
          show={modalShow}
          onHide={() => setModalShow(false)}
          horario={selectedHorario}
        />
      )}

      {selectedHorario && (
        <ModalDeleteHorarioConfirmacao
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
          horario={selectedHorario}
        />
      )}

      <Footer />
    </>
  );
};

export default HorariosList;
