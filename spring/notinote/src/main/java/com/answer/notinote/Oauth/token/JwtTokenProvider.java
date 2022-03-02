package com.answer.notinote.Oauth.token;

import com.answer.notinote.Oauth.exception.TokenValidFailedException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class JwtTokenProvider {

    private final Key key;
    private static final String AUTHORITIES_KEY = "role";

    public JwtTokenProvider(String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // jwt 토큰 생성
    public JwtToken createToken(String id, Date expiry) {
        return new JwtToken(id, expiry, key);
    }

    public JwtToken createToken(String id, String role, Date expiry) {
        return new JwtToken(id, role, expiry, key);
    }

    public JwtToken convertJwtToken(String token) {
        return new JwtToken(token, key);
    }

    // 토큰에서 인증 정보 조회
    public Authentication getAuthentication(JwtToken token) {
        if (token.validate()) {
            Claims claims = token.getTokenClaims();
            Collection<? extends GrantedAuthority> authorities =
                    Arrays.stream(new String[] {claims.get(AUTHORITIES_KEY).toString()})
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

            log.debug("claims subject := [{}]", claims.getSubject());
            User user = new User(claims.getSubject(), "", authorities);

            return new UsernamePasswordAuthenticationToken(user, token, authorities);
        } else throw new TokenValidFailedException();
    }
}