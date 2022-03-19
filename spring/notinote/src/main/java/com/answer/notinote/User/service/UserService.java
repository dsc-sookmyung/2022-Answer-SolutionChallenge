package com.answer.notinote.User.service;

import com.answer.notinote.Auth.repository.RefreshTokenRepository;
import com.answer.notinote.Auth.service.RefreshTokenService;
import com.answer.notinote.Auth.token.RefreshToken;
import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Child.dto.ChildDto;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public UserResponseDto join(JoinRequestDto requestDto, HttpServletResponse response) {
        User user = findUserById(requestDto.getUid());

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

            return login(user.getUid(), response);
        }
        else {
            throw new CustomException(ErrorCode.USER_DUPLICATED);
        }
    }

    public UserResponseDto login(Long id, HttpServletResponse response) {
        User user = findUserById(id);
        List<ChildDto> children = new ArrayList<>();
        user.getUchildren().forEach(c ->
                children.add(new ChildDto(c))
        );

        String jwtToken = jwtTokenProvider.createToken(user.getUemail());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUemail());
        jwtTokenProvider.setHeaderToken(response, jwtToken);
        jwtTokenProvider.setHeaderRefreshToken(response, refreshToken);
        refreshTokenRepository.save(new RefreshToken(user, refreshToken));

        return UserResponseDto.builder()
                .uid(user.getUid())
                .uemail(user.getUemail())
                .username(user.getUsername())
                .ulanguage(user.getUlanguage())
                .uchildren(children)
                .uroleType(user.getUroleType())
                .build();
    }

    @Transactional
    public Long logout(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);
        String email = jwtTokenProvider.getUserEmail(token);

        User user = findUserByEmail(email);
        refreshTokenService.delete(user);

        return user.getUid();
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
