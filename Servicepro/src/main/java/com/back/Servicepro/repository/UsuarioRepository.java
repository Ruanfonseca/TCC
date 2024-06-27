package com.back.Servicepro.repository;

import com.back.Servicepro.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,String> {

    Usuario findByLogin(String login);

    @Query("SELECT u FROM Usuario u WHERE u.matricula = :matricula")
    Optional<Usuario>findByMatricula(@Param("matricula")String matricula);

    List<Usuario> findAll();


}
