package com.answer.notinote.User.domain.repository;

import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.Auth.data.ProviderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUemail(String uemail);
}
