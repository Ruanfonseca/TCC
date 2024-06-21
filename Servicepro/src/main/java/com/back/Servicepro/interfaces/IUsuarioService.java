package com.back.Servicepro.interfaces;

import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.models.Usuario;

import java.util.List;
import java.util.Optional;

public interface IUsuarioService {

public Boolean salvar(UsuarioDTO usuarioDTO);

public void editar(Usuario editado);

//Buscar todos
    public List<Usuario> buscarTodos();

    public Optional<Usuario> buscarPorMatricula(String Matricula);

    public void deletar(Usuario deletado);



}
