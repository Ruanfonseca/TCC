package com.back.Servicepro.dto.usuario;

import com.back.Servicepro.enums.RoleEnum;
import lombok.Builder;

@Builder
public record UsuarioOnlineResponseDTO (String nome, String email, RoleEnum role){

}
