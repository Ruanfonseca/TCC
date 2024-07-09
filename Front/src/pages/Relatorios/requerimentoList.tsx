import React from 'react';

interface Requerimento {
  sala: string;
  horarioInicial: string;
  horarioFinal: string;
  data: string;
  motivoJustificativa: string;
}

interface RequerimentoListProps {
  requerimentos: Requerimento[];
}

const RequerimentoList: React.FC<RequerimentoListProps> = ({ requerimentos }) => {
  return (
    <div>
      <h1>Relatório de Requerimentos</h1>
      <table cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Sala</th>
            <th>Horário Inicial</th>
            <th>Horário Final</th>
            <th>Data</th>
            <th>Motivo/Justificativa</th>
          </tr>
        </thead>
        <tbody>
          {requerimentos.map((req, index) => (
            <tr key={index}>
              <td>{req.sala}</td>
              <td>{req.horarioInicial}</td>
              <td>{req.horarioFinal}</td>
              <td>{req.data}</td>
              <td>{req.motivoJustificativa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequerimentoList;
