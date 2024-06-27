package com.back.Servicepro.services;

import com.back.Servicepro.dto.requerimento.RequerimentoDTO;
import com.back.Servicepro.interfaces.IReqService;
import com.back.Servicepro.models.Requerimento;
import com.back.Servicepro.repository.RequerimentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReqService implements IReqService{

    @Autowired
    private RequerimentoRepository repository;

    public boolean salvar(RequerimentoDTO dto) {
        Requerimento requerimento = new Requerimento();
        requerimento.setSala(dto.sala());
        requerimento.setHorarioInicial(dto.horarioInicial());
        requerimento.setHorarioFinal(dto.horarioFinal());
        requerimento.setNome(dto.nome());
        requerimento.setData(dto.data());
        requerimento.setEmail(dto.email());
        requerimento.setTelefone(dto.telefone());
        requerimento.setMatricula(dto.matricula());
        requerimento.setMotivoJustificativa(dto.motivoJustificativa());
        requerimento.setStatus(dto.status());
        requerimento.setCodigo(dto.codigo());

        repository.save(requerimento);
        return true;
    }


    public List<Requerimento> buscarTodosReq() {
        return repository.findAll();
    }

    @Override
    public List<Requerimento> buscarPorStatus(String status) {
        return repository.findByStatus(status);
    }

    public Optional<Requerimento> buscarPorCodigo(String codigo){
        return repository.findByCodigo(codigo);
    }
    public Optional<Requerimento> buscarPorNome(String nome) {
        return repository.findByNome(nome);
    }


    public void editar(Requerimento requerimento) {
        repository.save(requerimento);
    }


    public void deletar(Requerimento requerimento) {
        repository.delete(requerimento);
    }
}