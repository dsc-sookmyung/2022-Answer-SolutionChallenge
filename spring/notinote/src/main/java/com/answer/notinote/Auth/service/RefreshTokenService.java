package com.answer.notinote.Auth.service;

import com.answer.notinote.Auth.repository.RefreshTokenRepository;
import com.answer.notinote.Auth.token.RefreshToken;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.answer.notinote.User.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public void delete(User user) {
        RefreshToken token = refreshTokenRepository.findByUser(user).orElseThrow(
                () -> new CustomException(ErrorCode.TOKEN_NOT_FOUND)
        );

        refreshTokenRepository.delete(token);
    }
}
