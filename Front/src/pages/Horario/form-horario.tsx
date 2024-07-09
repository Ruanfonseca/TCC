import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";
interface Horario {
  nome: string;
  periodo: string;
  horaInicio: string;
  horaFim: string;
}

const CadastroHorario: React.FC = () => {
  const api = useAPI();
  const auth = React.useContext(AuthContext);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [horario, setHorario] = React.useState<Horario>({
    nome: '',
    periodo: '',
    horaInicio: '',
    horaFim: '',
  });

  React.useEffect(() => {
    if (auth.user) {
      setIsAdmin(auth.user.role === 'ADMIN');
      setLoading(false);
    }
  }, [auth.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHorario({
      ...horario,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // const cadastrado = await api.CadastrarHorario(horario);

      // if (cadastrado.data) {
      //   alert('Horário salvo!');
      //   setHorario({
      //     nome: '',
      //     periodo: '',
      //     horaInicio: '',
      //     horaFim: '',
      //   });
      // } else {
      //   alert("Horário já cadastrado!");
      // }

      console.log(horario);
    } catch (error) {
      console.error('Erro ao cadastrar horário:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <NavScroll isAdmin={isAdmin} />
      <div className="container">
        <form method="post" onSubmit={handleSubmit}>
          <h1 className="Titulo">Cadastro de Horário</h1>
          <br />
          <div className="card-login">
            <div className="form-group">
              <label htmlFor="nome"><b>Nome:</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Insira o nome do período"
                name="nome"
                
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="periodo"><b>Tempo:</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Insira o período em minutos"
                name="periodo"
               
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horaInicio"><b>Hora Início:</b></label>
              <input
                type="time"
                className="form-control"
                name="horaInicio"
                
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horaFim"><b>Hora Fim:</b></label>
              <input
                type="time"
                className="form-control"
                name="horaFim"
                
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success btn-submit">Adicionar Horário</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CadastroHorario;
