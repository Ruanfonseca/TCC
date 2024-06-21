import arSaLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import frLocale from 'date-fns/locale/fr';
import ruLocale from 'date-fns/locale/ru';
import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";

interface Horario {
  nome: string;
  periodo: string;
  horaInicio: string;
  horaFim: string;
}

const localeMap = {
  en: enLocale,
  fr: frLocale,
  ru: ruLocale,
  ar: arSaLocale,
};

const CadastroHorario: React.FC = () => {
  const api = useAPI();

  const [horario, setHorario] = useState<Horario>({
    nome: '',
    periodo: '',
    horaInicio: '',
    horaFim: '',
  });

  const [locale, setLocale] = useState<keyof typeof localeMap>('ru');

  const resetForm = () => {
    setHorario({
      nome: '',
      periodo: '',
      horaInicio: '',
      horaFim: '',
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
          alert('Horario salvo!');
          resetForm();
      } else {
          alert("Horario já cadastrado !");
      }
  } catch (error) {

      console.error(error);
  
    }


    resetForm();
  };

  const selectLocale = (newLocale: keyof typeof localeMap) => {
    setLocale(newLocale);
  };

  if (loading) {
    return <div>Carregando ...</div>;
  }

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
                <i>* Nome do Horario ex.: M1,M2,T1,N1 ..</i>
              </small>
            </div>
          
             
            <div className="form-group">
              <label htmlFor="periodo"><b>Tempo: </b></label>
              <input
                type="text"
                className="form-control"
                value={horario.periodo}
                placeholder="Insira o periodo"
                name="periodo"
                onChange={handleChange}
                required
              />
              <small className="form-text text-muted">
                <i>*Em Minutos</i>
              </small>
            </div>


            <div className="form-group">
              <label htmlFor="horaInicio"><b>Hora Início: </b></label>
              <input
                type="time"
                className="form-control"
                value={horario.horaInicio}
                name="horaInicio"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="horaFim"><b>Hora Fim: </b></label>
              <input
                type="time"
                className="form-control"
                value={horario.horaFim}
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
