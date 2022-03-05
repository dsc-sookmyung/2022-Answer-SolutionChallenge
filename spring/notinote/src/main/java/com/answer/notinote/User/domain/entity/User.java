package com.answer.notinote.User.domain.entity;

import com.answer.notinote.Oauth.data.ProviderType;
import com.answer.notinote.Oauth.data.RoleType;
import com.answer.notinote.User.dto.UserRequestDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User extends Timestamped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long uid;

    @Column(nullable = false, length = 20)
    private String firstname;

    @Column(nullable = false, length = 20)
    private String lastname;

    @Column(nullable = false, length = 20, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private ProviderType providerType;

    @Column(nullable = false, length = 20)
    private RoleType roleType;

    public User(UserRequestDto requestDto) {
        this.firstname = requestDto.getFirstname();
        this.lastname = requestDto.getLastname();
        this.email = requestDto.getEmail();
    }

    public User(com.answer.notinote.Oauth.data.dto.UserRequestDto requestDto) {
        this.email = requestDto.getEmail();
        this.providerType = requestDto.getProviderType();
    }

    public String getFullname() {
        return this.firstname + this.lastname;
    }

    public void update(UserRequestDto requestDto) {
        this.firstname = requestDto.getFirstname();
        this.lastname = requestDto.getLastname();
        this.email = requestDto.getEmail();
        this.password = requestDto.getPassword();
    }
}
