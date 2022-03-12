package com.answer.notinote.Exception;

import lombok.Getter;

public class CustomException extends RuntimeException {

    @Getter
    private final BaseException exceptionType;

    public CustomException(BaseException exceptionType) {
        super(exceptionType.getErrorMessage());
        this.exceptionType = exceptionType;
    }
}
