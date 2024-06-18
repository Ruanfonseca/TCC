package com.back.Servicepro.controllers;

import com.back.Servicepro.dto.horario.HorarioDTO;
import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.services.HorarioService;
import com.back.Servicepro.services.SalaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
                    horario.getPeriodo()
            );

            retornoHorario.add(DTO);
        }

        return retornoHorario;
    }


}
