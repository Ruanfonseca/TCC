package com.servicepro.alpha.dto.requerimentoLab;

import com.servicepro.alpha.domain.Horario;
import com.servicepro.alpha.domain.Laboratorio;
import lombok.Data;

import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.ArrayList;
import java.util.List;

@Data
public class RequerimentoLabDTO {
    private String curso;
    private String dia;
    private String token;
    private String disciplina;
    private String emailDocente;
    private Horario horarioFinal;
    private Horario horarioInicio;
    private String matriculaDocente;
    private String nomeDocente;
    private String numeroAluno;
    private String numeroGruposAlunos;
    private Boolean presencaTecnicoLaboratorista;
    private String tipoLab;
    private String tituloAula;
    private String unidadeAcademica;
    private String nomeTecnicoLaboratorista;
    private String status;
    private List<UtilitariosDTO> utilitarios = new ArrayList<>();
    private String confirmacaoLeitura;


}
