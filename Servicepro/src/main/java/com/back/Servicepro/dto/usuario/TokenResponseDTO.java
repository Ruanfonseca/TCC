package com.back.Servicepro.dto.usuario;

import com.back.Servicepro.enums.RoleEnum;
import lombok.Builder;

@Builder
public record TokenResponseDTO(String token , String nome , String email, RoleEnum role) {

}
