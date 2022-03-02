package com.answer.notinote.Oauth.repository;

import com.answer.notinote.Oauth.token.RefreshToken;
import com.answer.notinote.User.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{
    @Override
    Optional<RefreshToken> findById(Long id);
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUserEmailAndRefreshToken(String userId, String refreshToken);
    void deleteByUser(User user);
}
