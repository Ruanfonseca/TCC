import { useContext, useEffect, useState } from "react";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";


interface Horario {
  nome: string;
  periodo:string;
}

const CadastroHorario: React.FC = () => {

  const api = useAPI();

  const [horario, setHorario] = useState<Horario>({
      nome: '',
      periodo: '',
  });

  const resetForm = () => {
      setHorario({
          nome: '',
          periodo: ''
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
      setHorario({
          ...horario,
          [name]: value
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
          const cadastrado = await api.CadastrarHorario(horario);
          
          if (cadastrado.data) {
              alert('Horario cadastrado');
              resetForm();
          } else {
              alert("Horario já cadastrado !");
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
                  <h1 className="Titulo">Cadastro de Horario</h1>
                  <br />
                  <div className="card-login">

                      <div className="form-group">
                          <label htmlFor="nome"><b>Nome: </b></label>
                          <input
                              type="text"
                              className="form-control"
                              value={horario.nome}
                              placeholder="Insira o nome do periodo"
                              name="nome"
                              onChange={handleChange}
                              required
                          />
                          <small className="form-text text-muted">
                              <i>* Nome do Horario ex.: M1,M2,T1,N1 ..</i></small>
                      </div>

                      <div className="form-group">
                          <label htmlFor="periodo"><b>Periodo: </b></label>
                          <input
                              type="text"
                              className="form-control"
                              value={horario.periodo}
                              placeholder="Insira o periodo de tempo"
                              name="periodo"
                              onChange={handleChange}
                              required
                          />
                          <small className="form-text text-muted">
                              <i>*Periodo correspondente,ex.:07:00 - 07:50 ..</i></small>
                      </div>

                      <button type="submit" className="btn btn-success btn-submit">Adicionar Horário</button>
                  </div>

              </form>
          </div>

      </>
  );
}

export default CadastroHorario;