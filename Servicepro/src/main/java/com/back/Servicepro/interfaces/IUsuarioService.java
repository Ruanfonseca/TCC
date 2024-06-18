package com.back.Servicepro.interfaces;

import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.models.Usuario;

import java.util.List;

public interface IUsuarioService {

public Boolean salvar(UsuarioDTO usuarioDTO);



//Buscar todos
    public List<Usuario> buscarTodos();


}
