package com.answer.notinote.auth.strategy;

import com.answer.notinote.auth.data.ProviderType;
import org.hibernate.validator.internal.util.logging.Log;
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

            // 임시
            System.out.println("Body: \n" + response.getBody());

            return (response.getBody().get("email")).toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
