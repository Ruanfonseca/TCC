package com.back.Servicepro.repository;

import com.back.Servicepro.dto.requerimento.RequerimentoDTO;
import com.back.Servicepro.models.Requerimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RequerimentoRepository extends JpaRepository<Requerimento,String> {

    @Query("SELECT u FROM Requerimento u WHERE u.nome = :nome")
    Optional<Requerimento> findByNome(@Param("nome")String nome);

    @Query("SELECT u FROM Requerimento u WHERE u.status = :status")
    List<Requerimento> findByStatus(@Param("status")String status);

    @Query("SELECT u FROM Requerimento u WHERE u.status = :codigo")
    Optional<Requerimento> findByCodigo(@Param("codigo")String codigo);


    @Query("SELECT r " +
            "FROM Requerimento r " +
            "WHERE r.matricula = :matricula " +
            "AND r.data >= :dataInicio " +
            "AND r.data <= :dataFim")
    List<Requerimento> findByMatriculaAndPeriodo(
            @Param("matricula") String matricula,
            @Param("dataInicio") String dataInicio,
            @Param("dataFim") String dataFim
    );

    List<Requerimento> findAll();
}
