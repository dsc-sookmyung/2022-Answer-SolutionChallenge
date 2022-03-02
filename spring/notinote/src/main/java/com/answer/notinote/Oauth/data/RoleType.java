package com.answer.notinote.Oauth.data;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum RoleType {
    USER("ROLE_USER", "사용자 권한"),
    ADMIN("ROLE_ADMIN", "관리자 권한");

    private final String code;
    private final String description;

    public static RoleType of (String code) {
        return Arrays.stream(RoleType.values())
                .filter(r -> r.getCode().equals(code))
                .findAny()
                .orElse(USER);
    }
}
