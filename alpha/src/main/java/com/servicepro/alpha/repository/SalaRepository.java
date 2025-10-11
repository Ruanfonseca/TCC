package com.servicepro.alpha.repository;

import com.servicepro.alpha.domain.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaRepository extends JpaRepository<Sala,Long> {

    @Query("SELECT r FROM Sala r WHERE r.name = :name")
    Sala findByName(String name);
}
