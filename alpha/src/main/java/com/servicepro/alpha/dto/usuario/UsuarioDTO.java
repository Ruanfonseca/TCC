package com.servicepro.alpha.dto.usuario;

import com.servicepro.alpha.enums.Role;
import lombok.Data;

@Data
public class UsuarioDTO {
    private String name;
    private String email;
    private Role role;
    private String status;
    private String departament;
    private String phone;
    private String password;
    private String lastLogin;
    private String registerNumber;

}
