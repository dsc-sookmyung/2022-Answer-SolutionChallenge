package com.answer.notinote.User.service;

import com.answer.notinote.Oauth.data.RoleType;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.dto.LoginRequestDto;
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

        if (validateDuplicateEmail(requestDto.getEmail())) {
            throw new IllegalArgumentException("중복되는 이메일이 존재합니다.");
        }

        User user = User.builder()
                .username(requestDto.getUsername())
                .upassword(passwordEncoder.encode(requestDto.getPassword()))
                .uemail(requestDto.getEmail())
                .roleType(RoleType.USER)
                .build();

        return userRepository.save(user);
    }

    public User login(LoginRequestDto loginDto) {
        User user = findUserByEmail(loginDto.getEmail());

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getUpassword())) {
            throw new IllegalArgumentException("패스워드가 틀렸습니다.");
        }
        return user;
    }

    public User update(Long id, UserRequestDto requestDto) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("id가 존재하지 않습니다.")
        );

        requestDto.setPassword(passwordEncoder.encode(requestDto.getPassword()));
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
        return userRepository.findByUemail(email).orElseThrow(
                () -> new IllegalArgumentException("이메일이 존재하지 않습니다.")
        );
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    private boolean validateDuplicateEmail(String email) { return userRepository.existsByUemail(email);}
}
