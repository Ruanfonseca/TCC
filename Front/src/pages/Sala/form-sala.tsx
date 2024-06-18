import { useContext, useEffect, useState } from "react";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";

interface Sala {
    nome: string;
    capacidade: string;
    status_da_sala: string;
}

const CadastroSala: React.FC = () => {

    const api = useAPI();

    const [sala, setSala] = useState<Sala>({
        nome: '',
        capacidade: '0',
        status_da_sala: '',
    });

    const resetForm = () => {
        setSala({
            nome: '',
            capacidade: '0',
            status_da_sala: ''
        });
    };

    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth.user) {
            setIsAdmin(auth.user.role === 'ADMIN');
            setLoading(false);
        }
    }, [auth.user]);

    if (loading) {
        return <div>Carregando ...</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSala({
            ...sala,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const cadastrado = await api.CadastrarSala(sala);
            
            if (cadastrado.data) {
                alert('Sala cadastrada');
                resetForm();
            } else {
                alert("Sala já cadastrada !");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <NavScroll isAdmin={isAdmin} />
            <div className="container">
                <form method="post" onSubmit={handleSubmit}>
                    <h1 className="Titulo">Cadastro de Sala</h1>
                    <br />
                    <div className="card-login">

                        <div className="form-group">
                            <label htmlFor="nome"><b>Nome: </b></label>
                            <input
                                type="text"
                                className="form-control"
                                value={sala.nome}
                                placeholder="Insira o nome da sala"
                                name="nome"
                                onChange={handleChange}
                                required
                            />
                            <small className="form-text text-muted">
                                <i>* Nome da sala</i></small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="capacidade"><b>Capacidade: </b></label>
                            <input
                                type="text"
                                className="form-control"
                                value={sala.capacidade}
                                placeholder="Quantidade de lugares"
                                name="capacidade"
                                onChange={handleChange}
                                required
                            />
                            <small className="form-text text-muted">
                                <i>* Quantidade de lugares</i></small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status_da_sala"><b>Status da Sala:</b></label>
                            <select
                                className="form-select"
                                name="status_da_sala"
                                value={sala.status_da_sala}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="D">Disponível</option>
                            </select>
                            <small className="form-text text-muted">
                                <i>* Status da sala</i></small>
                        </div>

                        <button type="submit" className="btn btn-success btn-submit">Adicionar Sala</button>
                    </div>

                </form>
            </div>

        </>
    );
}

export default CadastroSala;
