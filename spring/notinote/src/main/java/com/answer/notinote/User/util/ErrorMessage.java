package com.answer.notinote.User.util;

import lombok.AllArgsConstructor;
import java.util.Date;

@AllArgsConstructor
public class ErrorMessage {
    private int status;
    private Date date;
    private String message;
    private String request;
}
