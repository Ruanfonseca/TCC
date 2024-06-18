package com.back.Servicepro.repository;

import com.back.Servicepro.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,String> {

    Usuario findByLogin(String login);

    @Query("select u from Usuario u where u.matricula like %?1")
    Optional<Usuario>findByMatricula(String matricula);

    List<Usuario> findAll();


}
