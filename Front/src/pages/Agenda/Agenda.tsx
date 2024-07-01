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


// Configuração inicial do locale para português
moment.locale('pt-br');

// Criação do localizer utilizando o momentLocalizer com o locale configurado
const localizer = momentLocalizer(moment);

const Agenda = () => {
  const [events, setEvents] = useState<RequerimentoDTO[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequerimento, setSelectedRequerimento] = useState<RequerimentoDTO | null>(null);
  const api = useAPI(); // Assumindo que useAPI é uma função customizada para acessar a API

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Simulação de busca de requerimentos
        const dataReq = await api.ListaDeReqsFinalizados();

        // Atualiza o estado com os requerimentos obtidos
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
            localizer={localizer} // Configura o localizer para utilizar o momento localizado
            events={events.map(event => ({
              ...event,
              start: new Date(`${event.data}T${event.horarioInicial}`),
              end: new Date(`${event.data}T${event.horarioFinal}`),
              title: event.sala,
            }))}
            startAccessor="start" // Acessor para o início do evento
            endAccessor="end" // Acessor para o fim do evento
            defaultView="week" // Exibe a visualização padrão como semana
            selectable={true}
            popup={true}
            style={{ height: 500 }}
            formats={{
              agendaDateFormat: "DD/MM ddd", // Formato da data na visualização de agenda
              weekdayFormat: "dddd" // Formato do nome do dia da semana
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
