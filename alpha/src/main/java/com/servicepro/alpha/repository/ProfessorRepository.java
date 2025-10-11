package com.servicepro.alpha.repository;

import com.servicepro.alpha.domain.Professor;
import com.servicepro.alpha.domain.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor,Long> {

    @Query("SELECT r FROM Professor r WHERE r.matricula = :matricula")
    Professor findByMatricula(String matricula);
}
