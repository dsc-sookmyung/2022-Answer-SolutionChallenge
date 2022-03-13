package com.answer.notinote.User.dto;

import com.answer.notinote.Child.dto.ChildDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class JoinRequestDto {
    Long uid;
    Long uprofileImg;
    String username;
    String ulanguage;
    List<ChildDto> uchildren;
}
