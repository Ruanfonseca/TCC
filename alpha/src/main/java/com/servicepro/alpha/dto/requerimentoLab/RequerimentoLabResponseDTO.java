package com.servicepro.alpha.dto.requerimentoLab;

import com.servicepro.alpha.domain.Horario;
import com.servicepro.alpha.domain.Laboratorio;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class RequerimentoLabResponseDTO extends RequerimentoLabDTO{
    private Long id;
    private Long laboratorioId;
    private Laboratorio laboratorio;
    private String observations;
    private String status;
    private String approvedBy;
    private String rejectedBy;
    private String rejectionReason;
    private String approvedReason;
    private String updatedAt;

}
