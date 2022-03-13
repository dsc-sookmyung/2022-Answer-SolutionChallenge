package com.answer.notinote.Auth.data.dto;

import com.answer.notinote.Auth.data.ProviderType;
import com.answer.notinote.Auth.data.RoleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserAuthRequestDto {
    private String email;
    private String username;
    private ProviderType providerType;
    private RoleType roleType;
}
