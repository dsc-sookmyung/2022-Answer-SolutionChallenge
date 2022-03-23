package com.answer.notinote.Config.security;

import com.answer.notinote.Auth.filter.JwtAuthenticationFilter;
import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Spring Security 설정 클래스
 */
@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                    .httpBasic().disable()
                    .cors().configurationSource(corsConfigurationSource())
                .and()
                    .csrf().disable()
                    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                // 모두 접근 가능한 URL
                    .authorizeRequests()
                    .antMatchers("/","/login/oauth2","/login", "/join",
                            "/swagger-ui.html", "/swagger/**", "/swagger-resources/**", "/webjars/**", "/v2/api-docs").permitAll()
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
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
