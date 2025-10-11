package com.consumer.rabbitmq.templates;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class TemplateMSG implements Serializable {

    private static final long serialVersionUID = 1L;

    private String msg;
    private String email;
    private String nome;

    @JsonCreator
    public TemplateMSG(@JsonProperty("msg") String msg,
                       @JsonProperty("email") String email,
                       @JsonProperty("nome") String nome) {
        this.msg = msg;
        this.email = email;
        this.nome = nome;
    }
}