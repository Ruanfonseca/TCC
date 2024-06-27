package com.back.Servicepro.controllers;


import com.back.Servicepro.dto.usuario.MatriculaRequestDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.dto.usuario.UsuarioOnlineDTO;
import com.back.Servicepro.dto.usuario.UsuarioOnlineResponseDTO;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/busca")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*")
public class BuscaController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @GetMapping("/busca/matricula")
    private ResponseEntity<UsuarioOnlineResponseDTO> buscarPorMatricula(@RequestParam MatriculaRequestDTO MrequestDTO) {
        Optional<Usuario> usuario = usuarioService.buscarPorMatricula(MrequestDTO.matricula());

        if (usuario.isPresent()) {
            UsuarioOnlineResponseDTO dto = new UsuarioOnlineResponseDTO(
                    usuario.get().getNome(),
                    usuario.get().getLogin(),
                    usuario.get().getRole()
            );
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }




}
