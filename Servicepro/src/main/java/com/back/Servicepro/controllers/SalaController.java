package com.back.Servicepro.controllers;

import com.back.Servicepro.dto.sala.SalaDTO;
import com.back.Servicepro.dto.usuario.MatriculaRequestDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.models.Usuario;
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

    @GetMapping("/busca/nome")
    private ResponseEntity<SalaDTO> buscarPorNome(@RequestBody SalaDTO dto)
    {
        Optional<Sala> sala = service.buscarPorNome(dto.nome());

        SalaDTO salaDTO = new SalaDTO(
                sala.get().getNome(),
                sala.get().getStatus_da_sala(),
                sala.get().getCapacidade()
        );
        return new ResponseEntity<>(salaDTO, HttpStatus.OK);
    }

    @PutMapping("/editar")
    public ResponseEntity<Boolean> Put(@Valid @RequestBody SalaDTO dto)
    {
        Optional<Sala> AntigaSala = service.buscarPorNome(dto.nome());

        if(AntigaSala.isPresent()){

            AntigaSala.get().setNome(dto.nome());
            AntigaSala.get().setStatus_da_sala(dto.status_da_sala());
            AntigaSala.get().setCapacidade(dto.capacidade());


            service.editar(AntigaSala.get());

            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deletar")
    public ResponseEntity<Boolean> Delete(@RequestBody SalaDTO dto){

        Optional<Sala> sala = service.buscarPorNome(dto.nome());

        if(sala.isPresent()){

            service.deletar(sala.get());

            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);

    }


}
