package com.answer.notinote.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 계정이 존재하지 않습니다."),
    USER_DUPLICATED(HttpStatus.CONFLICT, "이미 해당 계정의 유저가 존재합니다."),
    TOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "토큰이 존재하지 않습니다."),
    TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "액세스 토큰이 만료되었습니다."),
    TOKEN_NOT_EXPIRED(HttpStatus.BAD_REQUEST, "액세스 토큰이 만료되지 않았습니다."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "해당 객체가 존재하지 않습니다."),
    ;

    private final HttpStatus httpStatus;
    private final String detail;
}
