package com.answer.notinote.auth.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpMethod;

/**
 * 제공하는 SNS 로그인 enum 클래스
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