package com.answer.notinote.User.service;

import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.dto.UserLoginDto;
import com.answer.notinote.User.dto.UserRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User join(UserRequestDto requestDto) {

        if (validateDuplicateEmail(requestDto.getUemail())) {
            throw new IllegalArgumentException("중복되는 이메일이 존재합니다.");
        }

        User user = User.builder()
                .username(requestDto.getUsername())
                .upassword(requestDto.getPassword())
                .uemail(requestDto.getUemail())
                .roles(Collections.singletonList("ROLE_USER"))
                .build();

        return userRepository.save(user);
    }

    public User login(UserLoginDto loginDto) {
        User user = findUserByEmail(loginDto.getEmail());

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("패스워드가 틀렸습니다.");
        }
        return user;
    }

    private User findUserByEmail(String email) {
        return userRepository.findByUemail(email).orElseThrow(
                () -> new IllegalArgumentException("이메일이 존재하지 않습니다.")
        );
    }

    private boolean validateDuplicateEmail(String email) { return userRepository.existsByUemail(email);}

    private List<User> findAllUsers() {
        return userRepository.findAll();
    }
}
