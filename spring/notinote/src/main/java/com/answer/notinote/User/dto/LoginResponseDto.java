package com.answer.notinote.User.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter @Setter
public class LoginResponseDto {
    private Long id;
    private String username;
    private String email;
    private String access_token;
    private String refresh_token;
    private List<String> roles;
}
