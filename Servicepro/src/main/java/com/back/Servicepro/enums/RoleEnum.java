package com.back.Servicepro.enums;

import lombok.Data;
import lombok.Getter;

@Getter
public enum RoleEnum {

    ADMIN("admin"),
    USER("user");

  private String role;

    RoleEnum(String role){
        this.role = role;
    }

}
