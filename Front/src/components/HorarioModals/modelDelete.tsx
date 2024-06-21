import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
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
interface Request{
  nome:string;
}

function ModalDeleteHorarioConfirmacao({ show, onHide, horario }: ModalUserProps) {
  const api = useAPI();
  const [nome, setNome] = useState<Request>({ nome: '' });

  const handleDelete = async () => {
    try {
      setNome({ nome: horario.nome });
      
      const response = await api.deleteSala({ nome: horario.nome });

      if(response.data){
        console.log('Horario deletado com sucesso:');

        onHide();     
      }else{
        console.log('Não foi possivel salvar');

        onHide();
      }
      
    } catch (error) {
      console.error('Erro ao deletar a sala:', error);
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
          Confirmar Exclusão de Horario
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tem certeza que deseja excluir o Horario? <strong>{horario.nome}</strong>?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>Sim</Button>
        <Button  onClick={onHide}>Não</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDeleteHorarioConfirmacao;
