package com.answer.notinote.Auth.data.dto;

import com.answer.notinote.Auth.data.ProviderType;
import com.answer.notinote.Auth.data.RoleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserRequestDto {
    private String email;
    private ProviderType providerType;
    private RoleType roleType;
}
