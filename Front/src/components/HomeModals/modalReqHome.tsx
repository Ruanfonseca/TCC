import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { RequerimentoDTO } from '../../types/Dtos/RequerimentoDTO';

interface DetalhesRequerimentoModalProps {
  show: boolean;
  onClose: () => void;
  requerimento: RequerimentoDTO | null;
}

const DetalhesRequerimentoModal: React.FC<DetalhesRequerimentoModalProps> = ({ show, onClose, requerimento }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Requerimento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {requerimento && (
          <div className="detail-container">
            <p>Sala: {requerimento.sala}</p>
            <p>Horário Inicial: {requerimento.horarioInicial}</p>
            <p>Horário Final: {requerimento.horarioFinal}</p>
            <p>Data: {requerimento.data}</p>
            <p>Matrícula: {requerimento.matricula}</p>
            <p>Nome: {requerimento.nome}</p>
            <p>Email: {requerimento.email}</p>
            <p>Telefone: {requerimento.telefone}</p>
            <p>Motivo/Justificativa: {requerimento.motivoJustificativa}</p>
            {requerimento.status && <p>Status: {requerimento.status}</p>}
            {requerimento.nomeFunc && <p>Nome do Func: {requerimento.nomeFunc}</p>}
            {requerimento.matriculaFunc && <p>Matrícula do Func: {requerimento.matriculaFunc}</p>}
            {requerimento.retorno && <p>Retorno: {requerimento.retorno}</p>}
            {requerimento.codigo && <p>Código: {requerimento.codigo}</p>}
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

export default DetalhesRequerimentoModal;
