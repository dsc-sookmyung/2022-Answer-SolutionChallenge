package com.answer.notinote.Oauth.util;

import javax.servlet.http.HttpServletRequest;

public class HeaderUtil {

    private final static String HEADER_AUTHORIZATION = "ACCESS-TOKEN";
    //private final static String TOKEN_PREFIX = "Bearer ";

    public static String getAccessToken(HttpServletRequest request) {
        String header = request.getHeader(HEADER_AUTHORIZATION);

        if (header == null) return null;
        return header;
    }
}
