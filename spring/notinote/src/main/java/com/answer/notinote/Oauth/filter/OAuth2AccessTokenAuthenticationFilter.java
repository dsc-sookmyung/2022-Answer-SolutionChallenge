package com.answer.notinote.Oauth.filter;

import com.answer.notinote.Oauth.AccessTokenAuthenticationProvider;
import com.answer.notinote.Oauth.data.ProviderType;
import com.answer.notinote.Oauth.token.AccessTokenSocialTypeToken;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

@Component
public class OAuth2AccessTokenAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private static final String DEFAULT_OAUTH2_LOGIN_REQUEST_URL_PREFIX = "/login/oauth2/";  // /login/oauth2/ + ????? 로 오는 요청 처리
    private static final String HTTP_METHOD = "GET";    //HTTP 메서드의 방식
    private static final String ACCESS_TOKEN_HEADER_NAME = "Authorization";  //AccessToken 해더

    private static final AntPathRequestMatcher DEFAULT_OAUTH2_LOGIN_PATH_REQUEST_MATCHER =
            new AntPathRequestMatcher(DEFAULT_OAUTH2_LOGIN_REQUEST_URL_PREFIX +"*", HTTP_METHOD); //=>   /oauth2/login/* 의 요청에, GET으로 온 요청에 매칭

    public OAuth2AccessTokenAuthenticationFilter(AccessTokenAuthenticationProvider accessTokenAuthenticationProvider,   //Provider를 등록해주었다. 이는 조금 이따 설명하겠다.
                                                 AuthenticationSuccessHandler authenticationSuccessHandler,  //로그인 성공 시 처리할  handler이다
                                                 AuthenticationFailureHandler authenticationFailureHandler) { //로그인 실패 시 처리할 handler이다.
        super(DEFAULT_OAUTH2_LOGIN_PATH_REQUEST_MATCHER);   // 위에서 설정한  /oauth2/login/* 의 요청에, GET으로 온 요청을 처리하기 위해 설정한다.

        this.setAuthenticationManager(new ProviderManager(accessTokenAuthenticationProvider));
        this.setAuthenticationSuccessHandler(authenticationSuccessHandler);
        this.setAuthenticationFailureHandler(authenticationFailureHandler);

    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        ProviderType providerType = extractSocialType(request);
        //어떤 소셜 로그인을 진행할 것인지를 uri롤 통해 추출한다. kakao, google, naver가 있으며, 예를 들어 /oauth2/login/kakao로 요청을 보내면 kakao를 추출한다

        String accessToken = request.getHeader(ACCESS_TOKEN_HEADER_NAME); //헤더의 AccessToken에 해당하는 값을 가져온다.

        return this.getAuthenticationManager().authenticate(new AccessTokenSocialTypeToken(accessToken, providerType));
        //AuthenticationManager에게 인증 요청을 보낸다. 이때 Authentication 객체로는 AccessTokenSocialTypeToken을(직접 커스텀 함) 사용한다.
    }


    private ProviderType extractSocialType(HttpServletRequest request) {//요청을 처리하는 코드이다
        return Arrays.stream(ProviderType.values())//SocialType.values() -> GOOGLE, KAKAO, NAVER 가 있다.
                .filter(providerType ->
                        providerType.getSocialName()
                                .equals(request.getRequestURI().substring(DEFAULT_OAUTH2_LOGIN_REQUEST_URL_PREFIX.length())))
                //subString을 통해 문자열을 잘라주었다. 해당 코드를 실행하면 ~~~/kakao에서 kakao만 추출된다
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("잘못된 URL 주소입니다"));
    }
}
