import 'bootstrap/dist/css/bootstrap.min.css';
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
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState<Usuario | null>(null); // Estado separado para deletar usuário
  const api = useAPI();
  const auth = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
  };

  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioParaDeletar(usuario); // Definindo estado separado para deletar usuário
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

  if (loading) {
    return <div>Carregando...</div>;
  }

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
                <td data-label="Nome">{item.nome}</td>
                <td data-label="Login">{item.login}</td>
                <td data-label="Faculdade">{item.faculdade}</td>
                <td data-label="Matrícula">{item.matricula}</td>
                <td data-label="Setor">{item.setor}</td>
                <td data-label="Role">{item.role}</td>
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

      {selectedUsuario && (
        <ModalUser
          show={true}
          onHide={() => setSelectedUsuario(null)}
          usuario={selectedUsuario}
        />
      )}

      {usuarioParaDeletar && (
        <ModalDeleteUserConfirmacao
          show={true}
          onHide={() => setUsuarioParaDeletar(null)}
          usuario={usuarioParaDeletar}
        />
      )}
    </>
  );
}

export default UsuariosList;
