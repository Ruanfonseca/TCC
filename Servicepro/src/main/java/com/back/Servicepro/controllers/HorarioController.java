package com.back.Servicepro.controllers;

import com.back.Servicepro.dto.horario.HorarioDTO;
import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.dto.usuario.MatriculaRequestDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.HorarioService;
import com.back.Servicepro.services.SalaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/horario")
public class HorarioController {

    @Autowired
    private HorarioService service;

    @PostMapping("/cadastrar")
    private boolean salvar(@RequestBody HorarioDTO dto) {

        if (service.salvar(dto)){

            return true;

        }

        return false;
    }

    @GetMapping("/listagem")
    private List<HorarioDTO> buscarTodos() {
        List<Horario> horarios = service.buscarTodos();
        List<HorarioDTO> retornoHorario = new ArrayList<>();

        for (Horario horario : horarios) {
            HorarioDTO DTO = new HorarioDTO(
                    horario.getNome(),
                    horario.getPeriodo(),
                    horario.getHoraInicio(),
                    horario.getHoraFim()
            );

            retornoHorario.add(DTO);
        }

        return retornoHorario;
    }

    @GetMapping("/busca/nome")
    private ResponseEntity<HorarioDTO> buscarPorMatricula(@RequestBody HorarioDTO dto)
    {
        Optional<Horario> horario = service.buscarPorNome(dto.nome());

        HorarioDTO horarioDTO = new HorarioDTO(
                horario.get().getNome(),
                horario.get().getHoraInicio(),
                horario.get().getHoraFim(),
                horario.get().getPeriodo()


        );
        return new ResponseEntity<>(horarioDTO, HttpStatus.OK);
    }

    @PutMapping("/editar")
    public ResponseEntity<Boolean> Put(@Valid @RequestBody HorarioDTO novoHorario)
    {
        Optional<Horario> AntigoHorario = service.buscarPorNome(novoHorario.nome());

        if(AntigoHorario.isPresent()){


            AntigoHorario.get().setNome(novoHorario.nome());

            service.editar(AntigoHorario.get());

            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deletar")
    public ResponseEntity<Boolean> Delete(@RequestBody SalaDTO dto){

        Optional<Horario> horario = service.buscarPorNome(dto.nome());

        if(horario.isPresent()){

            service.deletar(horario.get());

            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);

    }


}
