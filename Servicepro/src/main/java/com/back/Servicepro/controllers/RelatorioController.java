package com.back.Servicepro.controllers;


import com.back.Servicepro.dto.relatorio.RelatorioRequestDTO;
import com.back.Servicepro.models.Requerimento;
import com.back.Servicepro.services.ReqService;
import com.back.Servicepro.services.UsuarioService;
import com.back.Servicepro.util.RequerimentoUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/relatorio")
public class RelatorioController {

     private ReqService service;

    public RelatorioController(ReqService service) {
        this.service = service;
    }

    @GetMapping("/listagem")
    private ResponseEntity<?> requerimentosPorMatricula(RelatorioRequestDTO dto){
        if (!dto.Matricula().isEmpty() && !dto.DataInicial().isEmpty() && !dto.DataFinal().isEmpty()) {

            List<Requerimento> requerimentos =  service.buscarPorMatricula(dto.Matricula(),
                    dto.DataFinal(), dto.DataInicial());

           var retorno = requerimentos.stream()
                   .map(RequerimentoUtil::convertToDto)
                   .collect(Collectors.toList());


            return new ResponseEntity<>(retorno, HttpStatus.OK);

        } else {

            var retorno = Collections.emptyList();

            return new ResponseEntity<>(retorno,HttpStatus.NOT_FOUND);
        }

    }
}
