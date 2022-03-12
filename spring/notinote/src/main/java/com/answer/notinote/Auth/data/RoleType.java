package com.answer.notinote.Auth.data;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 유저 권한 enum 클래스
 */
@Getter
@AllArgsConstructor
public enum RoleType {
    USER("ROLE_USER"),
    GUEST("ROLE_GUEST"),
    ADMIN("ROLE_ADMIN");

    private String grantedAuthority;
}
