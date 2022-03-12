package com.answer.notinote.Auth.util;

import com.answer.notinote.Exception.BaseException;
import lombok.Getter;

@Getter
public enum AuthException implements BaseException {

    TOKEN_INVALID(1001, 401, "액세스 토큰이 만료되었습니다."),
    NOT_SUPPORTED_TYPE(1002, 401, "지원하지 않는 로그인 형식입니다");

    private final int errorCode;
    private final int httpStatus;
    private final String errorMessage;

    AuthException(int errorCode, int httpStatus, String errorMessage) {
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.errorMessage = errorMessage;
    }

}
