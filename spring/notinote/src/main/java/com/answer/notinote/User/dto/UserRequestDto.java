package com.answer.notinote.User.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserRequestDto {
    private String email;
    private String firstname;
    private String lastname;
    private String password;
}
