package com.servicepro.alpha.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "sala")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sala {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // alterado para Long (mais comum para ID auto gerado)

    private String name;
    private String block;
    private String capacity;
    private String type;

    @ElementCollection
    @Column(name = "equipamento")
    private List<String> equipment = new ArrayList<>();

    private String status;
    private String floor;
    private String description;

    private LocalDate createdAt;
    private LocalDate updatedAt;
}
