import React, { useRef, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import Logo from '../../assets/logouerj.png';
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';
import { useAPI } from '../../hooks/useAPI';
import './relatorios.css';

const Relatorios: React.FC = () => {
  const [matricula, setMatricula] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [requerimentos, setRequerimentos] = useState<any[]>([]);
  const componentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const api = useAPI();

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const dto = {
        matricula,
        dataInicial: startDate,
        dataFinal: endDate
      };
      const data = await api.ListaParaRelatorio(dto);
      setRequerimentos(data);
      handlePrint();
    } catch (error) {
      alert("Erro ao gerar relatório!");
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Navbar isAdmin={true} />
      <Container style={{ marginTop: 40 }}>
        <h1>Gerar Relatório</h1>
        <Form style={{ marginTop: 20 }}>
          <Row>
            <Col>
              <Form.Group controlId="matricula">
                <Form.Label>Matrícula</Form.Label>
                <Form.Control
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>Data de Início</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="endDate">
                <Form.Label>Data de Fim</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
        
        <div style={{ marginTop: 20 }}>
          <Button variant="success" onClick={handleGenerateReport} disabled={loading}>
            {loading ? 'Gerando...' : 'Ver Relatório'}
          </Button>
        </div>
        <div style={{ display: 'none' }}>
          <div ref={componentRef} className='estiloPDF'>

            <img src={Logo} className='imagem' alt="Logo" />
            
            <h2>Relatório de Requerimentos</h2>
            
            <p>Matrícula: {matricula}</p>
            <p>Data de Início: {startDate}</p>
            <p>Data de Fim: {endDate}</p>
            
            {requerimentos.map((req, index) => (
              <div key={index} style={{ textAlign: 'left', marginBottom: '20px' }}>
                <p><strong>Sala:</strong> {req.sala}</p>
                <p><strong>Horário Inicial:</strong> {req.horarioInicial}</p>
                <p><strong>Horário Final:</strong> {req.horarioFinal}</p>
                <p><strong>Data:</strong> {req.data}</p>
                <p><strong>Matrícula:</strong> {req.matricula}</p>
                <p><strong>Nome:</strong> {req.nome}</p>
                <p><strong>Email:</strong> {req.email}</p>
                <p><strong>Telefone:</strong> {req.telefone}</p>
                <p><strong>Motivo/Justificativa:</strong> {req.motivoJustificativa}</p>
                <p><strong>Status:</strong> {req.status}</p>
                <p><strong>Nome Funcionário:</strong> {req.nomeFunc}</p>
                <p><strong>Matrícula Funcionário:</strong> {req.matriculaFunc}</p>
                <p><strong>Retorno:</strong> {req.retorno}</p>
                <p><strong>Código:</strong> {req.codigo}</p>
                <hr />
              </div>
            ))}
          
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Relatorios;
