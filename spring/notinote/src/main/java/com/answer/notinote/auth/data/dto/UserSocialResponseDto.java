package com.answer.notinote.auth.data.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Builder
public class UserSocialResponseDto {
    String email;
    String firstname;
    String lastname;
}
