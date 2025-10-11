package com.servicepro.alpha.repository;

import com.servicepro.alpha.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {

//    @Query("SELECT r FROM Usuario r WHERE r.email = :email")
//    Usuario findByEmail(String email);

    Optional<Usuario> findByEmail(String email);


    @Query("SELECT r FROM Usuario r WHERE r.registerNumber = :registerNumber")
    Usuario findByMatricula(String registerNumber);

}
