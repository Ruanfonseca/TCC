import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { Drawer } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';

import Logo from '../assets/logouerj.png';
import { AuthContext } from '../contexts/Auth/AuthContext';
import Detail from '../pages/Usuario/detalhes';
import './styles.css';

interface NavScrollProps {
  isAdmin?: boolean;
}

function NavScroll({ isAdmin }: NavScrollProps) {
  const [open, setOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState('50%');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDrawerWidth('100%');
      } else if (window.innerWidth < 992) {
        setDrawerWidth('75%');
      } else {
        setDrawerWidth('50%');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDetail = () => {
    setOpen(true);
  };

  const auth = useContext(AuthContext);

  return (
    <>
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
                    <NavDropdown.Item href="/home/horarioList">Horários Cadastrados</NavDropdown.Item>
                    <NavDropdown.Item href="/home/requerimentoList">Requerimentos</NavDropdown.Item>
                    <NavDropdown.Item href="/home/Agenda">Agenda</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Cadastrar" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/home/form-sala">Sala</NavDropdown.Item>
                    <NavDropdown.Item href="/home/form-horario">Horário</NavDropdown.Item>
                    <NavDropdown.Item href="/home/form-usuario">Usuário</NavDropdown.Item>
                    <NavDropdown.Item href="/home/form-professor">Professor</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="/home/relatorio">Relatórios</Nav.Link>
                </>
              )}
              <Nav.Link href="/home/form-requerimento">Requerimento SALA</Nav.Link>
              <Nav.Link href="https://www.uerj.br/" target='_blank'>Portal UERJ</Nav.Link>
              <Nav.Link href="/home/suporte">Suporte</Nav.Link>
              
            </Nav>
            
            <Navbar.Text className="ms-auto">
              Usuário logado: <a className='link' onClick={handleDetail}>{auth.user?.nome}</a>
            </Navbar.Text>
          </Navbar.Collapse>
          
        </Container>
      </Navbar>
      
      <Drawer open={open} onClose={() => setOpen(false)} size={drawerWidth}>
        <Drawer.Body>
          <Detail />
        </Drawer.Body>
      </Drawer>
    </>
  );
}

export default NavScroll;
