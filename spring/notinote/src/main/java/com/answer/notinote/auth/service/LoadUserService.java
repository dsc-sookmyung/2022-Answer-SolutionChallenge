package com.answer.notinote.auth.service;

import com.answer.notinote.auth.strategy.GoogleLoadStrategy;
import com.answer.notinote.auth.strategy.ProviderLoadStrategy;
import com.answer.notinote.auth.data.ProviderType;
import com.answer.notinote.auth.token.AccessTokenProviderTypeToken;
import com.answer.notinote.auth.userdetails.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.TimeoutException;

@Service
@RequiredArgsConstructor
public class LoadUserService {

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 해당 ProviderType의 url에 요청을 보내 유저 정보 조회
     * @param authentication
     * @return customUserDetails
     */
    public CustomUserDetails getOAuth2UserDetails(AccessTokenProviderTypeToken authentication) {
        ProviderType providerType = authentication.getProviderType();
        ProviderLoadStrategy providerLoadStrategy = getProviderLoadStrategy(providerType);

        String socialEmail = providerLoadStrategy.getSocialPk(authentication.getAccessToken());

        if (socialEmail == null) {
            throw new IllegalArgumentException("액세스 토큰이 만료되었습니다.");
        }

        return CustomUserDetails.builder()
                .email(socialEmail)
                .providerType(providerType)
                .build();
    }

    /**
     * @param providerType
     * @return ProviderLoadStrategy
     */
    private ProviderLoadStrategy getProviderLoadStrategy(ProviderType providerType) {
        switch (providerType) {
            case GOOGLE : return new GoogleLoadStrategy();
            default : throw new IllegalArgumentException("지원하지 않는 로그인 형식입니다");
        }
    }
}
