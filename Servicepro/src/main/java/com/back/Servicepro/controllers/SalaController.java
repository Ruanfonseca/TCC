package com.back.Servicepro.controllers;

import com.back.Servicepro.dto.horario.HorarioDTO;
import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.models.Horario;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.SalaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/sala")
public class SalaController {
    @Autowired
    private SalaService service;

    @PostMapping("/cadastrar")
    private boolean salvar(@RequestBody SalaDTO dto) {

        if (service.salvar(dto)){

            return true;

        }

        return false;
    }

    @GetMapping("/listagem")
    private List<SalaDTO> buscarTodos() {
        List<Sala> salas = service.buscarTodos();
        List<SalaDTO> retornoSalas = new ArrayList<>();

        for (Sala sala : salas) {
            SalaDTO DTO = new SalaDTO(
                    sala.getNome(),
                    sala.getCapacidade(),
                    sala.getStatus_da_sala()
            );

            retornoSalas.add(DTO);
        }

        return retornoSalas;
    }




}
