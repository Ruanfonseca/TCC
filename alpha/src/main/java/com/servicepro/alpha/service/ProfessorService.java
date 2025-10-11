package com.servicepro.alpha.service;

import com.servicepro.alpha.domain.Professor;
import com.servicepro.alpha.dto.professor.ProfessorDTO;
import com.servicepro.alpha.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository repository;

    public List<Professor> buscarProfessor() {
        return repository.findAll();
    }

    public Professor buscarProfessorPorMatricula(String matricula) {
        return repository.findByMatricula(matricula);
    }

    public Professor salvarProfessor(ProfessorDTO dto) {
        Professor professor = new Professor();
        professor.setNome(dto.getName());
        professor.setEmail(dto.getEmail());
        professor.setPhone(dto.getPhone());
        professor.setDepartamento(dto.getDepartment());
        professor.setStatus(dto.getStatus());
        professor.setMatricula(dto.getRegisterNumber());
        professor.setEspecialidade(dto.getSpecialization());
        professor.setSenha(dto.getPassword());
        professor.setTotalRequests(dto.getTotalRequests());
        professor.setCreatedAt(LocalDate.now());

        return repository.save(professor);
    }

    public Professor atualizarProfessor(String id, ProfessorDTO dto) {

        try {
            Optional<Professor> optional = repository.findById(Long.valueOf(id));

            if (optional.isEmpty()) {
                return null;
            }

            Professor professor = optional.get();

            // Atualizando campos
            professor.setNome(dto.getName());
            professor.setEmail(dto.getEmail());
            professor.setPhone(dto.getPhone());
            professor.setDepartamento(dto.getDepartment());
            professor.setStatus(dto.getStatus());
            professor.setMatricula(dto.getRegisterNumber());
            professor.setSenha(dto.getPassword());
            professor.setEspecialidade(dto.getSpecialization());
            professor.setTotalRequests(dto.getTotalRequests());
            professor.setUpdatedAt(LocalDate.now());

            Professor atualizado = repository.save(professor);

            return atualizado;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean deletarProfessor(String id) {
        Optional<Professor> optional = repository.findById(Long.valueOf(id));
        if (optional.isEmpty()) {
            return false;
        }
        repository.deleteById(Long.valueOf(id));
        return true;
    }
}
