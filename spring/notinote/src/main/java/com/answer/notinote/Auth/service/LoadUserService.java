package com.answer.notinote.Auth.service;

import com.answer.notinote.Auth.data.dto.UserSocialResponseDto;
import com.answer.notinote.Auth.strategy.GoogleLoadStrategy;
import com.answer.notinote.Auth.strategy.ProviderLoadStrategy;
import com.answer.notinote.Auth.data.ProviderType;
import com.answer.notinote.Auth.token.AccessTokenProviderTypeToken;
import com.answer.notinote.Auth.userdetails.CustomUserDetails;

import com.answer.notinote.Auth.util.AuthException;
import com.answer.notinote.Exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

        UserSocialResponseDto socialEntity = providerLoadStrategy.getSocialEntity(authentication.getAccessToken());

        if (socialEntity == null) {
            throw new CustomException(AuthException.TOKEN_INVALID);
        }

        return CustomUserDetails.builder()
                .email(socialEntity.getEmail())
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
            default : throw new CustomException(AuthException.NOT_SUPPORTED_TYPE);
        }
    }
}
