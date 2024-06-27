import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import DetalhesRequerimentoModal from '../../components/HomeModals/modalReqHome';
import DetalhesUsuarioModal from '../../components/HomeModals/modalUsuHome';
import Footer from '../../components/footer';
import NavScroll from '../../components/navbar';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useAPI } from '../../hooks/useAPI';
import { CodigoDTO } from '../../types/Dtos/CodigoDTO';
import { MatriculaRequestDTO } from '../../types/Dtos/MatriculaRequestDTO';
import { VerificaMatricula } from '../../utils/utils';
import './home.css';

export const Home = () => {
  const auth = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const api = useAPI();
  const [input, setInput] = useState<string>('');

  const [selecao, setSelecao] = useState('matrícula');

  const [resultado, setResultado] = useState<any | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRequerimentoModal, setShowRequerimentoModal] = useState(false);

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
      case 'input':
        setInput(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selecao === 'matrícula') {
      if (VerificaMatricula(input)) {
        const user = await api.buscarUsuarioPorMatricula({ matricula: input } as MatriculaRequestDTO);
        setResultado(user);
        
      } else {
        alert('Matrícula Incorreta !');
      }
    } else if (selecao === 'codigo') {
      const code: CodigoDTO = { codigo: input };
      const requerimento = await api.buscarRequerimentoPorCodigo(code);
      setResultado(requerimento);
    }
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setShowRequerimentoModal(false);
    setResultado(null);
  };

  const handleClick = async () => {
    if (selecao === 'matrícula') {
      if (VerificaMatricula(input)) {
        const user = await api.buscarUsuarioPorMatricula({ matricula: input } as MatriculaRequestDTO);
        setResultado(user);
        setShowUserModal(true);
      } else {
        alert('Matrícula Incorreta !');
      }
    } else if (selecao === 'codigo') {
      const code: CodigoDTO = { codigo: input };
      const requerimento = await api.buscarRequerimentoPorCodigo(code);
      setResultado(requerimento);
      setShowRequerimentoModal(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavScroll isAdmin={isAdmin} />
      <div className="container">
        <div className="row">
          <div className="col">
            <br />
            <div className="card text-center card w-100">
              <div className="card-header">
                <h3>Pesquisar no sistema</h3>
              </div>
              <form className="form-inline" method="post" onSubmit={handleSubmit}>
                <div className="row form-group justify-content-center w-100 p-2">
                  <div className="col-12 col-md-3">
                    <label htmlFor="selecao" className="my-3 p-2 w-100">
                      <h5>Tipo de busca:</h5>
                      <small>
                        * Digite o Código para consultar o status do seu Requerimento.
                        <br />* Digite a matrícula para buscar Usuário.
                      </small>
                    </label>
                  </div>
                  <div className="col-12 col-md-3">
                    <select
                      className="custom-select my-3 p-2 w-100"
                      name="selecao"
                      value={selecao}
                      onChange={handleChange}
                      required
                    >
                      <option value="matrícula">Usuário</option>
                      <option value="codigo">Requerimento</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
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
                  </div>
                  <div className="col-12 col-md-2">
                    <button className="btn btn-primary my-3 p-2 w-100" type="submit">
                      Pesquisar
                    </button>
                  </div>
                  <div className="row form-group justify-content-center w-100 p-2">
                  <h4>
                    <i>
                      <a href="#" className="retorno" onClick={handleClick}>
                        {resultado && (resultado.login || resultado.codigo)}
                      </a>
                    </i>
                  </h4>
                </div>
                </div>
                
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <DetalhesUsuarioModal show={showUserModal} onClose={handleCloseModal} user={resultado} />
      <DetalhesRequerimentoModal show={showRequerimentoModal} onClose={handleCloseModal} requerimento={resultado} />
    </>
  );
};
