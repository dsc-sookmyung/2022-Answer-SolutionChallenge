package com.answer.notinote.Auth.filter;

import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilterBean {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String jwtToken = jwtTokenProvider.resolveToken((HttpServletRequest) request);
        String refreshToken = jwtTokenProvider.resolveRefreshToken((HttpServletRequest) request);

        if (jwtToken != null) {
            if (jwtTokenProvider.validateToken(jwtToken)) {
                // jwt token이 유효한 경우
                setAuthentication(jwtToken);
            }
            else {
                if (refreshToken != null) {
                    if (jwtTokenProvider.validateToken(refreshToken) && jwtTokenProvider.existsRefreshToken(refreshToken)) {
                        // jwt token이 만료되고, refresh token이 유효한 경우
                        String email = jwtTokenProvider.getUserEmail(refreshToken);
                        String newToken = jwtTokenProvider.createToken(email);
                        jwtTokenProvider.setHeaderToken((HttpServletResponse) response, newToken);

                        setAuthentication(newToken);
                    }
                }
            }
        }
        chain.doFilter(request, response);
    }

    private void setAuthentication(String jwtToken) {
        Authentication authentication = jwtTokenProvider.getAuthentication(jwtToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
