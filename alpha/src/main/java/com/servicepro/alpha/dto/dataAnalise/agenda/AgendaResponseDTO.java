package com.servicepro.alpha.dto.dataAnalise.agenda;

import lombok.Data;

@Data
public class AgendaResponseDTO {

    private String id;
    private String type;
    private String date;
    private String timeStart;
    private String timeEnd;
    private String title;
    private String professorName;
    private String subject;
    private String numberOfStudents;
    private String status;
    private String location;
    private String observations;
    private String token;
}
