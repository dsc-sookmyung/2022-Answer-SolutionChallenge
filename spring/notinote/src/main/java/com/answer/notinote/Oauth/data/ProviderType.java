package com.answer.notinote.Oauth.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpMethod;

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