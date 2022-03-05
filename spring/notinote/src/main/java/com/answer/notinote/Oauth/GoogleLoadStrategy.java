package com.answer.notinote.Oauth;

import com.answer.notinote.Oauth.data.ProviderType;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public class GoogleLoadStrategy extends ProviderLoadStrategy{
    @Override
    protected String sendRequestToSocialSite(HttpEntity request) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(ProviderType.GOOGLE.getUserInfoUrl(),
                    ProviderType.GOOGLE.getMethod(),
                    request,
                    RESPONSE_TYPE);

            return (response.getBody().get("email")).toString();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
