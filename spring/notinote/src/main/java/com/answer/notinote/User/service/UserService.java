package com.answer.notinote.User.service;

import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Child.dto.ChildDto;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.dto.LoginResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponseDto join(JoinRequestDto requestDto) {
        User user = userRepository.findById(requestDto.getUid()).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );

        List<Child> children = new ArrayList<>();
        requestDto.getUchildren().forEach( childDto ->
            children.add(new Child(user, childDto))
        );

        if (user.getUroleType() == RoleType.GUEST) {
            user.setUsername(requestDto.getUsername());
            user.setUlanguage(requestDto.getUlanguage());
            user.setUroleType(RoleType.USER);
            user.setUchildren(children);
            user.setUprofileImg(requestDto.getUprofileImg());
            userRepository.save(user);

            return login(user.getUid());
        }
        else {
            throw new CustomException(ErrorCode.USER_DUPLICATED);
        }
    }

    public LoginResponseDto login(Long id) {
        User user = findUserById(id);
        List<ChildDto> children = new ArrayList<>();
        user.getUchildren().forEach(c ->
                children.add(new ChildDto(c))
        );

        return LoginResponseDto.builder()
                .uid(user.getUid())
                .uemail(user.getUemail())
                .username(user.getUsername())
                .ulanguage(user.getUlanguage())
                .uchildren(children)
                .roles(user.getUroleType())
                .jwt_token(jwtTokenProvider.createToken(user.getUemail(), user.getUroleType()))
                .refresh_token(null)
                .build();
    }

    @Transactional
    public Long delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
        userRepository.delete(user);

        return id;
    }

    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
    }

    public User findUserByEmail(String email) {
        return userRepository.findByUemail(email).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}
