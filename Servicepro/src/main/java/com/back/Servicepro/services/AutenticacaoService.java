package com.back.Servicepro.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.back.Servicepro.dto.usuario.AuthDTO;
import com.back.Servicepro.dto.usuario.TokenResponseDTO;
import com.back.Servicepro.dto.usuario.UsuarioOnlineResponseDTO;
import com.back.Servicepro.infra.exceptions.UnauthorizedException;
import com.back.Servicepro.interfaces.IAutenticacaoService;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class AutenticacaoService implements IAutenticacaoService {

    @Value("${auth.jwt.token.secret}")
    private String chaveSecreta;

    @Value("${auth.jwt.token.expiration}")
    private Integer horaDaExpiracaoToken;

    @Value("${auth.jwt.refresh-token.expiration}")
    private Integer HoraDaExpiracaoRefreshToken;

    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException{
        return repository.findByLogin(login);
    }
    @Override
    public TokenResponseDTO obterToken(AuthDTO dto){
        Usuario usuario = repository.findByLogin(dto.login());


        if (usuario == null) {
            return null;
        }

        return TokenResponseDTO
                .builder()
                .token(geraTokenJWT(usuario, horaDaExpiracaoToken))
                .nome(usuario.getNome())
                .email(usuario.getLogin())
                .role(usuario.getRole())
                .build();
    }


    public String geraTokenJWT(Usuario usuario,Integer expiration){
        try {
            Algorithm algorithm = Algorithm.HMAC256(chaveSecreta);

            return JWT.create()
                    .withIssuer("Servicepro")
                    .withSubject(usuario.getLogin())
                    .withExpiresAt(geraDataExpiracao(expiration))
                    .sign(algorithm);
        }catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao tentar gerar o token !"+exception.getMessage());
        }
    }

    public String validaTokenJWT(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(chaveSecreta);

            return JWT.require(algorithm)
                    .withIssuer("Servicepro")
                    .build()
                    .verify(token)
                    .getSubject();
        }catch (JWTVerificationException ex){
            return "";
        }
    }

    public TokenResponseDTO obterRefreshToken(String refreshToken){
        String login = validaTokenJWT(refreshToken);
        Usuario usuario = repository.findByLogin(login);

        if (usuario == null) {
            throw new UnauthorizedException("Não autorizado exception");
        }


       var authentication = new UsernamePasswordAuthenticationToken(usuario,null,usuario.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return TokenResponseDTO
                .builder()
                .token(geraTokenJWT(usuario,horaDaExpiracaoToken))
                .build();
    }

    private Instant geraDataExpiracao(Integer expiration){
         return LocalDateTime.now()
                 .plusHours(expiration)
                 .toInstant(ZoneOffset.of("-03:00"));
    }


    public UsuarioOnlineResponseDTO obterUsuarioPorToken(String token) {

        String login = validaTokenJWT(token);

        if (login.isEmpty()) {
            throw new UnauthorizedException("Token inválido ou expirado");
        }

        Usuario usuario = repository.findByLogin(login);

        if (usuario == null) {
            throw new UnauthorizedException("Usuário não encontrado");
        }
        return UsuarioOnlineResponseDTO
                .builder()
                .email(usuario.getLogin())
                .nome(usuario.getNome())
                .role(usuario.getRole())
                .build();
    }



}
