package com.back.Servicepro.interfaces;

import com.back.Servicepro.dto.usuario.AuthDTO;
import com.back.Servicepro.dto.usuario.TokenResponseDTO;
import com.back.Servicepro.dto.usuario.UsuarioOnlineResponseDTO;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface IAutenticacaoService extends UserDetailsService {

    public TokenResponseDTO obterToken(AuthDTO authDTO);

    public String validaTokenJWT(String token);

    TokenResponseDTO obterRefreshToken(String s);

    UsuarioOnlineResponseDTO obterUsuarioPorToken(String token);


}
