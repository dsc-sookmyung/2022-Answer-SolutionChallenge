package com.answer.notinote.Oauth;

import com.answer.notinote.Oauth.data.RoleType;
import com.answer.notinote.Oauth.data.dto.UserRequestDto;
import com.answer.notinote.Oauth.service.LoadUserService;
import com.answer.notinote.Oauth.token.AccessTokenSocialTypeToken;
import com.answer.notinote.Oauth.userdetails.CustomUserDetails;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AccessTokenAuthenticationProvider implements AuthenticationProvider {

    private final LoadUserService loadUserService;
    private final UserRepository userRepository;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        CustomUserDetails oAuth2User = loadUserService.getOAuth2UserDetails((AccessTokenSocialTypeToken) authentication);

        User user = saveOrGet(oAuth2User);
        oAuth2User.setRoles(user.getRoleType().name());

        return new AccessTokenSocialTypeToken(oAuth2User, oAuth2User.getAuthorities());
    }

    private User saveOrGet(CustomUserDetails oAuth2User) {
        return userRepository.findByUemail(oAuth2User.getEmail())
                .orElseGet(() -> userRepository.save(new User(new UserRequestDto(oAuth2User.getEmail(), oAuth2User.getProviderType(), RoleType.GUEST))));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return AccessTokenSocialTypeToken.class.isAssignableFrom(authentication);
    }
}
