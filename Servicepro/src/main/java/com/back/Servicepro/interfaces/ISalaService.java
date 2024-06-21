package com.back.Servicepro.interfaces;


import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.models.Sala;

import java.util.List;
import java.util.Optional;

public interface ISalaService {
    //Crud completo

    //salvar
    public Boolean salvar(SalaDTO dto);

    //editar
    public Boolean editar(Sala dto);


    //Buscar todos
    public List<Sala> buscarTodos();

    public Optional<Sala> buscarPorNome(String nome);


    //excluir
    public Boolean deletar(Sala dto);

}
