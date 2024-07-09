import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

interface RelatorioFormProps {
  matricula: string;
  startDate: string;
  endDate: string;
  setMatricula: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}

const RelatorioForm: React.FC<RelatorioFormProps> = ({
  matricula,
  startDate,
  endDate,
  setMatricula,
  setStartDate,
  setEndDate,
  handleSearch,
}) => {
  return (
    <Form>
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
      <Button variant="primary" onClick={handleSearch}>
        Pesquisar
      </Button>
    </Form>
  );
};

export default RelatorioForm;
