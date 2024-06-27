import { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import ModalSala from "../../components/SalaModals/modalSala";
import ModalDeleteSalaConfirmacao from "../../components/SalaModals/modelDelete";
import Footer from "../../components/footer";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";
import './sala.css';

interface Sala {
  nome: string;
  capacidade: string;
  status_da_sala: string;
}

function SalasList() {
  const [selectedUsuario, setSelectedUsuario] = useState<Sala | null>(null);
  const api = useAPI();
  const auth = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  // Paginação
  const [salas, setSalas] = useState<Sala[]>([]);
  const [salasPorPage, setSalasPorPage] = useState(5);
  const [paginaCorrente, setPaginaCorrente] = useState(0);
  const paginas = Math.ceil(salas.length / salasPorPage);
  const startIndex = paginaCorrente * salasPorPage;
  const endIndex = startIndex + salasPorPage;
  const salasCorrente = salas.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.ListaDeSalas();
        setSalas(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [api]);

  useEffect(() => {
    if (auth.user) {
      setIsAdmin(auth.user.role === 'ADMIN');
      setLoading(false);
    }
  }, [auth.user]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const handleEditClick = (sala: Sala) => {
    setSelectedUsuario(sala);
    setModalShow(true);
  };

  const handleDeleteClick = (sala: Sala) => {
    setSelectedUsuario(sala);
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

  return (
    <>
      <NavScroll isAdmin={isAdmin} />
        <br />
        <h1 className="titulo">Lista de Salas</h1>
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
              {salasCorrente.map(item => (
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

      <div className="paginacao">
        <Button
          onClick={handlePreviousPage}
          disabled={paginaCorrente === 0}
        >
          Anterior
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={paginaCorrente >= paginas - 1}
        >
          Próximo
        </Button>
      </div>

      {selectedUsuario && (
        <ModalSala
          show={modalShow}
          onHide={() => setModalShow(false)}
          sala={selectedUsuario}
        />
      )}

      {selectedUsuario && (
        <ModalDeleteSalaConfirmacao
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
          sala={selectedUsuario}
        />
      )}

      <Footer />
    </>
  );
}

export default SalasList;
