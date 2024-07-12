package com.back.Servicepro.controllers;

import com.back.Servicepro.dto.auth.AuthDTO;
import com.back.Servicepro.dto.auth.RecuperationDTO;
import com.back.Servicepro.dto.auth.RequestDTO;
import com.back.Servicepro.dto.usuario.*;
import com.back.Servicepro.enums.RoleEnum;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.AutenticacaoService;
import com.back.Servicepro.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AutenticacaoController {


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AutenticacaoService autenticacaoService;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UsuarioService service;


    @PostMapping("/cadastrar")
    private ResponseEntity<Boolean>criarConta(@Valid @RequestBody UsuarioDTO dto){

        if (service.salvar(dto)){
            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        }

        return new ResponseEntity<Boolean>(false, HttpStatus.BAD_REQUEST);


    }


    @PostMapping("/recuperacao")
    private ResponseEntity<?>verificaExistente(@Valid @RequestBody RequestDTO dto){

        Optional<Usuario> usuario = service.buscarPorMatricula(dto.matricula());

        if(usuario.isPresent()){
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
        else
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);


    }


    @PutMapping("/recuperacao/alterarsenha")
    private ResponseEntity<?> alterarSenha(@Valid @RequestBody UsuarioDTO dto){

        var senha = encoder.upgradeEncoding(dto.senha());

        Optional<Usuario> AntigoUsuario = service.buscarPorMatricula(dto.matricula());

        if(AntigoUsuario.isPresent()){

            AntigoUsuario.get().setFaculdade(dto.faculdade());
            AntigoUsuario.get().setMatricula(dto.matricula());
            AntigoUsuario.get().setNome(dto.nome());
            AntigoUsuario.get().setLogin(dto.login());
            AntigoUsuario.get().setSetor(dto.setor());
            AntigoUsuario.get().setSenha(String.valueOf(senha));
            AntigoUsuario.get().setRole(dto.role());

            service.editar(AntigoUsuario.get());

            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponseDTO auth(@RequestBody AuthDTO dto) {

        var usuarioAutenticationToken = new UsernamePasswordAuthenticationToken(dto.login(), dto.senha());

        authenticationManager.authenticate(usuarioAutenticationToken);


        return autenticacaoService.obterToken(dto);
        
    }

    @PostMapping("/validate")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioOnlineResponseDTO validateToken(@RequestBody UsuarioOnlineDTO dto){
        return autenticacaoService.obterUsuarioPorToken(dto.token());
    }

    @PostMapping("/refresh-token")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponseDTO authRefreshToken(@RequestBody RequestRefreshDTO requestRefreshDto) {
        return autenticacaoService.obterRefreshToken(requestRefreshDto.refreshToken());
    }
}

