package com.answer.notinote.User.domain.entity;

import com.answer.notinote.Auth.data.ProviderType;
import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.User.dto.UserRequestDto;
import lombok.*;

import javax.persistence.*;
import java.util.List;

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
    private String username;

    @Column
    private Long uprofileImg;

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

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<Child> uchildren;

    public User(UserRequestDto requestDto) {
        this.username = requestDto.getUsername();
        this.uemail = requestDto.getUemail();
    }
}
