package com.servicepro.alpha.dto.requerimento;

import com.servicepro.alpha.domain.Sala;
import lombok.Data;

@Data
public class RequerimentoBaixaDTO extends RequerimentoDTO {
    private Long id;
    private Long roomId;
    private String observations;
    private String status;
    private String approvedBy;
    private String rejectedBy;
    private String rejectionReason;
    private String approvedReason;
    private String updatedAt;
}
