package com.answer.notinote.User.domain.repository;

import com.answer.notinote.User.domain.entity.RefreshToken;
import com.answer.notinote.User.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{
    @Override
    Optional<RefreshToken> findById(Long id);
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
