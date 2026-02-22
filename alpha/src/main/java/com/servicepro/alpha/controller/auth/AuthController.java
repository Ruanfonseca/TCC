package com.servicepro.alpha.controller.auth;

import com.servicepro.alpha.domain.Professor;
import com.servicepro.alpha.domain.Usuario;
import com.servicepro.alpha.dto.auth.LoginRequest;
import com.servicepro.alpha.dto.auth.LoginResponse;
import com.servicepro.alpha.dto.auth.UserInfo;
import com.servicepro.alpha.repository.ProfessorRepository;
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
    private final ProfessorRepository professorRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
                          UsuarioRepository usuarioRepository, ProfessorRepository professorRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.usuarioRepository = usuarioRepository;

        this.professorRepository = professorRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        try {

            // Primeiro tenta localizar como Usuario
            Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail());

            // Se não achou, tenta como Professor
            Professor professor = null;
            if (usuario == null) {
                professor = professorRepository.findByEmail(loginRequest.getEmail());
            }

            String email;
            String role;
            String id;
            String name;
            String registerNumber;

            // Se for usuário comum
            if (usuario != null) {
                email = usuario.getEmail();
                role = usuario.getRole().name();
                id = String.valueOf(usuario.getId());
                name = usuario.getName();
                registerNumber = usuario.getRegisterNumber();

                // Se for professor
            } else {
                email = professor.getEmail();
                role = "PROFESSOR"; // defina aqui o nome da role desejada
                id = String.valueOf(professor.getId());
                name = professor.getNome();          // ajuste conforme o atributo
                registerNumber = professor.getMatricula(); // ajuste conforme o atributo
            }

            // Gera token
            String token = tokenProvider.generateToken(email, role);

            // Monta DTO de resposta
            UserInfo userInfo = new UserInfo(
                    id,
                    email,
                    registerNumber,
                    name,
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
