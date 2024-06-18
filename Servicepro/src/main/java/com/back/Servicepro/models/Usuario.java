package com.back.Servicepro.models;

import com.back.Servicepro.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "USUARIO")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String login;

    @Column(nullable = false)
    private String matricula;


    private String faculdade = "";

    private String setor = "";


    @Column(nullable = false)
    private RoleEnum role;


    public Usuario(String nome, String login,String matricula,String faculdade,String setor, RoleEnum role){
        this.nome = nome;
        this.login = login;
        this.matricula = matricula;
        this.faculdade = faculdade;
        this.setor = setor;
        this.role = role;

    }


    @Override
    public Collection<? extends GrantedAuthority>getAuthorities(){
        if (this.role == RoleEnum.ADMIN){
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
        return this.matricula;
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
