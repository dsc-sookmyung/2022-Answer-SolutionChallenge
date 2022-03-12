package com.answer.notinote.User.service;

import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.dto.UserRequestDto;
import com.answer.notinote.User.util.UserException;
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
                () -> new CustomException(UserException.NOT_FOUND)
        );

        if (user.getUroleType() == RoleType.GUEST) {

            user.setUlanguage(requestDto.getUlanguage());
            user.setUroleType(RoleType.USER);
            userRepository.save(user);
            return user;
        }
        else {
            throw new CustomException(UserException.DUPLICATED_USER);
        }
    }

    @Transactional
    public User update(Long id, UserRequestDto requestDto) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new CustomException(UserException.NOT_FOUND)
        );
        user.update(requestDto);

        return user;
    }

    @Transactional
    public Long delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new CustomException(UserException.NOT_FOUND)
        );
        userRepository.delete(user);

        return id;
    }

    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new CustomException(UserException.NOT_FOUND)
        );
    }

    public User findUserByEmail(String email) {
        return userRepository.findByUemail(email).orElseThrow(
                () -> new CustomException(UserException.NOT_FOUND)
        );
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}
