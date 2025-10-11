package com.servicepro.alpha.controller.usuarios;


import com.servicepro.alpha.domain.Usuario;
import com.servicepro.alpha.dto.usuario.UsuarioDTO;
import com.servicepro.alpha.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")

public class UsuarioController {
    @Autowired
    private UserService service;

    @GetMapping
    public ResponseEntity<?> getUsers() {
        try {
            List<Usuario> usuarios = service.buscarUsuarios();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar usuarios.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UsuarioDTO dto) {
        try {
            // Verificando se já existe um professor cadastrado
            Usuario usuarioExistente = service.buscarPorMatricula(dto.getRegisterNumber());

            if (usuarioExistente != null) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Usuário já existente.");
            }

            service.salvarUsuario(dto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao criar usuario.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,@RequestBody UsuarioDTO dto) {

        try {
            Usuario usuario = service.atualizarUsuario(id, dto);
            if (usuario == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Usuario não encontrado.");
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar usuario.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            boolean deletado = service.deletarUsuario(id);
            if (!deletado) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Usuario não encontrado.");
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar Usuario.");
        }
    }

}
