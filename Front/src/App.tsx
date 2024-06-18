import { Route, Routes } from 'react-router-dom';
import './App.css';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import { Home } from './pages/Home';
import CadastroHorario from './pages/Horario/form-horario';
import HorariosList from './pages/Horario/lista-horarios';
import { Login } from './pages/Login';
import CadastroProfessor from './pages/Professor/form-professor';
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
        
        {/***************************************************************************************/}
        <Route path="/home/usuarioList" element={<RequireAuth><UsuariosList/></RequireAuth>} />
        <Route path="/home/salaList" element={<RequireAuth><SalasList/></RequireAuth>} />
        <Route path="/home/horarioList" element={<RequireAuth><HorariosList/></RequireAuth>} />
        <Route path="/home/suporte" element={<RequireAuth><Suporte /></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default App;
