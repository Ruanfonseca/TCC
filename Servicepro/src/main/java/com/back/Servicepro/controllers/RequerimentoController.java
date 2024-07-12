package com.back.Servicepro.controllers;

import com.back.Servicepro.dto.requerimento.RequerimentoDTO;
import com.back.Servicepro.dto.requerimento.StatusDTO;
import com.back.Servicepro.mensageria.RabbitmqConstantes;
import com.back.Servicepro.mensageria.RabbitmqService;
import com.back.Servicepro.models.Requerimento;
import com.back.Servicepro.models.Sala;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.ReqService;
import com.back.Servicepro.services.SalaService;
import com.back.Servicepro.services.UsuarioService;
import com.back.Servicepro.template.MSG_SMTP;
import com.back.Servicepro.util.RequerimentoUtil;
import jakarta.validation.Valid;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.back.Servicepro.util.RequerimentoUtil.convertToDto;

@RestController
@CrossOrigin("*")
@RequestMapping("/requerimento")
public class RequerimentoController {

    @Autowired
    private ReqService service;

    @Autowired
    private UsuarioService Uservice;

    @Autowired
    private SalaService Sservice;

    @Autowired
    private RabbitmqService rabbitmqService;

    @PostMapping("/cadastrar")
    private ResponseEntity<Boolean> salvar(@RequestBody RequerimentoDTO dto) {
        boolean result = service.salvar(dto);

        return new ResponseEntity<>(result, result ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/listagem")
    public List<RequerimentoDTO> buscarPorstatus(@RequestBody StatusDTO dto) {
        if (!dto.status().isEmpty()) {

            List<Requerimento> requerimentos = service.buscarPorStatus(dto.status());

            return requerimentos.stream()
                    .map(RequerimentoUtil::convertToDto)
                    .collect(Collectors.toList());
        } else {

            return Collections.emptyList();
        }
    }


    @PutMapping("/baixa")
    public ResponseEntity<Boolean> darBaixa(@Valid @RequestBody RequerimentoDTO dto){


        //verifica se existe o requerimento,buscando por código
        Optional<Requerimento> existente = service.buscarPorCodigo(dto.codigo());

        //existindo..
        if (existente.isPresent()) {

            //verifique o se o usuario que solicitou existe
            Optional<Usuario>usuario = Uservice.buscarPorMatricula(dto.matriculaFunc());


            //se existir , verifique se é administrador
            if (usuario.isPresent()){

                Requerimento atual = existente.get();

                //status da sala atualizado , não ficará disponivel na lista
                Optional<Sala> salaReservada = Sservice.buscarPorNome(dto.sala());
                   if (salaReservada.isPresent()){
                       salaReservada.get().setStatus_da_sala("A");
                       Sservice.salvarReserva(salaReservada.get());
                   }

                //e atualiza o requerimento
                atual.setSala(dto.sala());
                atual.setHorarioInicial(dto.horarioInicial());
                atual.setHorarioFinal(dto.horarioFinal());
                atual.setNome(dto.nome());
                atual.setData(dto.data());
                atual.setEmail(dto.email());
                atual.setTelefone(dto.telefone());
                atual.setMatricula(dto.matricula());
                atual.setMotivoJustificativa(dto.motivoJustificativa());
                atual.setStatus(dto.status());
                atual.setMatriculaFunc(usuario.get().getMatricula());
                atual.setNomeFunc(usuario.get().getNome());

                service.editar(atual);


                /*Conexão com o brocker*/
                LocalDateTime data = LocalDateTime.now();

                //cria a mensagem
                String mensagem = "O Requerimento com o código " + atual.getCodigo() +" foi finalizado no dia "+ data +
                        ", Mensagem da Logística : "+atual.getRetorno();

                //cria o objeto de mensagem
                MSG_SMTP msgSmtp = new MSG_SMTP(mensagem,atual.getEmail(), atual.getNome());

                //envia o objeto contendo a mensagem com a flag da fila
                this.rabbitmqService.enviaMensagem(RabbitmqConstantes.FILA_SALA,msgSmtp);

                return new ResponseEntity<>(true, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("/editar")
    public ResponseEntity<Boolean> editar(@Valid @RequestBody RequerimentoDTO dto) {
        Optional<Requerimento> existente = service.buscarPorCodigo(dto.codigo());

        if (existente.isPresent()) {

            Optional<Usuario>usuario = Uservice.buscarPorMatricula(dto.matriculaFunc());

            if (usuario.isPresent()){
                Requerimento atual = existente.get();
                atual.setSala(dto.sala());
                atual.setHorarioInicial(dto.horarioInicial());
                atual.setHorarioFinal(dto.horarioFinal());
                atual.setNome(dto.nome());
                atual.setData(dto.data());
                atual.setEmail(dto.email());
                atual.setTelefone(dto.telefone());
                atual.setMatricula(dto.matricula());
                atual.setMotivoJustificativa(dto.motivoJustificativa());
                atual.setStatus(dto.status());
                atual.setMatriculaFunc(usuario.get().getMatricula());
                atual.setNomeFunc(usuario.get().getNome());

                service.editar(atual);
                return new ResponseEntity<>(true, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
        }
    }

    //requerimento do modal da lista
    @PutMapping("/requerimento/editar/pendente")
    public ResponseEntity<?>atualizarReqPendente(@Valid @RequestBody RequerimentoDTO dto){

        Optional<Requerimento> existente = service.buscarPorCodigo(dto.codigo());

        if (existente.isPresent()) {

              Requerimento atual = existente.get();
                atual.setSala(dto.sala());
                atual.setHorarioInicial(dto.horarioInicial());
                atual.setHorarioFinal(dto.horarioFinal());
                atual.setNome(dto.nome());
                atual.setData(dto.data());
                atual.setEmail(dto.email());
                atual.setTelefone(dto.telefone());
                atual.setMatricula(dto.matricula());
                atual.setMotivoJustificativa(dto.motivoJustificativa());

                service.editar(atual);
                return new ResponseEntity<>(true, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
            }
    }
    @DeleteMapping("/deletar")
    public ResponseEntity<Boolean> deletar(@RequestParam String nome) {
        Optional<Requerimento> requerimento = service.buscarPorNome(nome);

        if (requerimento.isPresent()) {
            service.deletar(requerimento.get());
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
        }
    }


}
