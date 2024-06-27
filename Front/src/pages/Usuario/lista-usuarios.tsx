import { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import ModalUser from "../../components/UsuarioModals/modalUser";
import ModalDeleteUserConfirmacao from "../../components/UsuarioModals/modelDelete";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";
import './lista.css';

interface Usuario {
  nome: string;
  login: string;
  matricula: string;
  telefone?: string;
  senha?: string;
  role?: string;
  setor?: string;
  faculdade?: string;
}

function UsuariosList() {
  
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const api = useAPI();
  const auth = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  // Paginação 
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPorPage, setUsuariosPorPage] = useState(5);
  const [paginaCorrente, setPaginaCorrente] = useState(0);
  const paginas = Math.ceil(usuarios.length / usuariosPorPage);  
  const startIndex = paginaCorrente * usuariosPorPage;
  const endIndex = startIndex + usuariosPorPage;
  const usuariosCorrente = usuarios.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.ListaDeUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [api]);

  useEffect(() => {
    if (auth.user) {
      setIsAdmin(auth.user.role === 'ADMIN');
    }
  }, [auth.user]);

  const handleEditClick = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setModalShow(true);
  };

  const handleDeleteClick = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
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
      <h1 className="titulo">Lista de Usuários</h1>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Login</th>
              <th>Faculdade</th>
              <th>Matrícula</th>
              <th>Setor</th>
              <th>Role</th>
              <th colSpan={2}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosCorrente.map(item => (
              <tr key={item.matricula}>
                <td>{item.nome}</td>
                <td>{item.login}</td>
                <td>{item.faculdade}</td>
                <td>{item.matricula}</td>
                <td>{item.setor}</td>
                <td>{item.role}</td>
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
        <ModalUser
          show={modalShow}
          onHide={() => setModalShow(false)}
          usuario={selectedUsuario}
        />
      )}

      {selectedUsuario && (
        <ModalDeleteUserConfirmacao
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
          usuario={selectedUsuario}
        />
      )}
    </>
  );
}

export default UsuariosList;
