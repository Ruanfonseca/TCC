package com.servicepro.alpha.service;

import com.servicepro.alpha.domain.Horario;
import com.servicepro.alpha.domain.Professor;
import com.servicepro.alpha.dto.horario.HorarioDTO;
import com.servicepro.alpha.dto.professor.ProfessorDTO;
import com.servicepro.alpha.repository.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HorarioService {

    @Autowired
    HorarioRepository repository;

    public List<Horario> buscarHorarios() {

        return repository.findAll();
    }

    public Horario buscarHorarioPorNome(String name) {

        return repository.findByName(name);
    }

    public Horario salvarHorario(HorarioDTO dto) {
        Horario horario = new Horario();
        horario.setName(dto.getName());
        horario.setStartTime(dto.getStartTime());
        horario.setEndTime(dto.getEndTime());
        horario.setDays(dto.getDays());
        horario.setSemester(dto.getSemester());
        horario.setStatus(dto.getStatus());
        horario.setDescription(dto.getDescription());
        horario.setCreatedAt(LocalDate.now());

        return repository.save(horario);
    }

    public Horario atualizarHorario(String id, HorarioDTO dto) {
        Optional<Horario> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return null;
        }
        Horario horario = optional.get();
        horario.setName(dto.getName());
        horario.setStartTime(dto.getStartTime());
        horario.setEndTime(dto.getEndTime());
        horario.setDays(dto.getDays());
        horario.setSemester(dto.getSemester());
        horario.setStatus(dto.getStatus());
        horario.setDescription(dto.getDescription());
        horario.setUpdatedAt(LocalDate.now());

        // Atualize outros campos do DTO conforme necessário
        return repository.save(horario);
    }

    public boolean deletarHorario(String id) {
        Optional<Horario> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return false;
        }
        repository.deleteById(Long.valueOf(id));
        return true;
    }
}
