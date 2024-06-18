package com.back.Servicepro.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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


    public Horario(String nome, String periodo) {
        this.nome = nome;
        this.periodo = periodo;
    }
}
