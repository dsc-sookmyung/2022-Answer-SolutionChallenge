package com.answer.notinote.auth.filter;

import com.answer.notinote.auth.token.AccessTokenAuthenticationProvider;
import com.answer.notinote.auth.data.ProviderType;
import com.answer.notinote.auth.token.AccessTokenProviderTypeToken;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;

/**
 * 로그인 요청 헤더의 Access Token을 식별하는 헤더
 */
@Component
public class OAuth2AccessTokenAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private static final String DEFAULT_OAUTH2_LOGIN_REQUEST_URL_PREFIX = "/login/oauth2/";
    private static final String HTTP_METHOD = "GET";
    private static final String ACCESS_TOKEN_HEADER_NAME = "Authorization";  //AccessToken 해더

    private static final AntPathRequestMatcher DEFAULT_OAUTH2_LOGIN_PATH_REQUEST_MATCHER =
            new AntPathRequestMatcher(DEFAULT_OAUTH2_LOGIN_REQUEST_URL_PREFIX +"*", HTTP_METHOD); //=>   /oauth2/login/* 의 GET 매핑

    public OAuth2AccessTokenAuthenticationFilter(AccessTokenAuthenticationProvider accessTokenAuthenticationProvider,
                                                 AuthenticationSuccessHandler authenticationSuccessHandler,
                                                 AuthenticationFailureHandler authenticationFailureHandler) {
        super(DEFAULT_OAUTH2_LOGIN_PATH_REQUEST_MATCHER);

        this.setAuthenticationManager(new ProviderManager(accessTokenAuthenticationProvider));
        this.setAuthenticationSuccessHandler(authenticationSuccessHandler);
        this.setAuthenticationFailureHandler(authenticationFailureHandler);

    }

    /**
     * 로그인 요청이 들어오면 가장 먼저 작동되는 메소드입니다.
     * AuthenticationManager.authenticate()를 호출해 인증을 진행합니다.
     * @param request
     * @param response
     * @return
     * @throws AuthenticationException
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // SNS 로그인 분류 추출
        ProviderType providerType = extractProviderType(request);
        String accessToken = request.getHeader(ACCESS_TOKEN_HEADER_NAME);

        //AuthenticationManager에 인증 요청 전송
        return this.getAuthenticationManager().authenticate(new AccessTokenProviderTypeToken(accessToken, providerType));
    }


    private ProviderType extractProviderType(HttpServletRequest request) {
        return Arrays.stream(ProviderType.values())
                .filter(providerType ->
                        providerType.getSocialName()
                                .equals(request.getRequestURI().substring(DEFAULT_OAUTH2_LOGIN_REQUEST_URL_PREFIX.length())))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("잘못된 URL 주소입니다"));
    }
}
