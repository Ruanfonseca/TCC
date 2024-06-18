import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import Footer from '../../components/footer';
import NavScroll from '../../components/navbar';
import { AuthContext } from '../../contexts/Auth/AuthContext';

export const Home = () => {
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
                            <form className="form-inline" method="post">
                                <div className="row form-group justify-content-center w-100 p-2">
                                    <div className="col col-14 col-md-2">
                                        <label htmlFor="cars" className="my-3 p-2 w-100">
                                            <h5>Tipo de busca:</h5>
                                        </label>
                                    </div>
                                    <div className="col col-14 col-md-2">
                                        <select name="nome" id="nome" className="custom-select my-3 p-2 w-100" required>
                                            <option value="">Escolher...</option>
                                            <option value="nomefuncionario">Funcionário</option>
                                            <option value="nomeauxiliar">Auxiliar</option>
                                            <option value="cpfrequerimento">Requerimento</option>
                                        </select>
                                    </div>
                                    <div className="col col-14 col-md-4">
                                        <input
                                            className="form-control form-control-lg my-3 p-2 w-100"
                                            type="search"
                                            placeholder="Insira sua pesquisa..."
                                            aria-label="Pesquisar"
                                            name="buscar"
                                            id="buscar"
                                            required
                                        />
                                        <small>
                                            * Digite o cpf para buscar requerimentos.
                                            <br />* Digite o cpf para buscar auxiliares.
                                            <br />* Digite a matricula para buscar funcionário.
                                        </small>
                                    </div>
                                    <div className="col col-14 col-md-2">
                                        <button className="btn btn-primary my-3 p-2 w-100" type="submit">Pesquisar</button>
                                    </div>
                                </div>
                            </form>
                            <div className="row form-group justify-content-center w-100 p-2">
                                <h4>
                                    <i><span>{/* Mensagem dinâmica aqui */}</span></i>
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
