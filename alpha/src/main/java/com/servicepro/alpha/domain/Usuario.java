package com.servicepro.alpha.domain;

import com.servicepro.alpha.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;
    private String email;
    private String password;
    private String department;
    private String registerNumber;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String status;
    private String phone;
    private LocalDate updatedAt;
    private LocalDate createdAt;

}
