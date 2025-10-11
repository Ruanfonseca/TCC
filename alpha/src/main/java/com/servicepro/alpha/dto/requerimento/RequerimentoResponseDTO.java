package com.servicepro.alpha.dto.requerimento;

import com.servicepro.alpha.domain.Horario;
import com.servicepro.alpha.domain.Sala;
import lombok.Data;

import java.util.List;

@Data
public class RequerimentoResponseDTO {
    private Long id;
    private String token;
    private Sala room;
    private Horario schedule;
    private String professorName;
    private String subject;
    private Integer numberOfStudents;
    private String date;
    private String time;
    private String block;
    private String roomType;
    private List<String> equipment;
    private String observations;
    private String status;
    private String approvedBy;
    private String rejectionReason;
    private String createdAt;
    private String updatedAt;
}
