package com.back.Servicepro.interfaces;


import com.back.Servicepro.dto.requerimento.RequerimentoDTO;
import com.back.Servicepro.models.Requerimento;

import java.util.List;
import java.util.Optional;

public interface IReqService {
    //Crud completo

    //salvar
    public boolean salvar(RequerimentoDTO dto);

    //editar
    public void editar(Requerimento requerimento);


    //Buscar todos
    public List<Requerimento> buscarTodosReq();


    List<Requerimento> buscarPorStatus(String status);

    public Optional<Requerimento> buscarPorCodigo(String codigo);


    //excluir
    public void deletar(Requerimento requerimento);

}
