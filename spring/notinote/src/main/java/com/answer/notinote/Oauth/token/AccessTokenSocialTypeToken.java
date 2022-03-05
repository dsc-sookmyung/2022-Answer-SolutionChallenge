package com.answer.notinote.Oauth.token;

import com.answer.notinote.Oauth.data.ProviderType;
import lombok.Getter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Getter
public class AccessTokenSocialTypeToken extends AbstractAuthenticationToken {

    private Object principal;
    private String accessToken;
    private ProviderType providerType;

    public AccessTokenSocialTypeToken(Object principal, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        super.setAuthenticated(true);
    }

    public AccessTokenSocialTypeToken(String accessToken, ProviderType providerType) {
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
