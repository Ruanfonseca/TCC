package com.servicepro.alpha.mensageria.template;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PayloadSmtp {

    private String MSG;

    private String EMAIL;

    private String NOME;


    @JsonCreator
    public PayloadSmtp(@JsonProperty("MSG") String MSG,
                    @JsonProperty("EMAIL") String EMAIL,
                    @JsonProperty("NOME") String NOME){
        this.MSG = MSG;
        this.EMAIL = EMAIL;
        this.NOME = NOME;
    }
}
