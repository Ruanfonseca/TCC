package com.back.Servicepro.template;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@Setter
public class MSG_SMTP implements Serializable {

    private static final long serialVersionUID = 1L;

    private String MSG;

    private String EMAIL;

    private String NOME;

    @JsonCreator
    public MSG_SMTP(@JsonProperty("MSG") String MSG,
                    @JsonProperty("EMAIL") String EMAIL,
                    @JsonProperty("NOME") String NOME){
        this.MSG = MSG;
        this.EMAIL = EMAIL;
        this.NOME = NOME;
    }

    @Override
    public String toString() {
        return "MSG_SMTP{" +
                "MSG='" + MSG + '\'' +
                ", EMAIL='" + EMAIL + '\'' +
                ", NOME='" + NOME + '\'' +
                '}';
    }
}
