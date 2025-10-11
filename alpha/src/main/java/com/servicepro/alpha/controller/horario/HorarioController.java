package com.servicepro.alpha.controller.horario;


import com.servicepro.alpha.domain.Horario;
import com.servicepro.alpha.domain.Professor;
import com.servicepro.alpha.dto.horario.HorarioDTO;
import com.servicepro.alpha.dto.professor.ProfessorDTO;
import com.servicepro.alpha.service.HorarioService;
import com.servicepro.alpha.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
public class HorarioController {

    @Autowired
    private HorarioService service;

    @GetMapping
    public ResponseEntity<?> getSchedule() {
        try {
            List<Horario> horarios = service.buscarHorarios();

            return ResponseEntity.ok(horarios);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar horários.");
        }
    }


    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody HorarioDTO dto) {
        try {
            // Verificando se já existe um professor cadastrado
            Horario horarioExistente = service.buscarHorarioPorNome(dto.getName());

            if (horarioExistente != null) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Horario já existente.");
            }

             service.salvarHorario(dto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao criar horario.");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody HorarioDTO dto) {
        try {
            Horario horario = service.atualizarHorario(id, dto);
            if (horario == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Horario não encontrado.");
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar horario.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            boolean deletado = service.deletarHorario(id);
            if (!deletado) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Horário não encontrado.");
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar horario.");
        }
    }


}
