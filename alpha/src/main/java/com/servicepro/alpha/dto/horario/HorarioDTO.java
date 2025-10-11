package com.servicepro.alpha.dto.horario;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class HorarioDTO {

    private String name;
    private String startTime;
    private String endTime;
    private List<String> days;
    private String semester;
    private String status;
    private String description;
    private String createdAt;
    private String updatedAt;
}
