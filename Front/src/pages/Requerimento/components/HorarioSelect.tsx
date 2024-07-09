import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useAPI } from '../../../hooks/useAPI';
import { Horario } from '../../../types/Horario';
interface HorarioSelectProps {
    onSelect: (horario: Horario) => void;
    nome:string;
}

const HorarioSelect: React.FC<HorarioSelectProps> = ({ onSelect,nome }) => {
    const api = useAPI();
    const [horarios, setHorarios] = useState<Horario[]>([]);

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const data = await api.ListaDeHorarios();
                setHorarios(data);
            } catch (error) {
                console.error("Erro ao buscar horários:", error);
            }
        };
        fetchHorarios();
    }, [api]);

    return (
        <Form.Group className="mb-3">
            <Form.Label>Horário-{nome}</Form.Label>
            <Form.Control as="select" onChange={(e) => onSelect(horarios.find(horario => horario.nome === e.target.value) || {} as Horario)}>
                <option value="">Selecione um horário</option>
                {horarios.map(horario => (
                    <option key={horario.nome} value={horario.nome}>{horario.nome} ({horario.horaInicio} - {horario.horaFim})</option>
                ))}
            </Form.Control>
        </Form.Group>
    );
};

export default HorarioSelect;
