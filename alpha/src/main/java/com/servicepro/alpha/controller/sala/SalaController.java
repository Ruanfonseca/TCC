package com.servicepro.alpha.controller.sala;


import com.servicepro.alpha.domain.Professor;
import com.servicepro.alpha.domain.Sala;
import com.servicepro.alpha.dto.professor.ProfessorDTO;
import com.servicepro.alpha.dto.sala.SalaDTO;
import com.servicepro.alpha.service.SalaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room")
public class SalaController {

    @Autowired
    private SalaService service;

    @GetMapping
    public ResponseEntity<?> getRooms() {
        try {
            List<Sala> salas = service.buscarSalas();
            return ResponseEntity.ok(salas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar salas.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody SalaDTO dto) {
        try {
            // Verificando se já existe um professor cadastrado
            Sala salaExistente = service.buscarSala(dto.getName());

            if (salaExistente != null) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Professor com sala já existente.");
            }

          service.salvarSala(dto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao criar professor.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,@RequestBody SalaDTO dto) {
        try {
            Sala sala = service.atualizarSala(id, dto);
            if (sala == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Sala não encontrado.");
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar sala.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            boolean deletado = service.deletarSala(id);
            if (!deletado) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Sala não encontrado.");
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar sala.");
        }
    }



}
