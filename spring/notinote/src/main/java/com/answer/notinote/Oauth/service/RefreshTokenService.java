package com.answer.notinote.Oauth.service;

import com.answer.notinote.Oauth.token.RefreshToken;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.Oauth.repository.RefreshTokenRepository;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.util.exception.TokenRefreshException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${refresh.time}")
    private Long refreshDuration;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token).orElseThrow(
                () -> new IllegalArgumentException("token이 존재하지 않습니다.")
        );
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request.");
        }

        return token;
    }

    @Transactional
    public Long deleteByUid(Long uid) {
        User user = userRepository.findById(uid).orElseThrow(
                () -> new IllegalArgumentException("유저 ID가 존재하지 않습니다.")
        );
        refreshTokenRepository.deleteByUser(user);
        return user.getUid();
    }
}
