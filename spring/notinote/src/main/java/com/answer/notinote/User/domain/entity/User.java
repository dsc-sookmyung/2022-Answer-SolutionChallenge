package com.answer.notinote.User.domain.entity;

import com.answer.notinote.Auth.data.ProviderType;
import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.Auth.data.dto.UserAuthRequestDto;
import com.answer.notinote.User.dto.UserRequestDto;
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

    @Column(length = 20)
    private String uusername;

    @Column(nullable = false, length = 50, unique = true)
    private String uemail;

    @Column(length = 20)
    private String ulanguage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProviderType uproviderType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoleType uroleType;

    public User(UserRequestDto requestDto) {
        this.uemail = requestDto.getEmail();
    }

    public User(UserAuthRequestDto requestDto) {
        this.uemail = requestDto.getEmail();
        this.uproviderType = requestDto.getProviderType();
        this.uroleType = requestDto.getRoleType();
    }

    public void update(UserRequestDto requestDto) {
        this.uemail = requestDto.getEmail();
    }
}
