package com.servicepro.alpha.domain;

import com.servicepro.alpha.dto.requerimentoLab.UtilitariosDTO;
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
@Table(name = "requerimentolaboratorio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequerimentoLaboratorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeDocente;
    private String matriculaDocente;
    private String emailDocente;
    private String disciplina;
    private String curso;
    private String tipoLab;
    private String unidadeAcademica;
    private String tituloAula;
    private String dia;
    private Boolean presencaTecnicoLaboratorista;
    private String token;
    private String numeroGruposAlunos;
    private String nomeTecnicoLaboratorista;
    private String confirmacaoLeitura;

    @ManyToOne
    @JoinColumn(name = "horario_inicio_id")
    private Horario horarioInicio;

    @ManyToOne
    @JoinColumn(name = "horario_final_id")
    private Horario horarioFinal;

    // Muitos requerimentos -> um laboratório
    @ManyToOne
    @JoinColumn(name = "laboratorio_id")
    private Laboratorio laboratorio;

    @OneToOne
    @JoinColumn(name = "required_by_id")
    private Professor requiredBy;

    @OneToOne
    @JoinColumn(name = "user_action_id")
    private Usuario userOfAction;


    private String numeroAluno;

    @ElementCollection
    @CollectionTable(
            name = "requerimento_utilitarios",
            joinColumns = @JoinColumn(name = "requerimento_laboratorio_id")
    )
    private List<UtilitariosDTO> utilitarios = new ArrayList<>();

    private String approvedReason;
    private String status;
    private String observations;
    private String approvedBy;
    private String rejectedBy;
    private String rejectionReason;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
