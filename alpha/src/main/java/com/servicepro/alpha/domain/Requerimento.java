package com.servicepro.alpha.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "requerimento")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Requerimento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @OneToOne
    @JoinColumn(name = "room_id")
    private Sala room;

    @OneToOne
    @JoinColumn(name = "horario_inicial_id")
    private Horario scheduleInitial;

    @OneToOne
    @JoinColumn(name = "horario_final_id")
    private Horario scheduleEnd;


    private String materia;
    private String numberOfPeople;
    private String dia;
    @OneToOne
    @JoinColumn(name = "required_by_id")
    private Professor requiredBy;
    private String token;
    private String blockPrefer;
    private String typeOfRoom;
    private String registration;
    private String rejectedBy;
    private String approvedReason;

    @ElementCollection
    @CollectionTable(name = "equipament", joinColumns = @JoinColumn(name = "equipament_id"))
    @Column(name = "equipament")
    private List<String> equipament = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_action_id")
    private Usuario userOfAction;

    private String observations;
    private String status;
    private String approvedBy;
    private String rejectionReason;
    private LocalDate createdAt;
    private LocalDate updatedAt;

}
