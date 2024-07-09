package com.back.Servicepro.services;

import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.interfaces.ISalaService;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SalaService implements ISalaService {

    @Autowired
    private SalaRepository repository;

    @Override
    public Boolean salvar(SalaDTO dto) {

        Optional<Sala> salaExistente = repository.findByNome(dto.nome());

        if (salaExistente.isPresent()) {
            return false;

        } else {
            try {

                Sala entity = new Sala(dto.nome(), dto.capacidade(), dto.status_da_sala());


                Sala savedEntity = repository.save(entity);


                if (savedEntity != null) {
                    return true;
                } else {
                    return false;
                }
            } catch (Exception e) {
                e.printStackTrace();
                return false;              }
        }
    }

    public void salvarReserva(Sala dto) {

        repository.save(dto);

    }

    @Override
    public Boolean editar(Sala editado)
    {
        repository.save(editado);
        return true;
    }

    @Override
    public List<Sala> buscarTodasSalas()
    {
        return repository.findAll();
    }
    @Override
    public List<Sala> buscarTodasSalasDisponiveis(){
        return repository.findByStatus("P");
    }
    public Optional<Sala> buscarPorNome(String nome) {
        return repository.findByNome(nome);
    }


    @Override
    public Boolean deletar(Sala deletado)
    {
        repository.delete(deletado);
        return true;
    }


}
