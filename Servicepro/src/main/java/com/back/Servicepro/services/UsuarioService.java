package com.back.Servicepro.services;

import com.back.Servicepro.dto.usuario.ProfessorDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.interfaces.IUsuarioService;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Boolean salvar(UsuarioDTO usuarioDTO) {
        Usuario UsuarioExistente = repository.findByLogin(usuarioDTO.login());

        if (UsuarioExistente != null) {
            return false;
        }

        try {
            var senha = passwordEncoder.encode(usuarioDTO.senha());

            Usuario entity = new Usuario(
                    usuarioDTO.nome(),
                    usuarioDTO.login(),
                    senha,
                    usuarioDTO.matricula(),
                    usuarioDTO.faculdade(),
                    usuarioDTO.setor(),
                    usuarioDTO.role()
            );
            Usuario novoUsuario = repository.save(entity);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    @Override
    public void editar(Usuario editado) {

        repository.save(editado);
    }
    @Override
    public List<Usuario> buscarTodosUsuarios() {
        return repository.findAll();
    }

    @Override
    public Optional<Usuario> buscarPorMatricula(String Matricula) {

        return repository.findByMatricula(Matricula);
    }

    @Override
    public void deletar(Usuario deletado) {
        repository.delete(deletado);
    }

    public Boolean salvarProfessor(ProfessorDTO dto) {
        Usuario UsuarioExistente = repository.findByLogin(dto.login());

        if (UsuarioExistente != null) {
            return false;
        }

        try {
            var senha = passwordEncoder.encode(dto.senha());

            Usuario entity = new Usuario(
                    dto.nome(),
                    dto.login(),
                    senha,
                    dto.matricula(),
                    dto.faculdade(),
                    "",
                    dto.role()
            );
            Object novoUsuario = repository.save(entity);

            if (novoUsuario.equals(null)) {
                return false;
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }
}
