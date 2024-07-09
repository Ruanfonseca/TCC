package com.back.Servicepro.util;

import com.back.Servicepro.dto.horario.HorarioDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioUtil {
    public static UsuarioDTO convertToDto(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getNome(),
                usuario.getLogin(),
                usuario.getMatricula(),
                usuario.getFaculdade(),
                usuario.getSetor(),
                usuario.getSenha(),
                usuario.getTelefone(),
                usuario.getRole()
        );
    }
}
