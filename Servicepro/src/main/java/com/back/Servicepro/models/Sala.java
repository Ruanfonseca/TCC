package com.back.Servicepro.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="TB_SALA")
public class Sala {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String nome;

    private String capacidade;

    private String status_da_sala="";

    public Sala(String nome, String capacidade, String status_da_sala) {
        this.nome = nome;
        this.capacidade = capacidade;
        this.status_da_sala = status_da_sala;
    }
}
