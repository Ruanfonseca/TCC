package com.back.Servicepro.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="TB_HORARIO")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String nome;

    private String periodo;

    private String horaFim;

    private String horaInicio;


    public Horario(String nome, String periodo) {
        this.nome = nome;
        this.periodo = periodo;
    }
}
