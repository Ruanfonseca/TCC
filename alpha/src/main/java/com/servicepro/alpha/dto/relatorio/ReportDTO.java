package com.servicepro.alpha.dto.relatorio;

import com.servicepro.alpha.domain.Report;
import com.servicepro.alpha.domain.Requerimento;
import com.servicepro.alpha.domain.RequerimentoLaboratorio;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
public class ReportDTO {
    private String reportType;
    private LocalDate startDate;
    private LocalDate endDate;
}
