package com.servicepro.alpha.dto.professor;

import lombok.Data;

@Data
public class ProfessorDTO {
    String name;
    String email;
    String phone;
    String department;
    String status;
    String specialization;
    Integer totalRequests;
    String password;
    String approvedRequests;
    String registerNumber;

}
