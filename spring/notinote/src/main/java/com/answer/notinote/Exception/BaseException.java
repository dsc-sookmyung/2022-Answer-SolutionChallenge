package com.answer.notinote.Exception;

public interface BaseException {
    int getErrorCode();
    int getHttpStatus();
    String getErrorMessage();
}
