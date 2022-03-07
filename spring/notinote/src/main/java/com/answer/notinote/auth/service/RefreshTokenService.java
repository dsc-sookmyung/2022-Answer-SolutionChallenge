package com.answer.notinote.auth.service;

import com.answer.notinote.auth.token.RefreshToken;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.auth.repository.RefreshTokenRepository;
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

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token).orElseThrow(
                () -> new IllegalArgumentException("token이 존재하지 않습니다.")
        );
    }

    @Transactional
    public Long deleteByUid(Long uid) {
        User user = userRepository.findById(uid).orElseThrow(
                () -> new IllegalArgumentException("유저 ID가 존재하지 않습니다.")
        );
        refreshTokenRepository.deleteByUserEmail(user.getEmail());
        return user.getUid();
    }
}
