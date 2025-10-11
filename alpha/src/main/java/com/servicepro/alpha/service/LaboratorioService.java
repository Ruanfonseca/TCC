package com.servicepro.alpha.service;

import com.servicepro.alpha.domain.Laboratorio;
import com.servicepro.alpha.domain.Sala;
import com.servicepro.alpha.dto.laboratorio.LaboratorioDTO;
import com.servicepro.alpha.repository.LaboratorioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LaboratorioService {

    @Autowired
    private LaboratorioRepository repository;

    public List<Laboratorio> buscarLabs() {
        return repository.findAll();
    }

    public Laboratorio buscarLab(String nome) {
        return repository.findByNome(nome);
    }

    public void salvarLab(LaboratorioDTO dto) {
        Laboratorio lab = new Laboratorio();
        lab.setNome(dto.getNome());
        lab.setBloco(dto.getBloco());
        lab.setCapacidade(dto.getCapacidade());
        lab.setEquipamento(dto.getEquipamento());
        lab.setStatus(dto.getStatus());
        lab.setAndar(dto.getAndar());
        lab.setDescricao(dto.getDescricao());
        lab.setTipoLab(dto.getTipoLab());
        lab.setDescricao(dto.getDescricao());
        lab.setCreatedAt(LocalDate.now());
        repository.save(lab);
    }

    public Laboratorio atualizarLab(String id,LaboratorioDTO dto) {
        Optional<Laboratorio> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return null;
        }
        Laboratorio lab = optional.get();
        lab.setNome(dto.getNome());
        lab.setBloco(dto.getBloco());
        lab.setCapacidade(dto.getCapacidade());
        lab.setEquipamento(dto.getEquipamento());
        lab.setStatus(dto.getStatus());
        lab.setAndar(dto.getAndar());
        lab.setDescricao(dto.getDescricao());
        lab.setTipoLab(dto.getTipoLab());
        lab.setDescricao(dto.getDescricao());
        lab.setUpdatedAt(LocalDate.now());
        repository.save(lab);
        return lab;
    }

    public boolean deletarLaboratorio(String id) {
        Optional<Laboratorio> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return false;
        }
        repository.deleteById(Long.valueOf(id));
        return true;
    }


}
