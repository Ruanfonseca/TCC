import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import './detail.css';

const Detail: React.FC = () => {

  const auth = useContext(AuthContext);
  
  const handleLogout = async () => {
    await auth.signout();
    window.location.href = window.location.href;
  };

  
  return (
    <div className="detail-container">
      <h2>Detalhes do Usuário</h2>
        
        <p>Nome: {auth.user?.nome}</p>
        <p>Matrícula: {auth.user?.matricula}</p>
        <p>Login: {auth.user?.login}</p>
        <p>Telefone: {auth.user?.telefone}</p>
        {
            auth.user?.role === 'ADMIN' && <p>Setor: {auth.user?.setor}</p>
        }
        {
            auth.user?.role==='USER' && <p>Faculdade: {auth.user?.faculdade}</p>
        }
        
        <Button variant="outline-dark" onClick={handleLogout}>Deslogar</Button>
      
      
    </div>
  );
};

export default Detail;
