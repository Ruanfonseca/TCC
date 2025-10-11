package com.servicepro.alpha.controller.laboratorio;


import com.servicepro.alpha.domain.Laboratorio;
import com.servicepro.alpha.domain.Sala;
import com.servicepro.alpha.dto.laboratorio.LaboratorioDTO;
import com.servicepro.alpha.dto.sala.SalaDTO;
import com.servicepro.alpha.service.LaboratorioService;
import com.servicepro.alpha.service.SalaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
public class LaboratorioController {

    @Autowired
    private LaboratorioService service;

    @GetMapping
    public ResponseEntity<?> getLabs() {
        try {
            List<Laboratorio> labs = service.buscarLabs();
            return ResponseEntity.ok(labs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar laboratorios.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createLabs(@RequestBody LaboratorioDTO dto) {
        try {
            // Verificando se já existe um professor cadastrado
            Laboratorio laboratorioExistente = service.buscarLab(dto.getNome());

            if (laboratorioExistente != null) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("O laboratorio ja existe.");
            }

            service.salvarLab(dto);

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
    public ResponseEntity<?> update(@PathVariable String id,@RequestBody LaboratorioDTO dto) {
        try {
            Laboratorio laboratorio = service.atualizarLab(id, dto);
            if (laboratorio == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("laboratorio não encontrado.");
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
            boolean deletado = service.deletarLaboratorio(id);
            if (!deletado) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Laboratorio não encontrado.");
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar Laboratorio.");
        }
    }




}
