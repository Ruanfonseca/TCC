import moment from 'moment';
import 'moment/locale/pt-br';
import { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import NavScroll from '../../components/navbar';
import { useAPI } from '../../hooks/useAPI';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import ModalAgenda from '../../components/AgendaModals/modalAgenda';
import { RequerimentoDTO } from '../../types/Dtos/RequerimentoDTO';
import './Agenda.css';



moment.locale('pt-br');


const localizer = momentLocalizer(moment);

const Agenda = () => {
  const [events, setEvents] = useState<RequerimentoDTO[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequerimento, setSelectedRequerimento] = useState<RequerimentoDTO | null>(null);
  const api = useAPI(); 

  useEffect(() => {
    async function fetchEvents() {
      try {
       
        const dataReq = await api.ListaDeReqsFinalizados();

        
        setEvents(dataReq);
      } catch (error) {
        console.error('Erro ao buscar requerimentos:', error);
      }
    }

    fetchEvents();
  }, [api]);

  const handleEventClick = (event: RequerimentoDTO) => {
    setSelectedRequerimento(event);
    setShowModal(true);
  };

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
            localizer={localizer} 
            events={events.map(event => ({
              ...event,
              start: new Date(`${event.data}T${event.horarioInicial}`),
              end: new Date(`${event.data}T${event.horarioFinal}`),
              title: event.sala,
            }))}
            startAccessor="start" 
            endAccessor="end" 
            defaultView="week" 
            selectable={true}
            popup={true}
            style={{ height: 500 }}
            formats={{
              agendaDateFormat: "DD/MM ddd", 
              weekdayFormat: "dddd"  
            }}
            messages={{
              date: "Data",
              time: "Hora",
              event: "Evento",
              allDay: "Dia Todo",
              week: "Semana",
              work_week: "Eventos",
              day: "Dia",
              month: "Mês",
              previous: "Anterior",
              next: "Próximo",
              yesterday: "Ontem",
              tomorrow: "Amanhã",
              today: "Hoje",
              agenda: "Agenda",
              noEventsInRange: "Não há Requerimentos no período.",
              showMore: total => `+${total} mais`
            }}
            onSelectEvent={handleEventClick}
          />
        </div>
      </div>
      <ModalAgenda show={showModal} onHide={handleCloseModal} requerimento={selectedRequerimento} />
    </>
  );
};

export default Agenda;
