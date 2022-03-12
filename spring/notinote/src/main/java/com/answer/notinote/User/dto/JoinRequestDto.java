package com.answer.notinote.User.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class JoinRequestDto {
    Long id;
    Long profileImg;
    String username;
    String ulanguage;
    Long childrenNumber;
    List<String> childrenName;
    List<String> childrenColor;
}
