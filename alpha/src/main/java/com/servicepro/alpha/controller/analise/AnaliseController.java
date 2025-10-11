package com.servicepro.alpha.controller.analise;

import com.servicepro.alpha.domain.Requerimento;
import com.servicepro.alpha.domain.RequerimentoLaboratorio;
import com.servicepro.alpha.dto.dataAnalise.agenda.AgendaDTO;
import com.servicepro.alpha.dto.dataAnalise.DataAnailiseDTO;
import com.servicepro.alpha.dto.dataAnalise.agenda.AgendaResponseDTO;
import com.servicepro.alpha.dto.relatorio.ReportDTO;
import com.servicepro.alpha.service.RequerimentoLabService;
import com.servicepro.alpha.service.RequerimentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/analise")
public class AnaliseController {

    @Autowired
    private RequerimentoService requerimentoService;

    @Autowired
    private RequerimentoLabService requimentoLabService;

    @GetMapping
    public ResponseEntity<?> getAnalise() {
        try {
            // Busca todos os requerimentos
            List<Requerimento> requerimentoSala = requerimentoService.obterTodosRequerimentos();
            List<RequerimentoLaboratorio> requerimentoLaboratorios = requimentoLabService.obterTodosRequerimentos();

            // Junta as listas
            long qtdTotal = requerimentoSala.size() + requerimentoLaboratorios.size();

            long qtdApproved = requerimentoSala.stream()
                    .filter(r -> "approved".equalsIgnoreCase(r.getStatus()))
                    .count()
                    +
                    requerimentoLaboratorios.stream()
                            .filter(r -> "approved".equalsIgnoreCase(r.getStatus()))
                            .count();

            long qtdPending = requerimentoSala.stream()
                    .filter(r -> "pending".equalsIgnoreCase(r.getStatus()))
                    .count()
                    +
                    requerimentoLaboratorios.stream()
                            .filter(r -> "pending".equalsIgnoreCase(r.getStatus()))
                            .count();

            long qtdRejected = requerimentoSala.stream()
                    .filter(r -> "rejected".equalsIgnoreCase(r.getStatus()))
                    .count()
                    +
                    requerimentoLaboratorios.stream()
                            .filter(r -> "rejected".equalsIgnoreCase(r.getStatus()))
                            .count();

            long qtdCancelled = requerimentoSala.stream()
                    .filter(r -> "cancelled".equalsIgnoreCase(r.getStatus()))
                    .count()
                    +
                    requerimentoLaboratorios.stream()
                            .filter(r -> "cancelled".equalsIgnoreCase(r.getStatus()))
                            .count();

            // Preenche DTO
            DataAnailiseDTO dto = new DataAnailiseDTO();
            dto.setQtdApproved(qtdApproved);
            dto.setQtdPending(qtdPending);
            dto.setQtdRejected(qtdRejected);
            dto.setQtdCancelled(qtdCancelled);
            dto.setQtdTotal(qtdTotal);

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar dados da análise.");
        }
    }


    @PostMapping("/report")
    public ResponseEntity<Map<String, Object>> getReport(@RequestBody ReportDTO request) {
        try {
            // Buscar todos os requerimentos
            List<Requerimento> requerimentoSala = requerimentoService.obterTodosRequerimentos();
            List<RequerimentoLaboratorio> requerimentoLaboratorios = requimentoLabService.obterTodosRequerimentos();

            // Filtrar por status e data
            List<Requerimento> filteredSala = requerimentoSala.stream()
                    .filter(r -> r.getStatus().equalsIgnoreCase(request.getReportType())
                            && !r.getCreatedAt().isBefore(request.getStartDate())
                            && !r.getCreatedAt().isAfter(request.getEndDate()))
                    .collect(Collectors.toList());

            List<RequerimentoLaboratorio> filteredLab = requerimentoLaboratorios.stream()
                    .filter(r -> r.getStatus().equalsIgnoreCase(request.getReportType())
                            && !r.getCreatedAt().isBefore(request.getStartDate())
                            && !r.getCreatedAt().isAfter(request.getEndDate()))
                    .collect(Collectors.toList());

            // Devolver ambos em um map
            Map<String, Object> response = new HashMap<>();
            response.put("sala", filteredSala);
            response.put("laboratorio", filteredLab);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }


    @GetMapping("/token/{token}")
    public ResponseEntity<?> obterPorToken(@PathVariable String token) {
        try {
            if (token == null || token.isBlank()) {
                return ResponseEntity.badRequest().body("Token não informado.");
            }

            // Determina o tipo pelo prefixo
            if (token.startsWith("SAL-")) {
                var requerimento = requerimentoService.obterPorToken(token);

                if (requerimento == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Requerimento de sala não encontrado para o token informado.");
                }

                // Caso tenha estrutura completa (schedule, materia, equipamentos etc)
                return ResponseEntity.ok(Map.of(
                        "tipo", "sala",
                        "dados", requerimento
                ));
            }

            else if (token.startsWith("LAB-")) {
                var requerimentoLab = requimentoLabService.obterPorToken(token);

                if (requerimentoLab == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Requerimento de laboratório não encontrado para o token informado.");
                }

                return ResponseEntity.ok(Map.of(
                        "tipo", "laboratorio",
                        "dados", requerimentoLab
                ));
            }

            else {
                return ResponseEntity.badRequest()
                        .body("Token inválido. O prefixo deve ser 'SAL-' ou 'LAB-'.");
            }

        } catch (Throwable e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar requerimento por token: " + e.getMessage());
        }
    }


    @PostMapping("/agenda")
    public ResponseEntity<?> obterAgenda(@RequestBody AgendaDTO dto) {

        try {
            if (dto == null || dto.getDataSolicitada() == null || dto.getDataSolicitada().isEmpty()) {
                return ResponseEntity.badRequest().body("Data não informada.");
            }

            String dataSolicitada = dto.getDataSolicitada();

            // Buscar requerimentos de salas
            List<Requerimento> salas = requerimentoService.obterPorData(dataSolicitada);

            List<AgendaResponseDTO> agendaSalas = salas.stream().map(r -> {
                AgendaResponseDTO response = new AgendaResponseDTO();
                response.setId(String.valueOf(r.getId()));
                response.setType("sala");
                response.setDate(r.getDia());
                response.setTimeStart(r.getScheduleInitial() != null ? r.getScheduleInitial().getStartTime() : "");
                response.setTimeEnd(r.getScheduleEnd() != null ? r.getScheduleEnd().getEndTime() : "");
                response.setTitle(r.getMateria());
                response.setProfessorName(r.getRequiredBy() != null ? r.getRequiredBy().getNome() : "");
                response.setSubject(r.getMateria());
                response.setNumberOfStudents(r.getNumberOfPeople());
                response.setStatus(r.getStatus());
                response.setLocation(r.getRoom() != null ? r.getRoom().getName() : "");
                response.setObservations(r.getObservations());
                response.setToken(r.getToken());
                return response;
            }).collect(Collectors.toList());

            // Buscar requerimentos de laboratórios
            List<RequerimentoLaboratorio> labs = requimentoLabService.obterPorData(dataSolicitada);

            List<AgendaResponseDTO> agendaLabs = labs.stream().map(l -> {
                AgendaResponseDTO response = new AgendaResponseDTO();
                response.setId(String.valueOf(l.getId()));
                response.setType("laboratorio");
                response.setDate(l.getDia());
                response.setTimeStart(l.getHorarioInicio() != null ? l.getHorarioInicio().getStartTime() : "");
                response.setTimeEnd(l.getHorarioFinal() != null ? l.getHorarioFinal().getEndTime() : "");
                response.setTitle(l.getTituloAula());
                response.setProfessorName(l.getNomeDocente());
                response.setSubject(l.getDisciplina());
                response.setNumberOfStudents(l.getNumeroGruposAlunos());
                response.setStatus(l.getStatus());
                response.setLocation(l.getLaboratorio() != null ? l.getLaboratorio().getNome() : "");
                response.setObservations("");
                response.setToken(l.getToken());
                return response;
            }).collect(Collectors.toList());

            List<AgendaResponseDTO> agendaCompleta = new ArrayList<>();
            agendaCompleta.addAll(agendaSalas);
            agendaCompleta.addAll(agendaLabs);

            return ResponseEntity.ok(agendaCompleta);

        } catch (Throwable e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar agenda por data: " + e.getMessage());
        }
    }





}



