package com.servicepro.alpha.service;

import com.servicepro.alpha.domain.Usuario;
import com.servicepro.alpha.dto.usuario.UsuarioDTO;
import com.servicepro.alpha.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();



    public Usuario buscarPorMatricula(String matricula) {
        return repository.findByMatricula(matricula);
    }

    public List<Usuario> buscarUsuarios() {
        return repository.findAll();

    }

    public Usuario salvarUsuario(UsuarioDTO dto) {



        Usuario usuario = new Usuario();
        usuario.setName(dto.getName());
        usuario.setEmail(dto.getEmail());
        usuario.setRole(dto.getRole());
        usuario.setStatus(dto.getStatus());
        usuario.setDepartment(dto.getDepartament());
        usuario.setPhone(dto.getPhone());

        if (!dto.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(dto.getPassword());
            usuario.setPassword(hashedPassword);
        }

        usuario.setRegisterNumber(dto.getRegisterNumber());
        usuario.setCreatedAt(LocalDate.now());

        return repository.save(usuario);
    }

    public Usuario atualizarUsuario(Long id, UsuarioDTO dto) {
        Optional<Usuario> optional = repository.findById(id);
        if (optional.isEmpty()) {
            return null;
        }

        Usuario usuario = optional.get();

        usuario.setName(dto.getName());
        usuario.setEmail(dto.getEmail());
        usuario.setRole(dto.getRole());
        usuario.setStatus(dto.getStatus());
        usuario.setDepartment(dto.getDepartament());
        usuario.setPhone(dto.getPhone());
        if (!dto.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(dto.getPassword());
            usuario.setPassword(hashedPassword);
        }
        usuario.setRegisterNumber(dto.getRegisterNumber());
        usuario.setUpdatedAt(LocalDate.now());


        return repository.save(usuario);
    }


    public boolean deletarUsuario(Long id) {
        Optional<Usuario> optional = repository.findById(id);
        if (optional.isEmpty()) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}