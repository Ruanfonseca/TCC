package com.back.Servicepro.services;

import com.back.Servicepro.dto.usuario.ProfessorDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.interfaces.IUsuarioService;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService implements IUsuarioService{

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Boolean salvar(UsuarioDTO usuarioDTO){
        Usuario usuarioExistente = repository.findByLogin(usuarioDTO.login());

        if (usuarioExistente != null){
            return false;
        }

        try {

            var matriculaHash = passwordEncoder.encode(usuarioDTO.matricula());
            Usuario entity = new Usuario(usuarioDTO.nome(),usuarioDTO.login(),matriculaHash,usuarioDTO.faculdade(),usuarioDTO.setor(),usuarioDTO.role());
            Usuario novoUsuario = repository.save(entity);
            return true;

        }catch (Exception e){
            e.printStackTrace();

        }


        return false;
    }

    @Override
    @Cacheable("Usuarios")
    public List<Usuario> buscarTodos() {
        return repository.findAll();
    }


    public Boolean salvarProfessor(ProfessorDTO dto){
        Usuario usuarioExistente = repository.findByLogin(dto.login());

        if (usuarioExistente != null){
            return false;
        }

        try {
            var matriculaHash = passwordEncoder.encode(dto.matricula());
            Usuario entity = new Usuario(dto.nome(),dto.login(),matriculaHash,dto.faculdade(),dto.faculdade(),dto.role());
            Object novoUsuario = repository.save(entity);

            if (novoUsuario.equals(null))
                    return false;

            return true;
        }catch (Exception e){
            e.printStackTrace();

        }


        return false;
    }

}
