package com.back.Servicepro.repository;

import com.back.Servicepro.models.Sala;
import com.back.Servicepro.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SalaRepository extends JpaRepository<Sala,String> {


    @Query("select u from Sala u where u.nome like %?1")
    Optional<Sala>findByNome(String nome);

    List<Sala> findAll();
}
