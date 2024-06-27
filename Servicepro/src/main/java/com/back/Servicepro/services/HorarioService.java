package com.back.Servicepro.services;

import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.interfaces.IHorarioService;
import com.back.Servicepro.dto.horario.HorarioDTO;
import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.repository.HorarioRepository;
import com.back.Servicepro.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HorarioService implements IHorarioService {

    @Autowired
    private HorarioRepository repository;


    @Override
    public Boolean salvar(HorarioDTO dto) {

        Optional<Horario> horarioExistente = repository.findByNome(dto.nome());

        if (horarioExistente.isPresent()) {
            return false;

        } else {
            try {

                Horario entity = new Horario(dto.nome(), dto.periodo());


                Horario savedEntity = repository.save(entity);


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

    public Optional<Horario> buscarPorNome(String nome){
       Optional<Horario> horario = repository.findByNome(nome);
       return horario;
    }


    @Override
    public Boolean editar(Horario horario) {
        repository.save(horario);
        return true;
    }

    @Override
    public List<Horario> buscarTodosHorarios()
    {
        return repository.findAll();
    }

    @Override
    public Boolean deletar(Horario deletado) {
         repository.delete(deletado);
        return true;
    }
}
