import { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Footer from "../../components/footer";
import ModalUser from "../../components/modalUser";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";

interface Usuario {
  nome: string;
  login: string;
  matricula?: string;
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <NavScroll isAdmin={isAdmin} />
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Login</th>
            <th>Faculdade</th>
            <th>Setor</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((item) => (
            <tr key={item.login}>
              <td>{item.nome}</td>
              <td>{item.login}</td>
              <td>{item.faculdade}</td>
              <td>{item.setor}</td>
              <td>{item.role}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditClick(item)}>
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedUsuario && (
        <ModalUser
          show={modalShow}
          onHide={() => setModalShow(false)}
          usuario={selectedUsuario}
        />
      )}

      <Footer />
    </>
  );
}

export default UsuariosList;
