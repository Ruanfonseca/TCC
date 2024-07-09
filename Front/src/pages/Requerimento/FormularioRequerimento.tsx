import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import NavScroll from '../../components/navbar';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useAPI } from '../../hooks/useAPI';
import { Horario } from '../../types/Horario';
import { Sala } from '../../types/Sala';
import { GeradordeCodigo } from '../../utils/utils';
import HorarioSelect from './components/HorarioSelect';
import SalaSelect from './components/SalaSelect';
import './requerimento.css';

interface Requerimento {
    sala: Sala;
    horarioInicial: Horario;
    horarioFinal: Horario;
    data:string;
    matricula: string;
    nome: string;
    email: string;
    telefone: string;
    motivoJustificativa: string;
    status?:string;
    codigo:string;
}

const FormularioRequerimento: React.FC = () => {
    const [formData, setFormData] = useState<Requerimento>({
        sala: { nome: '', capacidade: '0', status_da_sala: '' },
        horarioInicial: {
            nome: '', horaInicio: '', periodo: '',
            horaFim: ''
        },
        horarioFinal: {
            nome: '', horaFim: '', periodo: '',
            horaInicio: ''
        },
        matricula: '',
        nome: '',
        email: '',
        data:'',
        telefone: '',
        motivoJustificativa: '',
        status:'P',
        codigo:''

    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = useContext(AuthContext);
    const api = useAPI(); 

    useEffect(() => {
        if (auth.user) {
            setIsAdmin(auth.user.role === 'ADMIN');
            setLoading(false);
        }
    }, [auth.user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSalaSelect = (sala: Sala) => {
        setFormData({
            ...formData,
            sala: sala,
        });
    };

    const handleHorarioInicialSelect = (horario: Horario) => {
        setFormData({
            ...formData,
            horarioInicial: horario,
        });
    };

    const handleHorarioFinalSelect = (horario: Horario) => {
        setFormData({
            ...formData,
            horarioFinal: horario,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            formData.codigo = GeradordeCodigo();
            // Simule o envio para a API
           // const cadastrado = await api.CadastrarRequerimento(formData); // Substitua por seu método de API adequado
            
            if (formData) {
                console.log(formData)
                setFormData({
                    sala: { nome: '', capacidade: '0', status_da_sala: '' },
                    horarioInicial: {
                        nome: '', horaInicio: '', periodo: '',
                        horaFim: ''
                    },
                    horarioFinal: {
                        nome: '', horaFim: '', periodo: '',
                        horaInicio: ''
                    },
                    matricula: '',
                    nome: '',
                    data:'',
                    email: '',
                    telefone: '',
                    motivoJustificativa: '',
                    codigo:''
                });
            } else {
                alert('Erro ao enviar requerimento');
            }
        } catch (error) {
            console.error('Erro ao cadastrar requerimento:', error);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            <NavScroll isAdmin={isAdmin} />

            <div className='containerReq'>
                <Form onSubmit={handleSubmit}>
                    <h1 className='Titulo'>Requerimento</h1>
                    <br />

                    <div className="card-loginReq p-4">
                        <SalaSelect onSelect={handleSalaSelect} />

                        <HorarioSelect nome='Inicial' onSelect={handleHorarioInicialSelect} />

                        <HorarioSelect nome='Final' onSelect={handleHorarioFinalSelect} />

                        <Form.Group className="mb-3">
                            <Form.Label>Data</Form.Label>
                            <Form.Control
                                type="date"
                                name="data"
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                placeholder="Insira seu nome"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                onChange={handleChange}
                                placeholder="email@example.com"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Matrícula</Form.Label>
                            <Form.Control
                                type="text"
                                name="matricula"
                                onChange={handleChange}
                                placeholder="Ex.: 201923307011"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Telefone</Form.Label>
                            <InputMask
                                mask="(99) 99999-9999"
                                className="form-control"
                                name="telefone"
                                onChange={handleChange}
                                placeholder="Insira o seu número de celular"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Motivo/Justificativa</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="motivoJustificativa"
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="btn-submit">
                            Enviar
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default FormularioRequerimento;
