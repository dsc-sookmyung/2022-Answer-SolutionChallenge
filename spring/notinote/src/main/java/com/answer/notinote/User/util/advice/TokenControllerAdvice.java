package com.answer.notinote.User.util.advice;

import com.answer.notinote.User.util.ErrorMessage;
import com.answer.notinote.User.util.exception.TokenRefreshException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@RestControllerAdvice
public class TokenControllerAdvice {
    @ExceptionHandler(value = TokenRefreshException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorMessage handleTokenRefreshException(TokenRefreshException e, WebRequest request) {
        return new ErrorMessage(
                HttpStatus.FORBIDDEN.value(),
                new Date(),
                e.getMessage(),
                request.getDescription(false)
        );
    }
}
