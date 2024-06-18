import React, { useContext, useEffect, useState } from 'react';
import NavScroll from '../../components/navbar';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import './stylesfuncionario.css';

const CadastroFuncionario: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    email: '',
    matricula: '',
    tipo: '',
    cpf: ''
  });

  
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
  
  
  
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  


  return (
    <>
     <NavScroll isAdmin={isAdmin} />
      <div className='container'>
        <form method="post" onSubmit={handleSubmit}>
          <h1 className='Titulo'>Cadastro de Funcionário</h1>
          <br />
          <div className="card-login">
          <div className="form-group">
            <label htmlFor="nome"><b>Nome:</b></label>
            <input
              type="text"
              className="form-control"
              value={formData.nome}
              placeholder="Insira o nome do funcionário"
              name="nome"
              onChange={handleChange}
              required
            />
            <small className="form-text text-muted"><i>* Nome completo.</i></small>
          </div>
          <div className="form-group">
            <label htmlFor="data"><b>Data de nascimento:</b></label>
            <input
              type="date"
              value={formData.data}
              name="data"
              className="form-control"
              onChange={handleChange}
              required
            />
            <small className="form-text text-muted"><i>* Dia/Mês/Ano.</i></small>
          </div>
          <div className="form-group">
            <label htmlFor="email"><b>E-mail:</b></label>
            <input
              type="email"
              value={formData.email}
              name="email"
              className="form-control"
              placeholder="email@example.com"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="matricula"><b>Matricula:</b></label>
            <input
              type="text"
              value={formData.matricula}
              name="matricula"
              className="form-control"
              placeholder="Ex.:1923333070"
              pattern="^\d{10}$"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tipo"><b>Setor:</b></label>
            <select
              className="form-select"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um setor</option>
              <option value="COINFO">COINFO</option>
              <option value="LOGISTICA">LOGISTICA</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cpf"><b>CPF:</b></label>
            <input
              type="text"
              value={formData.cpf}
              name="cpf"
              className="form-control"
              placeholder="Ex:17192891740"
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-success btn-submit">Adicionar Funcionário</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CadastroFuncionario;
