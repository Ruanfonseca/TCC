package com.back.Servicepro.controllers;
import com.back.Servicepro.dto.usuario.ProfessorDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/usuario")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/cadastrar")
    private boolean salvar(@RequestBody UsuarioDTO usuarioDto) {

        if (service.salvar(usuarioDto)){
            return true;
        }

        return false;
    }

    @PostMapping("/professor/cadastrar")
    private Boolean salvarProfessor(@RequestBody ProfessorDTO dto){
       if (service.salvarProfessor(dto)){
           return true;
       }
       return false;
    }

    @GetMapping("/listagem")
    private List<UsuarioDTO> buscarTodos() {
        List<Usuario> usuarios = service.buscarTodos();
        List<UsuarioDTO> retornoUsuarios = new ArrayList<>();

        for (Usuario usuario : usuarios) {
            UsuarioDTO usuarioDTO = new UsuarioDTO(
                    usuario.getNome(),
                    usuario.getLogin(),
                    usuario.getMatricula(),
                    usuario.getFaculdade(),
                    usuario.getSetor(),
                    usuario.getRole()
            );

            retornoUsuarios.add(usuarioDTO);
        }

        return retornoUsuarios;
    }



    @GetMapping("/admin")
    private String getAdmin() {
        return "permissão de administrador";
    }

    @GetMapping("/user")
    private String getUser() {
        return "permissão de usuário";
    }


}
