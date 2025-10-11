package com.servicepro.alpha.service;

import com.servicepro.alpha.domain.*;
import com.servicepro.alpha.dto.requerimento.RequerimentoBaixaDTO;
import com.servicepro.alpha.dto.requerimento.RequerimentoDTO;
import com.servicepro.alpha.dto.requerimento.RequerimentoResponseDTO;
import com.servicepro.alpha.mensageria.RabbbitMQConstantes;
import com.servicepro.alpha.mensageria.RabbitMQService;
import com.servicepro.alpha.mensageria.template.PayloadSmtp;
import com.servicepro.alpha.repository.ProfessorRepository;
import com.servicepro.alpha.repository.RequerimentoRepository;
import com.servicepro.alpha.repository.SalaRepository;
import com.servicepro.alpha.repository.UsuarioRepository;
import com.servicepro.alpha.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.servicepro.alpha.util.TokenGenerator.generateSalToken;

@Service
public class RequerimentoService {

    @Autowired
    private RequerimentoRepository repository;

    @Autowired
    private UsuarioRepository userRepository;

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private ProfessorRepository profRepository;

    @Autowired
    private RabbitMQService rabbitmqService;

    public List<Requerimento> obterTodosRequerimentos() {
        return repository.findAll();
    }

    public Requerimento obterPorToken(String token) {
        return repository.findByToken(token);
    }

    public Requerimento buscarRequerimento(String dia, Horario horarioInicial, Horario horarioFinal) {
        return repository.findByReq(horarioInicial, horarioFinal, dia);
    }

    public Requerimento buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Requerimento salvarReq(RequerimentoDTO dto) {

        Professor teacher = profRepository.findByMatricula(dto.getRegistration());
        if (teacher == null) {
            return null;
        }


        Requerimento requerimento = new Requerimento();
        requerimento.setScheduleInitial(dto.getScheduleInitial());
        requerimento.setScheduleEnd(dto.getScheduleEnd());
        requerimento.setMateria(dto.getMateria());
        requerimento.setNumberOfPeople(dto.getNumberOfPeople());
        requerimento.setDia(dto.getDia());
        requerimento.setRequiredBy(teacher);
        requerimento.setBlockPrefer(dto.getBlockPrefer());
        requerimento.setTypeOfRoom(dto.getTypeOfRoom());
        requerimento.setRegistration(dto.getRegistration());
        requerimento.setEquipament(dto.getEquipament());
        requerimento.setObservations(dto.getObservations());
        requerimento.setStatus(dto.getStatus());
        requerimento.setToken(generateSalToken());
        requerimento.setCreatedAt(LocalDate.now());
        return repository.save(requerimento);
    }

    public Requerimento atualizarReq(String id, RequerimentoDTO dto) {
        Optional<Requerimento> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return null;
        }

        Requerimento requerimento = optional.get();
        requerimento.setScheduleInitial(dto.getScheduleInitial());
        requerimento.setScheduleEnd(dto.getScheduleEnd());
        requerimento.setMateria(dto.getMateria());
        requerimento.setNumberOfPeople(dto.getNumberOfPeople());
        requerimento.setDia(dto.getDia());
        requerimento.setBlockPrefer(dto.getBlockPrefer());
        requerimento.setTypeOfRoom(dto.getTypeOfRoom());
        requerimento.setRegistration(dto.getRegistration());
        requerimento.setEquipament(dto.getEquipament());
        requerimento.setObservations(dto.getObservations());
        requerimento.setStatus(dto.getStatus());
        requerimento.setUpdatedAt(LocalDate.now());


        return repository.save(requerimento);
    }

    public Requerimento darBaixa(Long id, RequerimentoBaixaDTO dto, Usuario usuarioExistente) {
        Optional<Requerimento> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return null;
        }

        Requerimento requerimento = optional.get();

        requerimento.setStatus(dto.getStatus());
        requerimento.setApprovedBy(dto.getApprovedBy());
        requerimento.setRejectedBy(requerimento.getRejectedBy());
        requerimento.setRejectionReason(dto.getRejectionReason());
        requerimento.setApprovedReason(dto.getApprovedReason());

        if (dto.getRoomId() != null) {
            Sala sala = salaRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Sala não encontrada"));
            requerimento.setRoom(sala);
        }
        requerimento.setUserOfAction(usuarioExistente);

        requerimento.setUpdatedAt(LocalDate.now());


        //enviando os dados para o rabbitmq
        LocalDateTime data = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String dataFormatada = data.format(formatter);

        String mensagem = "O Requerimento com o token " + requerimento.getToken() +
                " foi finalizado no dia " + dataFormatada + ", seu status é " +
                (requerimento.getStatus().equals("approved") ? "Aprovado ,a sala reservada é " + requerimento.getRoom().getName() + ",no  " + requerimento.getRoom().getBlock() : "Reprovado") +
                ", Mensagem da Logística: " +
                (!requerimento.getApprovedReason().isEmpty()
                        ? requerimento.getApprovedReason()
                        : requerimento.getRejectionReason());


        Optional<Professor> professoroptional = profRepository.findById(
                requerimento.getRequiredBy().getId()
        );
        PayloadSmtp msgSMTP = new PayloadSmtp(mensagem, professoroptional.get().getEmail(), professoroptional.get().getNome());


        this.rabbitmqService.enviaMensagem(RabbbitMQConstantes.FILA_SALA, msgSMTP);

        return repository.save(requerimento);
    }

    public Requerimento buscarToken(String token) {

        return repository.findByToken(token);
    }

    public boolean delete(String id) {
        Optional<Requerimento> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return false;
        }
        repository.deleteById(Long.valueOf(id));
        return true;
    }

    public List<Requerimento> obterPorData(String dataSolicitada) {
        return repository.findByDate(dataSolicitada);
    }
}
