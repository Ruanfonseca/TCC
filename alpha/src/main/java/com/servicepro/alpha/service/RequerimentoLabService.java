package com.servicepro.alpha.service;

import com.servicepro.alpha.domain.*;
import com.servicepro.alpha.dto.requerimentoLab.RequerimentoLabDTO;
import com.servicepro.alpha.dto.requerimentoLab.RequerimentoLabResponseDTO;
import com.servicepro.alpha.mensageria.RabbbitMQConstantes;
import com.servicepro.alpha.mensageria.RabbitMQService;
import com.servicepro.alpha.mensageria.template.PayloadSmtp;
import com.servicepro.alpha.repository.LaboratorioRepository;
import com.servicepro.alpha.repository.RequerimentolabRepository;
import com.servicepro.alpha.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.servicepro.alpha.util.TokenGenerator.generateLabToken;

@Service
public class RequerimentoLabService {

    @Autowired
    private RequerimentolabRepository repository;

    @Autowired
    private LaboratorioRepository laboratorioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RabbitMQService rabbitmqService;

    public List<RequerimentoLaboratorio> obterTodosRequerimentos() {
        return repository.findAll();
    }

    public RequerimentoLaboratorio buscarRequerimento(Laboratorio laboratorio, String dia, Horario horarioInicial, Horario horarioFinal) {
        return repository.findByLaboratorioReq(laboratorio,horarioInicial,horarioFinal,dia);
    }
    public RequerimentoLaboratorio obterPorToken(String token) {
        return repository.findByToken(token);
    }

    public RequerimentoLaboratorio buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public RequerimentoLaboratorio salvarReq(RequerimentoLabDTO dto, Professor profExiste) {

        RequerimentoLaboratorio requerimentolab = new RequerimentoLaboratorio();
        requerimentolab.setCurso(dto.getCurso());
        requerimentolab.setDia(dto.getDia());
        requerimentolab.setDisciplina(dto.getDisciplina());
        requerimentolab.setEmailDocente(dto.getEmailDocente());
        requerimentolab.setHorarioInicio(dto.getHorarioInicio());
        requerimentolab.setRequiredBy(profExiste);
        requerimentolab.setHorarioFinal(dto.getHorarioFinal());
        requerimentolab.setMatriculaDocente(dto.getMatriculaDocente());
        requerimentolab.setNomeDocente(dto.getNomeDocente());
        requerimentolab.setNomeTecnicoLaboratorista(dto.getNomeTecnicoLaboratorista());
        requerimentolab.setNumeroAluno(dto.getNumeroAluno());
        requerimentolab.setNumeroGruposAlunos(dto.getNumeroGruposAlunos());
        requerimentolab.setPresencaTecnicoLaboratorista(dto.getPresencaTecnicoLaboratorista());
        requerimentolab.setTipoLab(dto.getTipoLab());
        requerimentolab.setTituloAula(dto.getTituloAula());
        requerimentolab.setUnidadeAcademica(dto.getUnidadeAcademica());
        requerimentolab.setUtilitarios(dto.getUtilitarios());
        requerimentolab.setStatus("pending");
        requerimentolab.setToken(generateLabToken());
        requerimentolab.setConfirmacaoLeitura(dto.getConfirmacaoLeitura());
        requerimentolab.setCreatedAt(LocalDate.now());
        return repository.save(requerimentolab);
    }

    public RequerimentoLaboratorio atualizarReq(String id, RequerimentoLabResponseDTO dto) {
        Optional<RequerimentoLaboratorio> optional = repository.findById(Long.valueOf(id));

        if (optional.isEmpty()) {
            return null;
        }

        RequerimentoLaboratorio requerimento = new RequerimentoLaboratorio();
        requerimento.setNomeDocente(dto.getNomeDocente());
        requerimento.setMatriculaDocente(dto.getMatriculaDocente());
        requerimento.setEmailDocente(dto.getEmailDocente());
        requerimento.setDisciplina(dto.getDisciplina());
        requerimento.setCurso(dto.getCurso());
        requerimento.setUnidadeAcademica(dto.getUnidadeAcademica());
        requerimento.setTituloAula(dto.getTituloAula());
        requerimento.setDia(dto.getDia());
        requerimento.setPresencaTecnicoLaboratorista(dto.getPresencaTecnicoLaboratorista());
        requerimento.setToken(dto.getToken());
        requerimento.setNumeroGruposAlunos(dto.getNumeroGruposAlunos());
        requerimento.setNomeTecnicoLaboratorista(dto.getNomeTecnicoLaboratorista());
        requerimento.setHorarioInicio(dto.getHorarioInicio());
        requerimento.setHorarioFinal(dto.getHorarioFinal());
        requerimento.setLaboratorio(dto.getLaboratorio());
        requerimento.setNumeroAluno(dto.getNumeroAluno());
        requerimento.setUtilitarios(dto.getUtilitarios());
        requerimento.setUpdatedAt(LocalDate.now());


        return repository.save(requerimento);
    }


    public RequerimentoLaboratorio buscarToken(String token) {

        return repository.findByToken(token);
    }

    public boolean delete(String id) {
        Optional<RequerimentoLaboratorio> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return false;
        }
        repository.deleteById(Long.valueOf(id));
        return true;
    }

    public List<RequerimentoLaboratorio> obterPorData(String dataSolicitada) {
        return repository.findByDate(dataSolicitada);
    }

    public RequerimentoLaboratorio darBaixa(Long id, RequerimentoLabResponseDTO dto,Usuario usuarioExistente) {
        Optional<RequerimentoLaboratorio> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return null;
        }

        RequerimentoLaboratorio requerimento = optional.get();
        requerimento.setStatus(dto.getStatus());
        requerimento.setApprovedBy(dto.getApprovedBy());
        requerimento.setRejectedBy(dto.getRejectedBy());
        requerimento.setRejectionReason(dto.getRejectionReason());
        requerimento.setApprovedReason(dto.getApprovedReason());

        if (dto.getLaboratorioId() != null) {
            Laboratorio laboratorio = laboratorioRepository.findById(dto.getLaboratorioId())
                    .orElseThrow(() -> new RuntimeException("Laboratório não encontrado"));
            requerimento.setLaboratorio(laboratorio);
        }

        requerimento.setUpdatedAt(LocalDate.now());
        requerimento.setUserOfAction(usuarioExistente);


        //enviando os dados para o rabbitmq
        LocalDateTime data = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String dataFormatada = data.format(formatter);


        String mensagem = "O Requerimento com o token " + requerimento.getToken() +
                " foi finalizado no dia " + dataFormatada + ", seu status é " +
                (requerimento.getStatus().equals("approved") ? "Aprovado ,o laboratório reservado é " + requerimento.getLaboratorio().getNome() + ",no  " + requerimento.getLaboratorio().getBloco() : "Reprovado") +
                ", Mensagem da Logística: " +
                (!requerimento.getApprovedReason().isEmpty()
                        ? requerimento.getApprovedReason()
                        : requerimento.getRejectionReason());

        PayloadSmtp msgSMTP = new PayloadSmtp(mensagem,requerimento.getEmailDocente(),requerimento.getNomeDocente());

        this.rabbitmqService.enviaMensagem(RabbbitMQConstantes.FILA_LAB,msgSMTP);

        return repository.save(requerimento);
    }
}
