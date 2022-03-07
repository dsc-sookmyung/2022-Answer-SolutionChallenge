package com.answer.notinote.auth.token;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
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

    @Column(nullable = false, length = 30, unique = true)
    private String userEmail;

    @Column(nullable = false, unique = true)
    private String token;

    public RefreshToken(String userEmail, String token) {
        this.userEmail = userEmail;
        this.token = token;
    }
}
