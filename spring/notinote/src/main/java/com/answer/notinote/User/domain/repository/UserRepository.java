package com.answer.notinote.User.domain.repository;

import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.auth.data.ProviderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByProviderTypeAndEmail(ProviderType providerType, String email);
    boolean existsByEmail(String email);
}
