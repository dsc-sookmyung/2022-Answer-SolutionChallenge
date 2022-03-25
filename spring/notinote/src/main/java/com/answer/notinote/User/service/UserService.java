package com.answer.notinote.User.service;

import com.answer.notinote.Auth.data.ProviderType;
import com.answer.notinote.Auth.service.RefreshTokenService;
import com.answer.notinote.Auth.service.OAuthService;
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
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final OAuthService oAuthService;
    private final RefreshTokenService refreshTokenService;
    private final ChildService childService;

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public User oauthLogin(String token) {
        ResponseEntity<String> userInfoResponse = oAuthService.createGetRequest(token);
        GoogleUser googleUser = oAuthService.getUserInfo(userInfoResponse);

        User user = userRepository.findByUemail(googleUser.getEmail()).orElse(null);
        if (user == null) {
            user = User.builder()
                    .uemail(googleUser.getEmail())
                    .username(googleUser.getName())
                    .uroleType(RoleType.GUEST)
                    .uproviderType(ProviderType.GOOGLE)
                    .build();
            userRepository.save(user);
        }

        return user;
    }

    @Transactional
    public User join(JoinRequestDto requestDto) {
        User user = findUserById(requestDto.getUid());

        requestDto.getUchildren().forEach( childDto -> {
                childService.create(childDto, user);
        });

        if (user.getUroleType() == RoleType.GUEST) {
            user.setUsername(requestDto.getUsername());
            user.setUlanguage(requestDto.getUlanguage());
            user.setUroleType(RoleType.USER);
            user.setUprofileImg(requestDto.getUprofileImg());
            userRepository.save(user);

            return user;
        }
        else {
            throw new CustomException(ErrorCode.USER_DUPLICATED);
        }
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

    public ChildrenResponseDto findChildrenByUserId(Long id) {
        User user = findUserById(id);

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
