import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useAPI } from '../../hooks/useAPI';

interface Usuario {
  nome: string;
  login: string;
  matricula: string;
  telefone?:string;
  senha?:string;
  role?: string;
  setor?: string;
  faculdade?: string;
}

interface ModalUserProps {
  show: boolean;
  onHide: () => void;
  usuario: Usuario;
}
interface MatriculaRequest{
  matricula:string;
}

function ModalDeleteUserConfirmacao({ show, onHide, usuario }: ModalUserProps) {
  const api = useAPI();
  const [ReqMatricula, setReqMatricula] = useState<MatriculaRequest>({ matricula: '' });

  const handleDelete = async () => {
    try {
      setReqMatricula({ matricula: usuario.matricula });
      
      const response = await api.deleteUsuario({ matricula: usuario.matricula });

      if(response.data){
        console.log('Usuário deletado com sucesso:');

        onHide();     
      }else{
        console.log('Não foi possivel salvar');

        onHide();
      }
      
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
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
          Confirmar Exclusão de Usuário
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tem certeza que deseja excluir o usuário <strong>{usuario.nome}</strong>?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>Sim</Button>
        <Button  onClick={onHide}>Não</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDeleteUserConfirmacao;
