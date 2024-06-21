package com.back.Servicepro.repository;

import com.back.Servicepro.models.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface HorarioRepository extends JpaRepository<Horario,String> {
    @Query("select u from Horario u where u.nome like %?1")
    Optional<Horario> findByNome(String nome);

    List<Horario> findAll();
}
