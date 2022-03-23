package com.answer.notinote.User.dto;

import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.Child.dto.ChildDto;
import com.answer.notinote.User.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@Getter @Setter
public class UserResponseDto {
    private Long uid;
    private String username;
    private String uemail;
    private String ulanguage;
    private Long uprofileImg;
    private List<ChildDto> uchildren = new ArrayList<>();
    private RoleType uroleType;

    public UserResponseDto(User user) {
        this.uid = user.getUid();
        this.username = user.getUsername();
        this.uemail = user.getUemail();
        this.ulanguage = user.getUlanguage();
        this.uprofileImg = user.getUprofileImg();
        this.uroleType = user.getUroleType();

        if (user.getUchildren() != null) {
            user.getUchildren().forEach( child -> this.uchildren.add(new ChildDto(child)));
        }
    }
}
