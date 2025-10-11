package com.servicepro.alpha.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "professor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String nome;
    private String matricula;
    private String email;
    private String phone;
    private String departamento;
    private String status;
    private String especialidade;
    private Integer totalRequests;
    private String approvedRequests;
    private String senha;
    private LocalDate createdAt;
    private LocalDate updatedAt;


}
