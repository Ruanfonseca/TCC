import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { UserDTO } from '../../types/Dtos/UserDTO';

interface DetalhesUsuarioModalProps {
  show: boolean;
  onClose: () => void;
  user: UserDTO | null;
}

const DetalhesUsuarioModal: React.FC<DetalhesUsuarioModalProps> = ({ show, onClose, user }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Usuário</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user && (
          <div className="detail-container">
            <p>Nome: {user.nome}</p>
            <p>Role: {user.role}</p>
            <p>Login: {user.login}</p>
            {/* <p>Telefone: {user.telefone}</p>
            {user.role === 'ADMIN' && <p>Setor: {user.setor}</p>}
            {user.role === 'USER' && <p>Faculdade: {user.faculdade}</p>} */}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetalhesUsuarioModal;
