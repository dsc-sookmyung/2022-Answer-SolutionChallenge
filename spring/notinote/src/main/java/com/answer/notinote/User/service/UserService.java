package com.answer.notinote.User.service;

import com.answer.notinote.Auth.data.ProviderType;
import com.answer.notinote.Auth.repository.RefreshTokenRepository;
import com.answer.notinote.Auth.service.OAuth2Service;
import com.answer.notinote.Auth.token.RefreshToken;
import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Auth.userdetails.GoogleUser;
import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Child.dto.ChildDto;
import com.answer.notinote.Child.dto.ChildrenResponseDto;
import com.answer.notinote.Child.service.ChildService;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
