package com.answer.notinote.User.service;

import com.answer.notinote.auth.data.RoleType;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.dto.LoginRequestDto;
import com.answer.notinote.User.dto.UserRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User join(UserRequestDto requestDto) {

        if (validateDuplicateEmail(requestDto.getEmail())) {
            throw new IllegalArgumentException("중복되는 이메일이 존재합니다.");
        }

        User user = User.builder()
                .firstname(requestDto.getFirstname())
                .lastname(requestDto.getLastname())
                .email(requestDto.getEmail())
                .roleType(RoleType.USER)
                .build();

        return userRepository.save(user);
    }

    public User login(LoginRequestDto loginDto) {
        User user = findUserByEmail(loginDto.getEmail());

        return user;
    }

    public User update(Long id, UserRequestDto requestDto) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("id가 존재하지 않습니다.")
        );
        user.update(requestDto);

        return user;
    }

    public Long delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("id가 존재하지 않습니다.")
        );
        userRepository.delete(user);

        return id;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(
                () -> new IllegalArgumentException("이메일이 존재하지 않습니다.")
        );
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    private boolean validateDuplicateEmail(String email) { return userRepository.existsByEmail(email);}
}
