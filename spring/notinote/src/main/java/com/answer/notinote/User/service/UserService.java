package com.answer.notinote.User.service;

import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Child.dto.ChildDto;
import com.answer.notinote.Child.dto.ChildrenResponseDto;
import com.answer.notinote.Util.exception.CustomException;
import com.answer.notinote.Util.exception.ErrorCode;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public Long delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
        userRepository.delete(user);

        return id;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByUemail(email).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
    }

    public ChildrenResponseDto findChildrenByUserId(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );;

        ChildrenResponseDto response = new ChildrenResponseDto();
        for (Child child : user.getUchildren()) {
            response.addChild(new ChildDto(child));
        }
        return response;
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}
