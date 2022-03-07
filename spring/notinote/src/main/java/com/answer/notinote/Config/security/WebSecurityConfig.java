package com.answer.notinote.Config.security;

import com.answer.notinote.auth.data.RoleType;
import com.answer.notinote.auth.filter.JwtAuthenticationFilter;
import com.answer.notinote.auth.filter.OAuth2AccessTokenAuthenticationFilter;
import com.answer.notinote.auth.handler.OAuth2LoginFailureHandler;
import com.answer.notinote.auth.handler.OAuth2LoginSuccessHandler;
import com.answer.notinote.auth.token.JwtTokenProvider;
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

    private final JwtTokenProvider jwtTokenProvider;
    private final OAuth2AccessTokenAuthenticationFilter oAuth2AccessTokenAuthenticationFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                    .httpBasic().disable()
                    .csrf().disable()
                    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                    .authorizeRequests()
                    .antMatchers("/", "/login/*", "/join/*").permitAll()
                .and()
                    .authorizeRequests()
                    .antMatchers("/test/user")
                    .hasRole("USER")
                .and()
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
                .addFilterBefore(oAuth2AccessTokenAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);
    }
}
