package com.back.Servicepro.repository;

import com.back.Servicepro.models.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HorarioRepository extends JpaRepository<Horario,String> {
    @Query("SELECT u FROM Horario u WHERE u.nome = :nome")
    Optional<Horario> findByNome(@Param("nome")String nome);

    List<Horario> findAll();
}
