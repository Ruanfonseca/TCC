import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../assets/logouerj.png';
import { AuthContext } from '../contexts/Auth/AuthContext';
import './styles.css';

interface NavScrollProps {
  isAdmin?: boolean;
}

function NavScroll({ isAdmin }: NavScrollProps) {
  const auth = useContext(AuthContext);

  const handleLogout = async () => {
    await auth.signout();
    window.location.href = window.location.href;
  };

  return (
    <Navbar expand="lg" className="bg-dark navbar-dark">
      <Container fluid>
        <Navbar.Brand href="#">
          <a href='/home'><img src={Logo} className='imagemLogo' alt="Logo" /></a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/home">Home</Nav.Link>
            {isAdmin && (
              <>
                <Nav.Link href="/home/usuarioList">Usuários</Nav.Link>

                <NavDropdown title="Listas" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="/home/salaList">Salas Cadastradas</NavDropdown.Item>
                  <NavDropdown.Item href="/home/horarioList">Horarios Cadastrados</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">Requerimentos</NavDropdown.Item>
                  <NavDropdown.Item href="#action5">Agenda</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Cadastrar" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="/home/form-sala">Sala</NavDropdown.Item>
                  <NavDropdown.Item href="/home/form-horario">Horário</NavDropdown.Item>
                  <NavDropdown.Item href="/home/form-usuario">Usuário</NavDropdown.Item>
                  <NavDropdown.Item href="/home/form-professor">Professor</NavDropdown.Item>
                </NavDropdown>
              
              </>
            )}
            <Nav.Link href="/home">Requerimento SALA</Nav.Link>
            
            <Nav.Link href="https://www.uerj.br/" target='_blank'>Portal UERJ</Nav.Link>
            
            <Nav.Link href="/home/suporte">Suporte</Nav.Link>
          
          </Nav>
          <Navbar.Text className="me-4">
            Usuario logado: <a href="#login">{auth.user?.nome}</a>
          </Navbar.Text>

          <Button variant="outline-light" onClick={handleLogout}>Sair</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScroll;
