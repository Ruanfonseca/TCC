package com.back.Servicepro.models;

import com.back.Servicepro.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "Usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String login;

    @Column(nullable = false)
    private String senha;

    private String matricula;

    private String faculdade = "";

    private String setor = "";

    private String telefone="";

    @Column(nullable = false)
    private RoleEnum role;

    public Usuario(String nome, String login, String senha,
                   String matricula, String faculdade, String setor, RoleEnum role) {
        this.nome = nome;
        this.login = login;
        this.senha = senha;
        this.matricula = matricula;
        this.faculdade = faculdade;
        this.setor = setor;
        this.role = role;
    }

    public Usuario(String nome, String login, String senha,
                   String matricula, String faculdade, RoleEnum role,String telefone) {
        this(nome, login, senha, matricula, faculdade, "", role);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == RoleEnum.ADMIN) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        }
        return List.of(
                new SimpleGrantedAuthority("ROLE_USER")
        );
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
