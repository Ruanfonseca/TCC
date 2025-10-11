package com.servicepro.alpha.controller.auth;

import com.servicepro.alpha.domain.Usuario;
import com.servicepro.alpha.dto.auth.LoginRequest;
import com.servicepro.alpha.dto.auth.LoginResponse;
import com.servicepro.alpha.dto.auth.UserInfo;
import com.servicepro.alpha.repository.UsuarioRepository;
import com.servicepro.alpha.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8081")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UsuarioRepository usuarioRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
                          UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.usuarioRepository = usuarioRepository;

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        try {

            // Autentica usando Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Recupera os dados do usuário do banco de dados
            Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado no banco"));


            // Gera o token JWT usando email e role
            String role = usuario.getRole().name();
            String token = tokenProvider.generateToken(usuario.getEmail(), role);

            // Cria DTO de resposta com os dados reais do usuário
            UserInfo userInfo = new UserInfo(
                    String.valueOf(usuario.getId()),
                    usuario.getEmail(),
                    usuario.getRegisterNumber(),
                    usuario.getName(),
                    role
            );

            return ResponseEntity.ok(new LoginResponse(token, userInfo));

        } catch (BadCredentialsException e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Credenciais inválidas");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao autenticar");
        }
    }



    @GetMapping("/validate")
    public ResponseEntity<String> validate(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (tokenProvider.validateToken(token)) {
            return ResponseEntity.ok("Token válido");
        }
        return ResponseEntity.status(401).body("Token inválido");
    }
}
