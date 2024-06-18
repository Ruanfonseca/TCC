package com.back.Servicepro.interfaces;


import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.models.Usuario;

import java.util.List;

public interface ISalaService {
    //Crud completo

    //salvar
    public Boolean salvar(SalaDTO dto);

    //editar
    public Boolean editar(SalaDTO dto);


    //Buscar todos
    public List<Sala> buscarTodos();


    //excluir
    public Boolean deletar(SalaDTO dto);

}
