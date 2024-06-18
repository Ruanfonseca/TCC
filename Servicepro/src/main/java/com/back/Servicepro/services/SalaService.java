package com.back.Servicepro.services;

import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.infra.exceptions.BusinessException;
import com.back.Servicepro.interfaces.ISalaService;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    public Boolean editar(SalaDTO dto) {
        return null;
    }

    @Override
    public List<Sala> buscarTodos() {
        return repository.findAll();
    }


    @Override
    public Boolean deletar(SalaDTO dto) {
        return null;
    }
}
