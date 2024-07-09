import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useAPI } from '../../../hooks/useAPI';
import { Sala } from '../../../types/Sala';

interface SalaSelectProps {
    onSelect: (sala: Sala) => void;
}

const SalaSelect: React.FC<SalaSelectProps> = ({ onSelect }) => {
    const api = useAPI();
    const [salas, setSalas] = useState<Sala[]>([]);

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const data = await api.ListaDeSalasDisponiveis();
                setSalas(data);
            } catch (error) {
                console.error("Erro ao buscar salas:", error);
            }
        };
        fetchSalas();
    }, [api]);

    return (
        <Form.Group className="mb-3">
            <Form.Label>Sala</Form.Label>
            <Form.Control as="select" onChange={(e) => onSelect(salas.find(sala => sala.nome === e.target.value) || {} as Sala)}>
                <option value="">Selecione uma sala</option>
                {salas.map(sala => (
                    <option key={sala.nome} value={sala.nome}>{sala.nome}</option>
                ))}
            </Form.Control>
        </Form.Group>
    );
};

export default SalaSelect;
