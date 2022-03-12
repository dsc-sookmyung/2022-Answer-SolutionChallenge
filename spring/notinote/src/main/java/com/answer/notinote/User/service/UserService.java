package com.answer.notinote.User.service;

import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.dto.UserRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User join(JoinRequestDto requestDto) {
        User user = userRepository.findById(requestDto.getId()).orElseThrow(
                () -> new IllegalArgumentException("id가 존재하지 않습니다.")
        );

        if (user.getUroleType() == RoleType.GUEST) {
            user.setUlanguage(requestDto.getLanguage());
            user.setUroleType(RoleType.USER);
            userRepository.save(user);
            return user;
        }
        else {
            throw new IllegalArgumentException("구글 회원가입 전적이 존재하지 않습니다.");
        }
    }

    @Transactional
    public User update(Long id, UserRequestDto requestDto) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("id가 존재하지 않습니다.")
        );
        user.update(requestDto);

        return user;
    }

    @Transactional
    public Long delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("id가 존재하지 않습니다.")
        );
        userRepository.delete(user);

        return id;
    }

    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("ID가 존재하지 않습니다.")
        );
    }

    public User findUserByEmail(String email) {
        return userRepository.findByUemail(email).orElseThrow(
                () -> new IllegalArgumentException("이메일이 존재하지 않습니다.")
        );
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}
