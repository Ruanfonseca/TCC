import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';

interface RelatorioModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  matricula: string;
  startDate: string;
  endDate: string;
  requerimentos: any[];
  componentRef: React.RefObject<HTMLDivElement>;
}

const RelatorioModal: React.FC<RelatorioModalProps> = ({
  showModal,
  handleCloseModal,
  matricula,
  startDate,
  endDate,
  requerimentos,
  componentRef
}) => {
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Relatório</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div ref={componentRef}>
          <h2>Relatório de Requerimentos</h2>
          <p>Matrícula: {matricula}</p>
          <p>Data de Início: {startDate}</p>
          <p>Data de Fim: {endDate}</p>
          <ul>
            {requerimentos.map((req, index) => (
              <li key={index}>
                Sala: {req.sala}, Horário: {req.horarioInicial} - {req.horarioFinal}, Data: {req.data}, Motivo: {req.motivoJustificativa}
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Fechar
        </Button>
        <Button variant="success" onClick={handlePrint}>
          Imprimir Relatório
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RelatorioModal;
