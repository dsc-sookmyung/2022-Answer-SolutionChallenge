package com.answer.notinote.auth.token;

import com.answer.notinote.auth.data.ProviderType;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Getter
public class AccessTokenProviderTypeToken extends AbstractAuthenticationToken {

    private Object principal;           // OAuth2UserDetails
    private String accessToken;
    private ProviderType providerType;

    @Builder
    public AccessTokenProviderTypeToken(Object principal, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        super.setAuthenticated(true);
    }

    public AccessTokenProviderTypeToken(String accessToken, ProviderType providerType) {
        super(null);
        this.accessToken = accessToken;
        this.providerType = providerType;
        setAuthenticated(false);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return this.principal;
    }
}
