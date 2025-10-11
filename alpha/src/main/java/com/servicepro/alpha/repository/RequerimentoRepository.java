package com.servicepro.alpha.repository;

import com.servicepro.alpha.domain.Horario;
import com.servicepro.alpha.domain.Requerimento;
import com.servicepro.alpha.domain.RequerimentoLaboratorio;
import com.servicepro.alpha.domain.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RequerimentoRepository extends JpaRepository<Requerimento,Long> {

    @Query("SELECT t FROM Requerimento t WHERE t.token = :token")
    Requerimento findByToken(@Param("token") String token);



    @Query("SELECT r FROM Requerimento r " +
            "WHERE r.dia = :dia " +
            "AND (r.scheduleInitial.startTime < :#{#horarioFinal.startTime} " +
            "AND r.scheduleEnd.endTime > :#{#horarioInicial.endTime})")
    Requerimento findByReq(
            @Param("horarioInicial") Horario horarioInicial,
            @Param("horarioFinal") Horario horarioFinal,
            @Param("dia") String dia
    );


    @Query("SELECT r FROM Requerimento r WHERE r.dia = :dataSolicitada")
    List<Requerimento> findByDate(String dataSolicitada);
}
