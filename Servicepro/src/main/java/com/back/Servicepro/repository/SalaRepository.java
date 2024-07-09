package com.back.Servicepro.repository;

import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Requerimento;
import com.back.Servicepro.models.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SalaRepository extends JpaRepository<Sala,String> {


    @Query("SELECT u FROM Sala u WHERE u.nome = :nome")
    Optional<Sala> findByNome(@Param("nome")String nome);

    List<Sala> findAll();

    @Query("SELECT u FROM Sala u WHERE u.status_da_sala = :status_da_sala")
    List<Sala> findByStatus(@Param("status_da_sala")String status_da_sala);
}
