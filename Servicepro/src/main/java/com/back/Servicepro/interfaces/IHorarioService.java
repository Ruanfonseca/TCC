package com.back.Servicepro.interfaces;

import com.back.Servicepro.dto.horario.HorarioDTO;
import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Usuario;

import java.util.List;

public interface IHorarioService {
    //Crud completo

    //salvar
    public Boolean salvar(HorarioDTO dto);

    //editar
    public Boolean editar(HorarioDTO dto);


    //Buscar todos
    public List<Horario> buscarTodos();

    //excluir
    public Boolean deletar(HorarioDTO dto);
}
