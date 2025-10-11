package com.servicepro.alpha.dto.laboratorio;

import com.servicepro.alpha.enums.TipoLab;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import java.util.ArrayList;
import java.util.List;

@Data
public class LaboratorioDTO {
    private String nome;
    private String bloco;
    private String capacidade;
    private List<String> equipamento = new ArrayList<>();
    private String status;
    private String andar;
    private String descricao;
    private TipoLab tipoLab;
}
