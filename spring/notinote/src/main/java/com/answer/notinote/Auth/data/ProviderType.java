package com.answer.notinote.Auth.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpMethod;

/**
 * SNS 로그인 enum 클래스
 */
@Getter
@AllArgsConstructor
public enum ProviderType {
    GOOGLE(
            "google",
            "https://www.googleapis.com/oauth2/v3/userinfo",
            HttpMethod.GET
    );

    private String socialName;
    private String userInfoUrl;
    private HttpMethod method;
}