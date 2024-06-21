package com.back.Servicepro.interfaces;

import com.back.Servicepro.dto.horario.HorarioDTO;
import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Sala;

import java.util.List;
import java.util.Optional;

public interface IHorarioService {
    //Crud completo

    //salvar
    public Boolean salvar(HorarioDTO dto);

    //editar
    public Boolean editar(Horario horario);


    //Buscar todos
    public List<Horario> buscarTodos();


    public Optional<Horario> buscarPorNome(String nome);

    //excluir
    public Boolean deletar(Horario deletado);


}
