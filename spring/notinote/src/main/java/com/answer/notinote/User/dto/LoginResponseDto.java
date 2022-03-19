package com.answer.notinote.User.dto;

import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Child.dto.ChildDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@AllArgsConstructor
@Getter @Setter
public class LoginResponseDto {
    private Long uid;
    private String username;
    private String uemail;
    private String ulanguage;
    private List<ChildDto> uchildren;
    private RoleType roles;
}
