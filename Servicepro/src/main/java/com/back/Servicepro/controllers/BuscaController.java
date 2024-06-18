package com.back.Servicepro.controllers;


import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.dto.usuario.UsuarioOnlineResponseDTO;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/busca")
public class BuscaController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/usuario")
    public UsuarioOnlineResponseDTO buscarUsuario(String matricula){

        List<Usuario> usuarios = usuarioService.buscarTodos();

            for (Usuario usuario : usuarios) {

                if (passwordEncoder.matches(matricula, usuario.getMatricula())) {

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
