package com.back.Servicepro.controllers;


import com.back.Servicepro.dto.requerimento.CodigoDTO;
import com.back.Servicepro.dto.requerimento.RequerimentoDTO;
import com.back.Servicepro.dto.usuario.MatriculaRequestDTO;
import com.back.Servicepro.dto.usuario.UsuarioDTO;
import com.back.Servicepro.dto.usuario.UsuarioOnlineDTO;
import com.back.Servicepro.dto.usuario.UsuarioOnlineResponseDTO;
import com.back.Servicepro.models.Requerimento;
import com.back.Servicepro.models.Usuario;
import com.back.Servicepro.services.ReqService;
import com.back.Servicepro.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/busca")
@CrossOrigin("*")
public class BuscaController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private ReqService reqService;


    @GetMapping("/matricula")
    private ResponseEntity<UsuarioDTO> buscarPorMatricula(@RequestParam MatriculaRequestDTO MrequestDTO) {
        Optional<Usuario> usuario = usuarioService.buscarPorMatricula(MrequestDTO.matricula());

        if (usuario.isPresent()) {
            UsuarioDTO dto = new UsuarioDTO(
                    usuario.get().getNome(),
                    usuario.get().getLogin(),
                    usuario.get().getFaculdade(),
                    usuario.get().getMatricula(),
                    usuario.get().getSetor(),
                    usuario.get().getSenha(),
                    usuario.get().getTelefone(),
                    usuario.get().getRole()

            );
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/requerimento")
    private ResponseEntity<RequerimentoDTO> buscarPorCodigo(@RequestParam CodigoDTO dto) {

        Optional<Requerimento> req = reqService.buscarPorCodigo(dto.codigo());

        if (req.isPresent()) {
            RequerimentoDTO requerimentoDTO = new RequerimentoDTO(
                    req.get().getSala(),
                    req.get().getHorarioInicial(),
                    req.get().getHorarioFinal(),
                    req.get().getData(),
                    req.get().getMatricula(),
                    req.get().getNome(),
                    req.get().getEmail(),
                    req.get().getTelefone(),
                    req.get().getMotivoJustificativa(),
                    req.get().getStatus(),
                    req.get().getNomeFunc(),
                    req.get().getMatriculaFunc(),
                    req.get().getRetorno(),
                    req.get().getCodigo()
            );
            return ResponseEntity.ok(requerimentoDTO);
        } else {

            return ResponseEntity.notFound().build();
        }
    }







}
