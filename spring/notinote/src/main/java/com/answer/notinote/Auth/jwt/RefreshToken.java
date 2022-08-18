package com.answer.notinote.Auth.jwt;

import com.answer.notinote.User.domain.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "uid")
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    public RefreshToken(User user, String token) {
        this.user = user;
        this.token = token;
    }
}
