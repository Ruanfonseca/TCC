package com.back.Servicepro.util;

import com.back.Servicepro.dto.horario.HorarioDTO;
import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Sala;
import org.springframework.stereotype.Component;

@Component
public class HorarioUtil {
    public static HorarioDTO convertToDto(Horario model) {
        return new HorarioDTO(
                model.getNome(),
                model.getPeriodo(),
                model.getHoraInicio(),
                model.getHoraFim()
        );
    }
}
