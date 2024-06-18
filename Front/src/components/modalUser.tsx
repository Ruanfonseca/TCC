import { Button, Form, Modal } from 'react-bootstrap';

interface Usuario {
  nome: string;
  login: string;
  matricula?: string;
  role?: string;
  setor?: string;
  faculdade?: string;
}

interface ModalUserProps {
  show: boolean;
  onHide: () => void;
  usuario: Usuario;
}

function ModalUser({ show, onHide, usuario }: ModalUserProps) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Editar Usuário
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text" defaultValue={usuario.nome} />
          </Form.Group>
          <Form.Group controlId="formLogin">
            <Form.Label>Login</Form.Label>
            <Form.Control type="text" defaultValue={usuario.login} />
          </Form.Group>
          <Form.Group controlId="formFaculdade">
            <Form.Label>Faculdade</Form.Label>
            <Form.Control type="text" defaultValue={usuario.faculdade} />
          </Form.Group>
          <Form.Group controlId="formSetor">
            <Form.Label>Setor</Form.Label>
            <Form.Control type="text" defaultValue={usuario.setor} />
          </Form.Group>
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control type="text" defaultValue={usuario.role} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Fechar</Button>
        <Button variant="primary">Salvar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalUser;
