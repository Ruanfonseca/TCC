package com.servicepro.alpha.repository;
import com.servicepro.alpha.domain.Horario;
import com.servicepro.alpha.domain.Laboratorio;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.servicepro.alpha.domain.Sala;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface HorarioRepository extends JpaRepository<Horario,Long> {

    @Query("SELECT r FROM Horario r WHERE r.name = :name")
    Horario findByName(String name);

}
