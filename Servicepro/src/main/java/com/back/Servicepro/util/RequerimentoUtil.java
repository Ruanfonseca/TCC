package com.back.Servicepro.util;

import com.back.Servicepro.dto.requerimento.RequerimentoDTO;
import com.back.Servicepro.models.Requerimento;
import org.springframework.stereotype.Component;

@Component
public class RequerimentoUtil {

    public static RequerimentoDTO convertToDto(Requerimento requerimento) {
        return new RequerimentoDTO(
                requerimento.getSala(),
                requerimento.getHorarioInicial(),
                requerimento.getHorarioFinal(),
                requerimento.getNome(),
                requerimento.getData(),
                requerimento.getEmail(),
                requerimento.getTelefone(),
                requerimento.getMatricula(),
                requerimento.getMotivoJustificativa(),
                requerimento.getStatus(),
                requerimento.getNomeFunc(),
                requerimento.getMatriculaFunc(),
                requerimento.getRetorno(),
                requerimento.getCodigo()
        );
    }

}
