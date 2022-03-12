package com.answer.notinote.User.util;

import com.answer.notinote.Exception.BaseException;
import lombok.Getter;

@Getter
public enum UserException implements BaseException {

    NOT_FOUND(1001, 401, "해당 계정이 존재하지 않습니다."),
    DUPLICATED_USER(1002, 401, "이미 해당 계정의 유저가 존재합니다.");

    private final int errorCode;
    private final int httpStatus;
    private final String errorMessage;

    UserException(int errorCode, int httpStatus, String errorMessage) {
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.errorMessage = errorMessage;
    }

}
