package com.back.Servicepro.dto.usuario;

import com.back.Servicepro.enums.RoleEnum;

public record ProfessorDTO(String nome, String login,
                           String matricula, String faculdade,
                           String telefone,
                           String senha,
                           RoleEnum role){

}
