package com.back.Servicepro.util;

import com.back.Servicepro.dto.requerimento.RequerimentoDTO;
import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.models.Requerimento;
import com.back.Servicepro.models.Sala;
import org.springframework.stereotype.Component;

@Component
public class SalaUtil {
    public static SalaDTO convertToDto(Sala model) {
        return new SalaDTO(
                model.getNome(),
                model.getCapacidade(),
                model.getStatus_da_sala()
        );
    }

}
