package com.back.Servicepro.dto.usuario;

import com.back.Servicepro.enums.RoleEnum;

import java.io.Serializable;

public record UsuarioDTO(
        String nome,

        String login,

        String matricula,

        String faculdade,

        String setor,

        RoleEnum role
) {

}
