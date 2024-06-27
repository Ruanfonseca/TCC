package com.back.Servicepro.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="TB_REQUERIMENTO")
public class Requerimento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private  String sala;
    private  String codigo;
    private  String horarioInicial;
    private  String horarioFinal;
    private  String data;
    private  String matricula;
    private  String nome;
    private  String email;
    private  String telefone;
    private  String motivoJustificativa;
    private  String status = "P";
    private  String nomeFunc;
    private  String matriculaFunc;
    private  String retorno="";

}
