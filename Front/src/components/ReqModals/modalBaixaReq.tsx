import { useState } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import { useAPI } from "../../hooks/useAPI";

interface Req {
    sala: string;
    horarioInicial: string;
    horarioFinal: string;
    data: string;
    matricula: string;
    nome: string;
    email: string;
    telefone: string;
    motivoJustificativa: string;
    status?: string;
    nomeFunc?: string;
    matriculaFunc?: string;
    retorno?: string;
}

interface ModalReqProps {
    show: boolean;
    onHide: () => void;
    requerimento: Req;
}

function ModalBaixaReq({ show, onHide, requerimento }: ModalReqProps) {
    const [sala, setSala] = useState(requerimento.sala);
    const [horarioInicial, setHorarioInicial] = useState(requerimento.horarioInicial);
    const [horarioFinal, setHorarioFinal] = useState(requerimento.horarioFinal);
    const [data, setData] = useState(requerimento.data);
    const [matricula, setMatricula] = useState(requerimento.matricula);
    const [nome, setNome] = useState(requerimento.nome);
    const [email, setEmail] = useState(requerimento.email);
    const [telefone, setTelefone] = useState(requerimento.telefone);
    const [motivoJustificativa, setMotivoJustificativa] = useState(requerimento.motivoJustificativa);
    const [status, setStatus] = useState(requerimento.status);
    const [nomeFunc, setNomeFunc] = useState(requerimento.nomeFunc);
    const [matriculaFunc, setMatriculaFunc] = useState(requerimento.matriculaFunc);
    const [retorno, setRetorno] = useState(requerimento.retorno);

    const api = useAPI();

    const handleSubmit = async () => {
        const requerimentoAtualizado = {
            sala,
            horarioInicial,
            horarioFinal,
            data,
            matricula,
            nome,
            email,
            telefone,
            motivoJustificativa,
            status,
            nomeFunc,
            matriculaFunc,
            retorno
        };

        try {
            // const response = await api.SalvarSalaEditada(requerimentoAtualizado);

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
                      Dar Baixa em Requerimento
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                    <Form.Group controlId="formSala">
                        <Form.Label>Sala</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={sala}
                            onChange={(e) => setSala(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formHorarioInicial">
                        <Form.Label>Horário Inicial</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={horarioInicial}
                            onChange={(e) => setHorarioInicial(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formHorarioFinal">
                        <Form.Label>Horário Final</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={horarioFinal}
                            onChange={(e) => setHorarioFinal(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formData">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            type="date"
                            defaultValue={data}
                            onChange={(e) => setData(e.target.value)}
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

                    <Form.Group controlId="formNome">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            defaultValue={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <Form.Group controlId="formMotivoJustificativa">
                        <Form.Label>Motivo/Justificativa</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            defaultValue={motivoJustificativa}
                            onChange={(e) => setMotivoJustificativa(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="P">Pendente</option>
                            <option value="D">Deferido</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formNomeFunc">
                        <Form.Label>Nome do Funcionário</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={nomeFunc}
                            onChange={(e) => setNomeFunc(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formMatriculaFunc">
                        <Form.Label>Matrícula do Funcionário</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={matriculaFunc}
                            onChange={(e) => setMatriculaFunc(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formRetorno">
                        <Form.Label>Retorno para o Professor</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            defaultValue={retorno}
                            onChange={(e) => setRetorno(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>Fechar</Button>
                <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalBaixaReq;
