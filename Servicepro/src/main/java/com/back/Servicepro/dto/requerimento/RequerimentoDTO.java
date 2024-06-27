package com.back.Servicepro.dto.requerimento;

import com.back.Servicepro.dto.horario.HorarioDTO;
import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Sala;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.Date;

public record RequerimentoDTO(
        String sala,
        String horarioInicial,
        String horarioFinal,
        String data,
        String matricula,
        String nome,

        String email,

        String telefone,
        String motivoJustificativa,
        String status,

        String nomeFunc,

        String matriculaFunc,

        String retorno,
        String codigo
) {
}
