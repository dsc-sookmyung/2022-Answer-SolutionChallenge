package com.answer.notinote.Config.security;

import com.answer.notinote.Auth.filter.JwtAuthenticationFilter;
import com.answer.notinote.Auth.filter.OAuth2AccessTokenAuthenticationFilter;
import com.answer.notinote.Auth.handler.OAuth2LoginFailureHandler;
import com.answer.notinote.Auth.handler.OAuth2LoginSuccessHandler;
import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정 클래스
 */
@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final OAuth2AccessTokenAuthenticationFilter oAuth2AccessTokenAuthenticationFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                    .httpBasic().disable()
                    .csrf().disable()
                    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                // 모두 접근 가능한 URL
                    .authorizeRequests()
                    .antMatchers("/","/oauth/success/*", "/oauth/fail","/login/*", "/join").permitAll()
                .and()
                // USER만 접근 가능한 URL
                    .authorizeRequests()
                    .antMatchers("/test/user")
                    .authenticated()
                .and()
                // ADMIN만 접근 가능한 URL
                    .authorizeRequests()
                    .antMatchers("/test/admin")
                    .hasRole("ADMIN")
                .and()
                    .authorizeRequests()
                    .anyRequest()
                    .authenticated()
                .and()
                .oauth2Login()
                .successHandler(oAuth2LoginSuccessHandler)
                .failureHandler(oAuth2LoginFailureHandler)
                .and()
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(oAuth2AccessTokenAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);
    }
}
