package com.answer.notinote.User.dto;

import com.answer.notinote.Auth.data.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@AllArgsConstructor
@Getter @Setter
public class LoginResponseDto {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String language;
    private String access_token;
    private String refresh_token;
    private RoleType roles;
}
