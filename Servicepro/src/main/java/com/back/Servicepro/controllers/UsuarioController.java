package com.back.Servicepro.controllers;
import com.back.Servicepro.dto.usuario.ProfessorDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.dto.usuario.MatriculaRequestDTO;
import com.back.Servicepro.enums.RoleEnum;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuario")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioService service;


    @Autowired
    private PasswordEncoder passwordEncoder;

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
        List<Usuario> Usuarios = service.buscarTodos();
        List<UsuarioDTO> retornoUsuarios = new ArrayList<>();

        for (Usuario usuario : Usuarios) {
            UsuarioDTO usuarioDTO = new UsuarioDTO(
                    usuario.getNome(),
                    usuario.getLogin(),
                    usuario.getFaculdade(),
                    usuario.getMatricula(),
                    usuario.getSetor(),
                    usuario.getSenha(),
                    usuario.getTelefone(),
                    usuario.getRole()
            );

            retornoUsuarios.add(usuarioDTO);
        }

        return retornoUsuarios;
    }

    @GetMapping("/busca/matricula")
    private ResponseEntity<UsuarioDTO> buscarPorMatricula(@RequestBody MatriculaRequestDTO dto){
         Optional<Usuario> usuario = service.buscarPorMatricula(dto.matricula());

        UsuarioDTO usuarioDTO = new UsuarioDTO(
                usuario.get().getNome(),
                usuario.get().getLogin(),
                usuario.get().getFaculdade(),
                usuario.get().getMatricula(),
                usuario.get().getSetor(),
                usuario.get().getSenha(),
                usuario.get().getTelefone(),
                usuario.get().getRole()

        );
       return new ResponseEntity<>(usuarioDTO,HttpStatus.OK);
    }

    @PutMapping("/editar")
    public ResponseEntity<Boolean> Put(@Valid @RequestBody UsuarioDTO novoUsuario)
    {
        Optional<Usuario> AntigoUsuario = service.buscarPorMatricula(novoUsuario.matricula());

        if(AntigoUsuario.isPresent()){

            AntigoUsuario.get().setFaculdade(novoUsuario.faculdade());
            AntigoUsuario.get().setMatricula(novoUsuario.matricula());
            AntigoUsuario.get().setNome(novoUsuario.nome());
            AntigoUsuario.get().setLogin(novoUsuario.login());
            AntigoUsuario.get().setSetor(novoUsuario.setor());
            AntigoUsuario.get().setSenha(novoUsuario.senha());
            AntigoUsuario.get().setRole(novoUsuario.role());

            service.editar(AntigoUsuario.get());

            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deletar")
    public ResponseEntity<Boolean> Delete(@RequestBody MatriculaRequestDTO dto){

        Optional<Usuario> Usuario = service.buscarPorMatricula(dto.matricula());

        if(Usuario.isPresent()){

            service.deletar(Usuario.get());

            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);

    }



}
