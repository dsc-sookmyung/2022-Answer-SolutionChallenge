package com.answer.notinote.Auth.userdetails;

import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.Auth.data.ProviderType;
import io.jsonwebtoken.lang.Assert;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

/**
 * 스프링 시큐리티 내부에서 사용되는 User Entity
 */
@Getter @Setter
@Builder
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {
    private String email;
    private String username;
    private ProviderType providerType;
    private Set<GrantedAuthority> authorities;

    public CustomUserDetails(String email, ProviderType providerType) {
        this.email = email;
        this.providerType = providerType;
    }

    public static UserDetails create(User user) {
        return new CustomUserDetails(user.getUemail(), user.getUproviderType());
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setRoles(String... roles) {
        List<GrantedAuthority> authorities = new ArrayList<>(roles.length);
        for (String role : roles) {
            Assert.isTrue(!role.startsWith("ROLE_"), role + " cannot start with ROLE_ (it is automatically add)");
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        }
        this.authorities = Set.copyOf(authorities);
    }
}
