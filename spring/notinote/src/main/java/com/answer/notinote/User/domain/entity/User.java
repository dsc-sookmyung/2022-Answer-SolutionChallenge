package com.answer.notinote.User.domain.entity;

import com.answer.notinote.Oauth.data.ProviderType;
import com.answer.notinote.Oauth.data.RoleType;
import com.answer.notinote.User.dto.UserRequestDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class User extends Timestamped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long uid;

    @Column(nullable = false, length = 20)
    private String username;

    @Column(nullable = false, length = 20, unique = true)
    private String uemail;

    @JsonIgnore
    @Column(nullable = false)
    private String upassword;

    @Column(nullable = false, length = 20)
    private ProviderType providerType;

    @Column(nullable = false, length = 20)
    private RoleType roleType;

    public User(UserRequestDto requestDto) {
        this.username = requestDto.getUsername();
        this.uemail = requestDto.getEmail();
    }

    public void update(UserRequestDto requestDto) {
        this.username = requestDto.getUsername();
        this.uemail = requestDto.getEmail();
        this.upassword = requestDto.getPassword();
    }
}
