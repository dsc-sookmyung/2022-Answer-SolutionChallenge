package com.answer.notinote.Auth.service;

import com.answer.notinote.Auth.token.RefreshToken;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.Auth.repository.RefreshTokenRepository;
import com.answer.notinote.User.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

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
        refreshTokenRepository.deleteByUserEmail(user.getUemail());
        return user.getUid();
    }
}
