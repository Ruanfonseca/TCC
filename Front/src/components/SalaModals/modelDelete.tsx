import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
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
interface Request{
  nome:string;
}

function ModalDeleteSalaConfirmacao({ show, onHide, sala }: ModalUserProps) {
  const api = useAPI();
  const [nome, setNome] = useState<Request>({ nome: '' });

  const handleDelete = async () => {
    try {
      setNome({ nome: sala.nome });
      
      const response = await api.deleteSala({ nome: sala.nome });

      if(response.data){
        console.log('Sala deletada com sucesso:');

        onHide();     
      }else{
        console.log('Não foi possivel deletar');

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
          Confirmar Exclusão de Sala
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tem certeza que deseja excluir a sala <strong>{sala.nome}</strong>?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>Sim</Button>
        <Button  onClick={onHide}>Não</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDeleteSalaConfirmacao;
