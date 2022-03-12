package com.answer.notinote.Auth.strategy;

import com.answer.notinote.Auth.data.ProviderType;
import com.answer.notinote.Auth.data.dto.UserSocialResponseDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public class GoogleLoadStrategy extends ProviderLoadStrategy{
    @Override
    protected UserSocialResponseDto sendRequestToSocialSite(HttpEntity request) {
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(ProviderType.GOOGLE.getUserInfoUrl(),
                    ProviderType.GOOGLE.getMethod(),
                    request,
                    RESPONSE_TYPE);

            return UserSocialResponseDto.builder()
                    .email(response.getBody().get("email").toString())
                    .firstname(response.getBody().get("given_name").toString())
                    .lastname(response.getBody().get("family_name").toString())
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
