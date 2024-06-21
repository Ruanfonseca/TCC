import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useAPI } from '../../hooks/useAPI';
import FuncaoVerificaEmail, { VerificaMatricula, VerificaSenha } from '../../utils/utils';

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

function ModalUser({ show, onHide, usuario }: ModalUserProps) {
  const [nome, setNome] = useState(usuario.nome);
  const [login, setLogin] = useState(usuario.login);
  const [matricula, setMatricula] = useState(usuario.matricula);
  const [role, setRole] = useState(usuario.role);
  const [setor, setSetor] = useState(usuario.setor);
  const [senha, setSenha] = useState(usuario.senha);
  const [telefone, setTelefone] = useState(usuario.telefone);
  const [faculdade, setFaculdade] = useState(usuario.faculdade);
  const api = useAPI();

  const handleSubmit = async () => {
    const usuarioAtualizado = {
      nome,
      login,
      matricula,
      role,
      senha,
      telefone,
      setor,
      faculdade,
    };

    try {
      const VerificacaoEmail = FuncaoVerificaEmail(usuarioAtualizado.login);
      const VerificacaoMatricula = VerificaMatricula(usuarioAtualizado.matricula);
      const VerificacaoSenha = VerificaSenha(usuarioAtualizado.senha);
      
    if(VerificacaoEmail && VerificacaoMatricula && VerificacaoSenha){

        const response = await api.SalvarEditado(usuarioAtualizado);

        if(response.status)
              alert('Usuário salvo com sucesso !');
  
        onHide();
      }
     

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
          Editar Usuário
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
          <Form.Group controlId="formLogin">
            <Form.Label>Login</Form.Label>
            <Form.Control 
              type="text" 
              defaultValue={login} 
              onChange={(e) => setLogin(e.target.value)} 
            />
          </Form.Group>
          <Form.Group controlId="formFaculdade">
            <Form.Label>Faculdade</Form.Label>
            <Form.Control 
              type="text" 
              defaultValue={faculdade} 
              onChange={(e) => setFaculdade(e.target.value)} 
            />
          </Form.Group>
          
          <Form.Group controlId="formMatricula">
            <Form.Label>Matrícula</Form.Label>
            <Form.Control 
              type="text" 
              defaultValue={matricula} 
              onChange={(e) => setMatricula(e.target.value)} 
            />
          </Form.Group>

          <Form.Group controlId="formSetor">
            <Form.Label>Setor</Form.Label>
            <Form.Control
              as="select"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
            >
              <option value="ADMIN">LOGÍSTICA</option>
              
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formSenha">
            <Form.Label>Senha</Form.Label>
            <Form.Control 
              type="text" 
              defaultValue={senha} 
              onChange={(e) => setSenha(e.target.value)} 
            />
          </Form.Group>

          <Form.Group controlId="formTelefone">
            <Form.Label>Telefone</Form.Label>
            <Form.Control 
              type="text" 
              defaultValue={telefone} 
              onChange={(e) => setTelefone(e.target.value)} 
            />
            
          </Form.Group>

          
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </Form.Control>
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

export default ModalUser;
