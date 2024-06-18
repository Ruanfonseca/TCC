import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import Footer from '../../components/footer';
import NavScroll from '../../components/navbar';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useAPI } from '../../hooks/useAPI';
import { UserDTO } from '../../types/Dtos/UserDTO';
import { VerificaMatricula } from '../../utils/utils';



export const Home = () => {
    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState('');
    const [selecao, setSelecao] = useState('matrícula');
    const [resultado, setResultado] = useState<any | null>(null);
    
    const api = useAPI();

    const [usuario, setUsuario] = useState<UserDTO>({
        nome: '',
        login: '',
        role: ''
    });

    useEffect(() => {
        if (auth.user) {
            setIsAdmin(auth.user.role === 'ADMIN');
            setLoading(false);
        }
    }, [auth.user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'selecao':
                setSelecao(value);    
                break;
        
            default:
                setInput(value);
                break;
        }
        
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        

        if (selecao === 'matrícula') {
            
            if(VerificaMatricula(input))
              setResultado(await api.buscarUsuarioPorMatricula(input))
            else
              alert('Matricula Incorreta !');     

        } else if (selecao === 'cpfrequerimento') {

            setResultado(await api.buscarRequerimentoPorCpf(input))
        
        }
    };

   

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <>
            <NavScroll isAdmin={isAdmin} />
            <div className="container">
                <br /> <br />
                <div className="row">
                    <div className="col">
                        <br /> <br />
                        <div className="card text-center card w-100">
                            <div className="card-header">
                                <h3>Pesquisar no sistema</h3>
                            </div>
                            <form className="form-inline" method="post" onSubmit={handleSubmit}>
                                <div className="row form-group justify-content-center w-100 p-2">
                                    <div className="col col-14 col-md-2">
                                        <label htmlFor="selecao" className="my-3 p-2 w-100">
                                            <h5>Tipo de busca:</h5>
                                        </label>
                                    </div>
                                    <div className="col col-14 col-md-2">
                                        <select
                                            className="custom-select my-3 p-2 w-100"
                                            name="selecao"
                                            value={selecao}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="matrícula">Usuário</option>
                                            <option value="cpfrequerimento">Requerimento</option>
                                        </select>
                                    </div>
                                    <div className="col col-14 col-md-4">
                                        <input
                                            className="form-control form-control-lg my-3 p-2 w-100"
                                            type="search"
                                            placeholder="Insira sua pesquisa..."
                                            aria-label="Pesquisar"
                                            name="input"
                                            id="input"
                                            value={input}
                                            onChange={handleChange}
                                            required
                                        />
                                        <small>
                                            * Digite o cpf para buscar requerimentos.
                                            <br />* Digite a matrícula para buscar Usuário.
                                        </small>
                                    </div>
                                    <div className="col col-14 col-md-2">
                                        <button className="btn btn-primary my-3 p-2 w-100" type="submit">Pesquisar</button>
                                    </div>
                                </div>
                            </form>
                            <div className="row form-group justify-content-center w-100 p-2">
                                <h4>
                                    <i><span>{resultado}</span></i>
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
