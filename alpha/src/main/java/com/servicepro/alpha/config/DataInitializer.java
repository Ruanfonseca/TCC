package com.servicepro.alpha.config;

import com.servicepro.alpha.domain.Usuario;
import com.servicepro.alpha.enums.Role;
import com.servicepro.alpha.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.Optional;

@Configuration
public class DataInitializer {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Bean
    CommandLineRunner initRootUser() {
        return args -> {

            // ROOT USER – Senha: Admin@2025
            criarUsuarioSeNaoExistir(
                    "root@admin.com",
                    Usuario.builder()
                            .name("Root User")
                            .email("root@admin.com")
                            .password("$2a$10$ZJNWsT3yL8QBNr4qzMeWeOsyUwsxBXwWn/GpoJGUgE9pIVTXbbTxq") // Admin@2025
                            .department("Administration")
                            .registerNumber("ROOT001")
                            .role(Role.ADMIN)
                            .status("active")
                            .phone("+55 21 99999-9999")
                            .createdAt(LocalDate.now())
                            .updatedAt(LocalDate.now())
                            .build()
            );

            // CARLOS SICSU – Senha: Prof@2025
            criarUsuarioSeNaoExistir(
                    "carlossicsu@uerj.com.br",
                    Usuario.builder()
                            .name("Carlos Sicsu")
                            .email("carlossicsu@uerj.com.br")
                            .password("$2a$10$wHwV4Z.Yjon3gi/laVhAKeuOaReO2SvoAc7kM1r7JHjrwNB8zTC02") // Prof@2025
                            .department("FCEE")
                            .registerNumber("ROOT002")
                            .role(Role.PROFESSOR)
                            .status("active")
                            .phone("+55 21 99999-9999")
                            .createdAt(LocalDate.now())
                            .updatedAt(LocalDate.now())
                            .build()
            );

            // PROFESSOR BIOLOGIA – Senha: Bio@2025
            criarUsuarioSeNaoExistir(
                    "profbiologia@uerj.com.br",
                    Usuario.builder()
                            .name("Professor Biologia")
                            .email("profbiologia@uerj.com.br")
                            .password("$2a$10$Qb9e/Tr7cufCyBIt4cl1su2rTnHSMm_MD8gnQKOnCV0xxbksOn4pW") // Bio@2025
                            .department("FCBS")
                            .registerNumber("ROOT003")
                            .role(Role.PROFESSOR)
                            .status("active")
                            .phone("+55 21 99999-9999")
                            .createdAt(LocalDate.now())
                            .updatedAt(LocalDate.now())
                            .build()
            );

            // OPERADOR LOGÍSTICA – Senha: Log@2025
            criarUsuarioSeNaoExistir(
                    "operadorLogistica@gmail.com",
                    Usuario.builder()
                            .name("Operador Logística")
                            .email("operadorLogistica@gmail.com")
                            .password("$2a$10$S7fDCCj3X4ntU/3vtO9Qxu0Kf27Z3kpwIcj8vJgFVLzGfBcEBMe3e") // Log@2025
                            .department("Logística")
                            .registerNumber("ROOT004")
                            .role(Role.LOGISTICA)
                            .status("active")
                            .phone("+55 21 99999-9999")
                            .createdAt(LocalDate.now())
                            .updatedAt(LocalDate.now())
                            .build()
            );

            // ADMIN LAB – Senha: Lab@2025
            criarUsuarioSeNaoExistir(
                    "adminlab@gmail.com",
                    Usuario.builder()
                            .name("Admin Lab")
                            .email("adminlab@gmail.com")
                            .password("$2a$10$3nfbgxpRPYd5weYxpuSoo.0NBhAEw6TNsU7oEDH5IiJJpn2W8LlEa") // Lab@2025
                            .department("Administration")
                            .registerNumber("ROOT005")
                            .role(Role.ADMIN_LAB)
                            .status("active")
                            .phone("+55 21 99999-9999")
                            .createdAt(LocalDate.now())
                            .updatedAt(LocalDate.now())
                            .build()
            );
        };
    }

    private void criarUsuarioSeNaoExistir(String email, Usuario usuario) {
        Optional<Usuario> existing = Optional.ofNullable(usuarioRepository.findByEmail(email));

        if (existing.isEmpty()) {
            usuarioRepository.save(usuario);
            System.out.println("Usuário criado: " + email);
        } else {
            System.out.println("Usuário já existe: " + email);
        }
    }
}
