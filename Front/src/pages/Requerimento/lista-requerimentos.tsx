import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import ModalBaixaReq from "../../components/ReqModals/modalBaixaReq";
import ModalReq from "../../components/ReqModals/modalReq";
import Footer from "../../components/footer";
import NavScroll from "../../components/navbar";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useAPI } from "../../hooks/useAPI";
import { StatusDTO } from "../../types/Dtos/StatusDTO";
import './requerimento.css';

interface Requerimento {
    sala: string;         
    horarioInicial: string;
    horarioFinal: string;   
    data: string;
    matricula:string;
    nome:string;   
    email:string;
    telefone:string;   
    motivoJustificativa: string;
    status?:string;
    codigo:string;
}

function ReqList(){
    const [selectedReq, setSelectedReq] = useState<Requerimento | null>(null);
    const api = useAPI();
    const auth = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [BaixaModalShow, setBaixaModalShow] = useState(false);
    
    // Paginação
    const [reqs, setReqs] = useState<Requerimento[]>([]);
    const [reqsPorPage, setReqsPorPage] = useState(5);
    const [paginaCorrente, setPaginaCorrente] = useState(0);

    const paginas = Math.ceil(reqs.length / reqsPorPage);
    const startIndex = paginaCorrente * reqsPorPage;
    const endIndex = startIndex + reqsPorPage;
    const ReqsCorrente = reqs.slice(startIndex, endIndex);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const dto: StatusDTO = {
            status: 'P'
          };
          const data = await api.ListaDeReqs(dto);
          setReqs(data);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };
      fetchData();
    }, [api]);
  
    useEffect(() => {
      if (auth.user) {
        setIsAdmin(auth.user.role === 'ADMIN');
        setLoading(false);
      }
    }, [auth.user]);
  
    if (loading) {
      return <div>Carregando...</div>;
    }
  
    const handleEditClick = (req: Requerimento) => {
      setSelectedReq(req);
      setModalShow(true);
    };
  
    const handleBaixaClick = (req: Requerimento) => {
      setSelectedReq(req);
      setBaixaModalShow(true);
    };
  
    const handleNextPage = () => {
      if (paginaCorrente < paginas - 1) {
        setPaginaCorrente(paginaCorrente + 1);
      }
    };
  
    const handlePreviousPage = () => {
      if (paginaCorrente > 0) {
        setPaginaCorrente(paginaCorrente - 1);
      }
    };
  
    return (
      <>
        <NavScroll isAdmin={isAdmin} />
        <br />
        <h1 className="titulo">Lista de Requerimentos Pendentes</h1>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Código</th>
                <th>Sala</th>          
                <th>Horario Inicial</th>  
                <th>Horario Final</th>     
                <th>Data Solicitada</th>  
                <th>Matricula do solicitante</th> 
                <th>Nome do Solicitante</th>    
                <th>Email do Solicitante</th> 
                <th>Telefone</th>   
                <th>Justificativa</th> 
                <th>Status</th>
                <th colSpan={2}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ReqsCorrente.map(item => (
                <tr key={item.sala}>
                  <td data-label="Código">{item.codigo}</td>
                  <td data-label="Sala">{item.sala}</td>
                  <td data-label="Horario Inicial">{item.horarioInicial}</td>
                  <td data-label="Horario Final">{item.horarioFinal}</td>
                  <td data-label="Data Solicitada">{item.data}</td>
                  <td data-label="Matricula do solicitante">{item.matricula}</td>
                  <td data-label="Nome do Solicitante">{item.nome}</td>
                  <td data-label="Email do Solicitante">{item.email}</td>
                  <td data-label="Telefone">{item.telefone}</td>
                  <td data-label="Justificativa">{item.motivoJustificativa}</td>
                  <td data-label="Status">{item.status}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditClick(item)}>
                      Editar
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleBaixaClick(item)}>
                      Dar baixa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
  
        <div className="paginacao">
          <Button
            onClick={handlePreviousPage}
            disabled={paginaCorrente === 0}
          >
            Anterior
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={paginaCorrente >= paginas - 1}
          >
            Próximo
          </Button>
        </div>
  
        {selectedReq && (
          <ModalReq
            show={modalShow}
            onHide={() => setModalShow(false)}
            requerimento={selectedReq}
          />
        )}
  
        {selectedReq && (
          <ModalBaixaReq
            show={BaixaModalShow}
            onHide={() => setBaixaModalShow(false)}
            requerimento={selectedReq}
          />
        )}
  
        <Footer />
      </>
    );
}

export default ReqList;
