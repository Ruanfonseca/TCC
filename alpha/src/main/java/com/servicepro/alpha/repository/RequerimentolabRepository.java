package com.servicepro.alpha.repository;

import com.servicepro.alpha.domain.Horario;
import com.servicepro.alpha.domain.Laboratorio;
import com.servicepro.alpha.domain.RequerimentoLaboratorio;
import com.servicepro.alpha.domain.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RequerimentolabRepository extends JpaRepository<RequerimentoLaboratorio,Long> {

    @Query("SELECT r FROM RequerimentoLaboratorio r " +
            "WHERE r.laboratorio = :laboratorio " +
            "  AND r.dia = :dia " +
            "  AND (r.horarioInicio.startTime < :horarioFinal AND r.horarioFinal.endTime > :horarioInicial)")
    RequerimentoLaboratorio findByLaboratorioReq(
            @Param("laboratorio") Laboratorio laboratorio,
            @Param("horarioInicial") Horario horarioInicial,
            @Param("horarioFinal") Horario horarioFinal,
            @Param("dia") String dia
    );


    @Query("SELECT r FROM RequerimentoLaboratorio r WHERE r.token = :token")
    RequerimentoLaboratorio findByToken(@Param("token") String token);

    @Query("SELECT r FROM RequerimentoLaboratorio r WHERE r.dia = :dataSolicitada")
    List<RequerimentoLaboratorio> findByDate(String  dataSolicitada);
}
