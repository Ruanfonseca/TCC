package com.servicepro.alpha.domain;


import com.servicepro.alpha.enums.TipoLab;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "laboratorio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Laboratorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String bloco;
    private String capacidade;

    @ElementCollection
    @Column(name = "equipamento")
    private List<String> equipamento = new ArrayList<>();

    private String status;
    private String andar;
    private String descricao;
    @Enumerated(EnumType.STRING)
    private TipoLab tipoLab;
    private LocalDate createdAt;
    private LocalDate updatedAt;

}
