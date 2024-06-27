/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { RequerimentoDTO } from '../../types/Dtos/RequerimentoDTO';
import ModalReqFinalizado from './modalReqFinalizado';


interface ModalAgendaProps {
  show: boolean;
  onHide: () => void;
  requerimento: RequerimentoDTO | null;
}

const ModalAgenda: React.FC<ModalAgendaProps> = ({ show, onHide, requerimento }) => {
  if (!requerimento) return null;

  const [selectedReq, setSelectedReq] = useState<RequerimentoDTO | null>(null);
  const [modalShow, setModalShow] = useState(false);
  
  const handleEditClick = (req: RequerimentoDTO) => {
    setSelectedReq(req);
    setModalShow(true);
  };
  return (
    <>
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Requerimento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Sala:</strong> {requerimento.sala}</p>
        <p><strong>Horário:</strong> {requerimento.horarioInicial} - {requerimento.horarioFinal}</p>
        <p><strong>Data:</strong> {requerimento.data}</p>
        <p><strong>Matrícula:</strong> {requerimento.matricula}</p>
        <p><strong>Nome:</strong> {requerimento.nome}</p>
        <p><strong>Email:</strong> {requerimento.email}</p>
        <p><strong>Telefone:</strong> {requerimento.telefone}</p>
        <p><strong>Motivo Justificativa:</strong> {requerimento.motivoJustificativa}</p>
        <p><strong>Status:</strong> {requerimento.status}</p>
        <p><strong>Nome do Funcionário:</strong> {requerimento.nomeFunc}</p>
        <p><strong>Matrícula do Funcionário:</strong> {requerimento.matriculaFunc}</p>
        <p><strong>Retorno:</strong> {requerimento.retorno}</p>
        <p><strong>Código:</strong> {requerimento.codigo}</p>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={() => handleEditClick(requerimento)}>
                        Editar
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>

    {selectedReq && (
          <ModalReqFinalizado
            show={modalShow}
            onHide={() => setModalShow(false)}
            requerimento={selectedReq}
          />
        )}

    </>
  );
};

export default ModalAgenda;
