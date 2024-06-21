package com.back.Servicepro.controllers;


import com.back.Servicepro.dto.usuario.UsuarioOnlineResponseDTO;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/busca")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*")
public class BuscaController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @GetMapping("/usuario/{matricula}")
    public UsuarioOnlineResponseDTO buscarUsuario(@PathVariable("matricula") String matricula){

        List<Usuario> Usuarios = usuarioService.buscarTodos();

            for (Usuario usuario : Usuarios) {

                if (passwordEncoder.matches(passwordEncoder.encode(matricula), usuario.getMatricula())) {

                    UsuarioOnlineResponseDTO DTO = new UsuarioOnlineResponseDTO(
                            usuario.getNome(),
                            usuario.getLogin(),
                            usuario.getRole()
                    );

                    return DTO;
                }
            }
            return null;
    }





}
