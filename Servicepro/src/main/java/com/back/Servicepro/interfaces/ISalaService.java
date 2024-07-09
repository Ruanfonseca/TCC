package com.back.Servicepro.interfaces;


import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.models.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ISalaService {
    //Crud completo

    //salvar
    public Boolean salvar(SalaDTO dto);

    //editar
    public Boolean editar(Sala dto);


    //Buscar todos
    List<Sala> buscarTodasSalas();

    List<Sala> buscarTodasSalasDisponiveis();

    public Optional<Sala> buscarPorNome(String nome);

    public void salvarReserva(Sala dto);


    //excluir
    public Boolean deletar(Sala dto);

}
