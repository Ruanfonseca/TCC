package com.servicepro.alpha.controller.requerimento;

import com.servicepro.alpha.domain.Requerimento;
import com.servicepro.alpha.domain.Sala;
import com.servicepro.alpha.domain.Usuario;
import com.servicepro.alpha.dto.requerimento.RequerimentoBaixaDTO;
import com.servicepro.alpha.dto.requerimento.RequerimentoDTO;
import com.servicepro.alpha.dto.requerimento.RequerimentoResponseDTO;
import com.servicepro.alpha.dto.sala.SalaDTO;
import com.servicepro.alpha.enums.Role;
import com.servicepro.alpha.service.RequerimentoService;
import com.servicepro.alpha.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitations")
public class ReqController {

    @Autowired
    RequerimentoService service;

    @Autowired
    UserService userService;

    @GetMapping
    public ResponseEntity<?> getReqs() {

        try {
            List<Requerimento> reqs = service.obterTodosRequerimentos();
            return ResponseEntity.ok(reqs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar requerimentos .");
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RequerimentoDTO req) {
        try {
            // Verificando se já existe um professor cadastrado
            Requerimento reqExistente = service.buscarRequerimento(req.getDia(),req.getScheduleInitial(),req.getScheduleEnd());

            if (reqExistente != null) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Já existe um requerimento cadastrado com essa sala no dia solicitado.");
            }

            service.salvarReq(req);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao criar requerimento.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody RequerimentoDTO dto) {
        try {
            Requerimento req = service.atualizarReq(id, dto);
            if (req == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Requerimento não encontrado.");
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar requerimento.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReq(@PathVariable String id) {
        try {
            boolean deletado = service.delete(id);
            if (!deletado) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Requerimento não encontrado.");
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar requerimento.");
        }
    }

    @PutMapping("/{id}/baixa")
    public ResponseEntity<?> baixaRequerimento(
            @PathVariable String id,
            @RequestBody RequerimentoBaixaDTO dto) {

        try {
            Requerimento reqExistente = service.buscarPorId(Long.valueOf(id));
            Usuario usuarioExistente = userService.buscarPorMatricula(
                    dto.getApprovedBy() != null ? dto.getApprovedBy() : dto.getRejectedBy()
            );

            if (reqExistente == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Esse requerimento não existe");
            }

            if (usuarioExistente == null ||
                    (usuarioExistente.getRole() != Role.LOGISTICA &&
                            usuarioExistente.getRole() != Role.ADMIN)) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body("Funcionário não credenciado para dar baixa");
            }

            // Chama o service passando DTO
            service.darBaixa(reqExistente.getId(), dto,usuarioExistente);

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro no servidor.");
        }
    }

    @PostMapping("/search/token")
    public ResponseEntity<?> buscarPorToken(@RequestBody String token) {
        try {
            // Verificando se já existe um professor cadastrado
            Requerimento reqExistente = service.buscarToken(token);

            if (reqExistente == null) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Requerimento não existe");
            }

            return ResponseEntity.ok(reqExistente);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

