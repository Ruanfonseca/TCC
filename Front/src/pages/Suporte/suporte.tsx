import { useContext, useEffect, useState } from 'react';
import Imagem from '../../assets/FAQ.jpg';
import Footer from "../../components/footer";
import NavScroll from "../../components/navbar";
import { AuthContext } from '../../contexts/Auth/AuthContext';
import './suporte.css';


const Suporte = () => {

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
    <div>
      <NavScroll isAdmin={isAdmin}/>
      <div className="containerSuporte">
        <div className="caixaDaImagem">
          <img className="imagem" src={Imagem} alt="Imagem de FAQ"/>
        </div>
        <div>
          <p>Entre em contato em caso de dúvidas ou sugestões
            <br/>
            <a href="mailto:Whitelook22@outlook.com">Email: Whitelook22@outlook.com</a>
          
            <a href="https://wa.me/5521984389640" target="_blank">Whatsapp: +55(21)969232991</a>
            <br/>
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Suporte
