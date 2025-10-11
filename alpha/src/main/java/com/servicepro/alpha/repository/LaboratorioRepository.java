package com.servicepro.alpha.repository;

import com.servicepro.alpha.domain.Laboratorio;
import com.servicepro.alpha.domain.Professor;
import com.servicepro.alpha.domain.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LaboratorioRepository extends JpaRepository<Laboratorio,Long> {

    @Query("SELECT r FROM Laboratorio r WHERE r.nome = :nome")
    Laboratorio findByNome(String nome);
}
