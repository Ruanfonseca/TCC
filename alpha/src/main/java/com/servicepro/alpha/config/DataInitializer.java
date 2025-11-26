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
            // Verifica se o usuário Root já existe
            Optional<Usuario> existing = usuarioRepository.findByEmail("root@admin.com");
            if (existing.isEmpty()) {
                Usuario root = Usuario.builder()
                        .name("Root User")
                        .email("root@admin.com")
                        .password("$2a$10$Ce7f6GLqdhIrhS2dp6shsON2c4lM5hBRMeNsaVChk8MJutAYpZesW") // Admin@@2028
                        .department("Administration")
                        .registerNumber("ROOT001")
                        .role(Role.ADMIN)
                        .status("active")
                        .phone("+55 21 99999-9999")
                        .createdAt(LocalDate.now())
                        .updatedAt(LocalDate.now())
                        .build();
                usuarioRepository.save(root);
                System.out.println("Usuário Root criado com sucesso!");
            } else {
                System.out.println("Usuário Root já existe.");
            }
        };


    }
}