package com.back.Servicepro.controllers;

import com.back.Servicepro.dto.usuario.*;
import com.back.Servicepro.services.AutenticacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AutenticacaoController {


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AutenticacaoService autenticacaoService;

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

