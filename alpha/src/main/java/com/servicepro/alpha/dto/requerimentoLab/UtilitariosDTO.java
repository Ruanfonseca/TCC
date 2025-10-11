package com.servicepro.alpha.dto.requerimentoLab;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
public class UtilitariosDTO implements Serializable {
    @Column(name = "reagentes")
    private String reagentes;

    @Column(name = "quantidade_reagentes")
    private String quantidadeReagentes;

    @Column(name = "equipamentos_vidraria")
    private String equipamentosVidraria;

    @Column(name = "quantidade_vidraria")
    private String quantidadeVidraria;
}
