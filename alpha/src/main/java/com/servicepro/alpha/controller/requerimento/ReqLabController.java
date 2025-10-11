package com.servicepro.alpha.controller.requerimento;

import com.servicepro.alpha.domain.Professor;
import com.servicepro.alpha.domain.Requerimento;
import com.servicepro.alpha.domain.RequerimentoLaboratorio;
import com.servicepro.alpha.domain.Usuario;
import com.servicepro.alpha.dto.requerimento.RequerimentoDTO;
import com.servicepro.alpha.dto.requerimento.RequerimentoResponseDTO;
import com.servicepro.alpha.dto.requerimentoLab.RequerimentoLabDTO;
import com.servicepro.alpha.dto.requerimentoLab.RequerimentoLabResponseDTO;
import com.servicepro.alpha.enums.Role;
import com.servicepro.alpha.repository.ProfessorRepository;
import com.servicepro.alpha.service.RequerimentoLabService;
import com.servicepro.alpha.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitations/lab")
public class ReqLabController {

    @Autowired
    RequerimentoLabService service;

    @Autowired
    ProfessorRepository professorRepository;

    @Autowired
    UserService userService;


    @GetMapping
    public ResponseEntity<?> getLabReqs() {

        try {
            List<RequerimentoLaboratorio> reqs = service.obterTodosRequerimentos();
            return ResponseEntity.ok(reqs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar requerimentos .");
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RequerimentoLabDTO req) {
        System.out.println("Criando requerimento"+req);
        try {
            // Verifica se já existe um professor cadastrado
            Professor profExiste = professorRepository.findByMatricula(req.getMatriculaDocente());

            if (profExiste == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Não existe professor com a matrícula " + req.getMatriculaDocente());
            }


            service.salvarReq(req, profExiste);

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
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody RequerimentoLabResponseDTO dto) {
        try {
            RequerimentoLaboratorio req = service.atualizarReq(id, dto);
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
    public ResponseEntity<?> deleteReqLab(@PathVariable String id) {
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
    public ResponseEntity<?> baixaRequerimento(@RequestBody RequerimentoLabResponseDTO dto) {
        System.out.println("Dando baixa no requerimento"+dto);
        try {
            RequerimentoLaboratorio reqExistente = service.buscarPorId(dto.getId());
            Usuario usuarioExistente = userService.buscarPorMatricula(
                    dto.getApprovedBy() != null ? dto.getApprovedBy() : dto.getRejectedBy()
            );
            if (reqExistente == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Esse requerimento de laboratório não existe");
            }

            if (usuarioExistente == null ||
                    (usuarioExistente.getRole() != Role.LOGISTICA &&
                            usuarioExistente.getRole() != Role.ADMIN)) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body("Funcionário não credenciado para dar baixa");
            }

            service.darBaixa(reqExistente.getId(), dto,usuarioExistente);

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro no servidor.");
        }

    }

    @PostMapping("/search/token")
    public ResponseEntity<?> buscarPorToken(@RequestBody String token) {
        try {
            // Verificando se já existe um professor cadastrado
            RequerimentoLaboratorio reqExistente = service.buscarToken(token);

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
