import { Route, Routes } from 'react-router-dom';
import './App.css';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import Agenda from './pages/Agenda/Agenda';
import { Home } from './pages/Home';
import CadastroHorario from './pages/Horario/form-horario';
import HorariosList from './pages/Horario/lista-horarios';
import { Login } from './pages/Login';
import CadastroCriarConta from './pages/Login/CriarConta/cadastroCriarConta';
import Recuperacao from './pages/Login/RecuperacaoDeSenha/Recuperacao';
import RecuperacaoEtapa2 from './pages/Login/RecuperacaoDeSenha/RecuperacaoEtapa2';
import CadastroProfessor from './pages/Professor/form-professor';
import FormularioRequerimento from './pages/Requerimento/FormularioRequerimento';
import ReqList from './pages/Requerimento/lista-requerimentos';
import CadastroSala from './pages/Sala/form-sala';
import SalasList from './pages/Sala/lista-salas';
import Suporte from './pages/Suporte/suporte';
import Cadastro from './pages/Usuario/form-usuario';
import UsuariosList from './pages/Usuario/lista-usuarios';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/home/form-usuario" element={<RequireAuth><Cadastro /></RequireAuth>} />
        <Route path="/home/form-professor" element={<RequireAuth><CadastroProfessor /></RequireAuth>} />
        <Route path="/home/form-sala" element={<RequireAuth><CadastroSala/></RequireAuth>} />
        <Route path="/home/form-horario" element={<RequireAuth><CadastroHorario/></RequireAuth>} />
        <Route path="/home/form-requerimento" element={<RequireAuth><FormularioRequerimento/></RequireAuth>} />
        <Route path="/home/Agenda" element={<RequireAuth><Agenda/></RequireAuth>} />
        
        {/***************************************************************************************/}
        <Route path="/home/requerimentoList" element={<RequireAuth><ReqList/></RequireAuth>} />
        <Route path="/home/usuarioList" element={<RequireAuth><UsuariosList/></RequireAuth>} />
        <Route path="/home/salaList" element={<RequireAuth><SalasList/></RequireAuth>} />
        <Route path="/home/horarioList" element={<RequireAuth><HorariosList/></RequireAuth>} />
        <Route path="/home/suporte" element={<RequireAuth><Suporte /></RequireAuth>} />
        {/***************************************************************************************/}
        <Route path="/criarConta" element={<CadastroCriarConta />} />
        <Route path="/recuperacao" element={<Recuperacao />} />
        <Route path="/recuperacao/segundaetapa" element={<RecuperacaoEtapa2 />} />
      </Routes>
    </div>
  );
}

export default App;
