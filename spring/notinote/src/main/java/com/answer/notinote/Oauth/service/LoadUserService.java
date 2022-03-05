package com.answer.notinote.Oauth.service;

import com.answer.notinote.Oauth.GoogleLoadStrategy;
import com.answer.notinote.Oauth.ProviderLoadStrategy;
import com.answer.notinote.Oauth.data.ProviderType;
import com.answer.notinote.Oauth.token.AccessTokenSocialTypeToken;
import com.answer.notinote.Oauth.userdetails.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class LoadUserService {

    private final RestTemplate restTemplate = new RestTemplate();

    public CustomUserDetails getOAuth2UserDetails(AccessTokenSocialTypeToken authentication) {
        ProviderType providerType = authentication.getProviderType();
        ProviderLoadStrategy providerLoadStrategy = getProviderLoadStrategy(providerType);

        String socialPk = providerLoadStrategy.getSocialPk(authentication.getAccessToken());

        return CustomUserDetails.builder()
                .email(socialPk)
                .providerType(providerType)
                .build();
    }

    private ProviderLoadStrategy getProviderLoadStrategy(ProviderType providerType) {
        switch (providerType) {
            case GOOGLE : return new GoogleLoadStrategy();
            default : throw new IllegalArgumentException("지원하지 않는 로그인 형식입니다");
        }
    }
}
