package com.answer.notinote.User.domain.entity;

import com.answer.notinote.User.dto.UserRequestDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User extends Timestamped implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long uid;

    @Column(nullable = false, length = 20)
    private String username;

    @Column(nullable = false, length = 20, unique = true)
    private String uemail;

    @Column(nullable = false)
    private String upassword;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles = new ArrayList<>();

    public User(UserRequestDto requestDto) {
        this.username = requestDto.getUsername();
        this.uemail = requestDto.getEmail();
    }

    public void update(UserRequestDto requestDto) {
        this.username = requestDto.getUsername();
        this.uemail = requestDto.getEmail();
        this.upassword = requestDto.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return this.upassword;
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
}
