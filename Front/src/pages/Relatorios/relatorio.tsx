import React, { useRef, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import RelatorioModal from '../../components/RelatorioModals/RelatorioModal';
import RelatorioForm from './relatorioForm';
import RequerimentoList from './requerimentoList';

const Relatorios: React.FC = () => {
  const [matricula, setMatricula] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [requerimentos, setRequerimentos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    const dummyRequerimentos = [
      { sala: '101', horarioInicial: '08:00', horarioFinal: '10:00', data: '2024-07-01', motivoJustificativa: 'Reunião' },
      { sala: '202', horarioInicial: '10:00', horarioFinal: '12:00', data: '2024-07-02', motivoJustificativa: 'Aula' },
    ];
    setRequerimentos(dummyRequerimentos);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Container>
      <h1>Gerar Relatório</h1>
      <RelatorioForm
        matricula={matricula}
        startDate={startDate}
        endDate={endDate}
        setMatricula={setMatricula}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleSearch={handleSearch}
      />
      <div style={{ marginTop: 20 }}>
        <Button variant="success" onClick={handleOpenModal}>
          Ver Relatório
        </Button>
      </div>
      <RelatorioModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        matricula={matricula}
        startDate={startDate}
        endDate={endDate}
        requerimentos={requerimentos}
        componentRef={componentRef}
      />
      <RequerimentoList requerimentos={requerimentos} />
    </Container>
  );
};

export default Relatorios;
