package com.answer.notinote.User.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter @Setter
public class TokenResponseDto {
    private String access_token;
    private String refresh_token;
}
