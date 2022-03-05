package com.answer.notinote.Oauth.data.dto;

import com.answer.notinote.Oauth.data.ProviderType;
import com.answer.notinote.Oauth.data.RoleType;
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
