import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useAPI } from '../../hooks/useAPI';

interface Horario {
   nome:string;
   periodo:string;
   horaInicio:string;
   horaFim:string;
}

interface ModalUserProps {
  show: boolean;
  onHide: () => void;
  horario: Horario;
}

function ModalHorario({ show, onHide, horario }: ModalUserProps) {
  const [nome, setNome] = useState(horario.nome);
  const [periodo, setPeriodo] = useState(horario.periodo);
  const [horaInicio, setHoraInicio] = useState(horario.horaInicio);
  const [horaFim, setHoraFim] = useState(horario.horaFim);
  
  const api = useAPI();

  const handleSubmit = async () => {
    const horarioAtualizado = {
      nome,
      periodo,
      horaInicio,
      horaFim
    };

    try {
      const response = await api.SalvarHorarioEditado(horarioAtualizado);

     if(response.data)
        alert('Horario editado com sucesso !');

      onHide();

    } catch (error) {
      
      console.error('Erro ao editar o horario:', error);
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
          Editar horario
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
          
          <Form.Group controlId="formPeriodo">
            <Form.Label>Periodo</Form.Label>
            <Form.Control 
              type="text" 
              defaultValue={periodo} 
              onChange={(e) => setPeriodo(e.target.value)} 
            />
          </Form.Group>

          <Form.Group controlId="formHoraInicio">
            <Form.Label>Hora Inicio</Form.Label>
            <Form.Control 
              type="time" 
              defaultValue={horaInicio} 
              onChange={(e) => setHoraInicio(e.target.value)} 
            />
          </Form.Group>

          <Form.Group controlId="formHoraFim">
            <Form.Label>Hora Fim</Form.Label>
            <Form.Control 
              type="time" 
              defaultValue={horaFim} 
              onChange={(e) => setHoraFim(e.target.value)} 
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

export default  ModalHorario;
