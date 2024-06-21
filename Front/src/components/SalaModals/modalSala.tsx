import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useAPI } from '../../hooks/useAPI';

interface Sala {
  nome:string;
   capacidade:string;
   status_da_sala:string;
}

interface ModalUserProps {
  show: boolean;
  onHide: () => void;
  sala: Sala;
}

function ModalSala({ show, onHide, sala }: ModalUserProps) {
  const [nome, setNome] = useState(sala.nome);
  const [capacidade, setCapacidade] = useState(sala.capacidade);
  const [status_da_sala, setStatus_da_sala] = useState(sala.status_da_sala);
  
  const api = useAPI();

  const handleSubmit = async () => {
    const salaAtualizada = {
      nome,
      capacidade,
      status_da_sala
    };

    try {
      const response = await api.SalvarSalaEditada(salaAtualizada);
      
      if(response)
          alert('Sala salva com sucesso !');

      onHide();

    } catch (error) {
      
      console.error('Erro ao salvar o usuário:', error);
    }
  };

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
          Editar Sala
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control 
              type="text" 
              defaultValue={nome} 
              onChange={(e) => setNome(e.target.value)} 
            />
          </Form.Group>
          <Form.Group controlId="formNome">
            <Form.Label>Capacidade</Form.Label>
            <Form.Control 
              type="text" 
              defaultValue={capacidade} 
              onChange={(e) => setCapacidade(e.target.value)} 
            />
          </Form.Group>
          <Form.Group controlId="formNome">
            <Form.Label>Status</Form.Label>
            <Form.Control 
              type="text" 
              defaultValue={status_da_sala} 
              onChange={(e) => setStatus_da_sala(e.target.value)} 
            />
          </Form.Group>
          
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger"  onClick={onHide}>Fechar</Button>
        <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalSala;
