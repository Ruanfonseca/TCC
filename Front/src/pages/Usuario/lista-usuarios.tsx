import { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import ModalUser from "../../components/UsuarioModals/modalUser";
import ModalDeleteUserConfirmacao from "../../components/UsuarioModals/modelDelete";
import Footer from "../../components/footer";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";
import './lista.css';

interface Usuario {
  nome: string;
  login: string;
  matricula: string;
  telefone?:string;
  senha?:string,
  role?: string;
  setor?: string;
  faculdade?: string;
}

function UsuariosList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const api = useAPI();
  const auth = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [modalShow, setModalShow] = useState(false);
  const [DeletemodalShow, setDeleteModalShow] = useState(false);

  useEffect(() => {
    api.ListaDeUsuarios()
      .then(response => {
        setUsuarios(response);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao renderizar os dados:', error);
      });

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
              {usuarios.map((item) => (
                <tr key={item.login}>
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


      {selectedUsuario && (
        <ModalUser
          show={modalShow}
          onHide={() => setModalShow(false)}
          usuario={selectedUsuario}
        />
      )}

      {selectedUsuario && (
        <ModalDeleteUserConfirmacao
          show={DeletemodalShow}
          onHide={() => setDeleteModalShow(false)}
          usuario={selectedUsuario}
        />
      )}

      <Footer />
    </>
  );
}

export default UsuariosList;
