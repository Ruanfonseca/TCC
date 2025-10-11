package com.servicepro.alpha.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private String id;
    private String email;
    private String registration;
    private String name;
    private String role;
}
