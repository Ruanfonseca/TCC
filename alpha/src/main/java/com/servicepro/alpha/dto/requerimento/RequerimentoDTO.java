package com.servicepro.alpha.dto.requerimento;

import com.servicepro.alpha.domain.Horario;
import com.servicepro.alpha.domain.Sala;
import lombok.Data;

import java.util.List;

@Data
public class RequerimentoDTO {
    private String blockPrefer;
    private String dia;
    private List<String> equipament;
    private String materia;
    private String numberOfPeople;
    private String observations;
    private String registration;
    private Horario scheduleInitial;
    private Horario scheduleEnd;
    private String status;
    private String typeOfRoom;

}
