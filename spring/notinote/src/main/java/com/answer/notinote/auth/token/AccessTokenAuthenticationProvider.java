package com.answer.notinote.auth.token;

import com.answer.notinote.auth.data.RoleType;
import com.answer.notinote.auth.data.dto.UserRequestDto;
import com.answer.notinote.auth.service.LoadUserService;
import com.answer.notinote.auth.userdetails.CustomUserDetails;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

/**
 * AccessToken의 인증을 진행하는 클래스
 */
@RequiredArgsConstructor
@Component
public class AccessTokenAuthenticationProvider implements AuthenticationProvider {

    private final LoadUserService loadUserService;
    private final UserRepository userRepository;

    /**
     * 전달받은 access token으로 회원 정보 조회
     * @param authentication
     * @return
     * @throws AuthenticationException
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        CustomUserDetails oAuth2User = loadUserService.getOAuth2UserDetails((AccessTokenProviderTypeToken) authentication);

        // DB에서 회원 조회 (없으면 생성)
        User user = saveOrGet(oAuth2User);
        oAuth2User.setRoles(user.getRoleType().name());

        return new AccessTokenProviderTypeToken(oAuth2User, oAuth2User.getAuthorities());
    }

    private User saveOrGet(CustomUserDetails oAuth2User) {
        return userRepository.findByEmail(oAuth2User.getEmail())
                .orElseGet(() -> userRepository.save(new User(new UserRequestDto(oAuth2User.getEmail(), oAuth2User.getProviderType(), RoleType.GUEST))));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return AccessTokenProviderTypeToken.class.isAssignableFrom(authentication);
    }
}
