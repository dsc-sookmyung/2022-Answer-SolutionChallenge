package com.answer.notinote.Auth.repository;

import com.answer.notinote.Auth.jwt.RefreshToken;
import com.answer.notinote.User.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{
    Optional<RefreshToken> findByUser(User user);

    boolean existsByToken(String token);
}
