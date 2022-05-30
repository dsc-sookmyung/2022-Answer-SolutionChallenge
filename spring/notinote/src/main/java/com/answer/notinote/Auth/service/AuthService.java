package com.answer.notinote.Auth.service;

import com.answer.notinote.Auth.data.ProviderType;
import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.Auth.repository.RefreshTokenRepository;
import com.answer.notinote.Auth.token.RefreshToken;
import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Auth.userdetails.GoogleUser;
import com.answer.notinote.Child.service.ChildService;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.User.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final OAuth2Service oAuthService;
    private final ChildService childService;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public UserResponseDto oauthLogin(HttpServletResponse response, String token) {
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
        else {
            issueToken(response, user);
        }

        return new UserResponseDto(user);
    }

    @Transactional
    public UserResponseDto join(HttpServletResponse response, JoinRequestDto requestDto) {
        User user = userRepository.findById(requestDto.getUid()).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );

        requestDto.getUchildren().forEach( childDto -> childService.create(childDto, user));

        if (user.getUroleType() == RoleType.GUEST) {
            user.setUsername(requestDto.getUsername());
            user.setUlanguage(requestDto.getUlanguage());
            user.setUroleType(RoleType.USER);
            user.setUprofileImg(requestDto.getUprofileImg());
            userRepository.save(user);

            issueToken(response, user);
            return new UserResponseDto(user);
        }
        else {
            throw new CustomException(ErrorCode.USER_DUPLICATED);
        }
    }

    private void issueToken(HttpServletResponse response, User user) {
        String accessToken = jwtTokenProvider.createToken(user);
        String refreshToken = jwtTokenProvider.createRefreshToken(user);

        jwtTokenProvider.setAccessToken(response, accessToken);
        jwtTokenProvider.setRefreshToken(response, refreshToken);
    }

    @Transactional
    public String refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = jwtTokenProvider.resolveAccessToken(request);
        String refreshToken = jwtTokenProvider.resolveRefreshToken(request);

        boolean validateRefreshToken = jwtTokenProvider.validateToken(refreshToken) && jwtTokenProvider.existsRefreshToken(refreshToken);
        if (jwtTokenProvider.validateTokenExpired(accessToken) && validateRefreshToken) {
            String email = jwtTokenProvider.getUserEmail(refreshToken);
            User user = findUserByEmail(email);

            String newAccessToken = jwtTokenProvider.createToken(user);
            jwtTokenProvider.setAccessToken(response, newAccessToken);

            return "ok";
        } else {
            throw new CustomException(ErrorCode.TOKEN_NOT_EXPIRED);
        }
    }

    @Transactional
    public Long logout(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        String email = jwtTokenProvider.getUserEmail(token);

        User user = findUserByEmail(email);

        RefreshToken refreshToken = refreshTokenRepository.findByUser(user).orElseThrow(
                () -> new CustomException(ErrorCode.TOKEN_NOT_FOUND)
        );
        refreshTokenRepository.delete(refreshToken);

        return user.getUid();
    }

    private User findUserByEmail(String email) {
        return userRepository.findByUemail(email).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
    }

}
