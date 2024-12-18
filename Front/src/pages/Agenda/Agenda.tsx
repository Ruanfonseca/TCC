import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment'; // Importa Moment.js para manipular datas
import 'moment/locale/pt-br'; // Configura o idioma do Moment.js
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'; // Importa o React Big Calendar
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Estilo do calendário
import ModalAgenda from '../../components/AgendaModals/modalAgenda';
import NavScroll from '../../components/navbar';
import { useAPI } from '../../hooks/useAPI';
import { RequerimentoDTO } from '../../types/Dtos/RequerimentoDTO';
import './Agenda.css';

// Configuração do Moment.js para português
moment.locale('pt-br');

// Configuração do localizador de datas para o React Big Calendar
const localizer = momentLocalizer(moment);

const Agenda: React.FC = () => {
  const [events, setEvents] = useState<RequerimentoDTO[]>([]); // Lista de eventos da API
  const [showModal, setShowModal] = useState<boolean>(false); // Estado do modal
  const [selectedRequerimento, setSelectedRequerimento] = useState<RequerimentoDTO | null>(null); // Requerimento selecionado para exibir no modal
  const api = useAPI(); // Hook para acessar a API

  // Função que busca os eventos na API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const dataReq = await api.ListaDeReqsFinalizados(); // Busca os requerimentos finalizados
        setEvents(dataReq);
      } catch (error) {
        console.error('Erro ao buscar requerimentos:', error);
      }
    };

    fetchEvents();
  }, [api]);

  // Função que é chamada ao clicar em um evento no calendário
  const handleEventClick = (event: any) => {
    const requerimento = events.find((req) => req.id === event.id) || null;
    setSelectedRequerimento(requerimento);
    setShowModal(true);
  };

  // Função que fecha o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequerimento(null);
  };

  return (
    <>
      <NavScroll isAdmin={true} />
      <div className="containerAgenda">
        <h1 className="titulo-agenda">Agenda de Requerimentos</h1>
        <div className="calendar-container">
          <Calendar
            localizer={localizer} // Localizador de datas baseado no moment.js
            events={events
              .filter((event) => event.data && event.horarioInicial && event.horarioFinal) // Filtra eventos inválidos
              .map((event) => ({
                title: event.sala || 'Evento sem título', // Título padrão para eventos sem sala
                start: new Date(`${event.data}T${event.horarioInicial}`), // Data de início
                end: new Date(`${event.data}T${event.horarioFinal}`), // Data de fim
              }))}

            startAccessor="start" // Atributo que define o início do evento
            endAccessor="end" // Atributo que define o fim do evento
            style={{ height: 500 }} // Altura do calendário
            messages={{
              next: 'Próximo',
              previous: 'Anterior',
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              agenda: 'Agenda',
            }}
            defaultView="week" // Visualização inicial (semana)
            onSelectEvent={handleEventClick} // Chama função ao clicar no evento
          />
        </div>
      </div>
      {selectedRequerimento && (
        <ModalAgenda
          show={showModal}
          onHide={handleCloseModal}
          requerimento={selectedRequerimento}
        />
      )}
    </>
  );
};

export default Agenda;