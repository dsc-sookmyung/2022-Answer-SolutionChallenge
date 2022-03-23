package com.answer.notinote.User.controller;

import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.Auth.repository.RefreshTokenRepository;
import com.answer.notinote.Auth.token.RefreshToken;
import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.dto.UserResponseDto;
import com.answer.notinote.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @GetMapping("/login/oauth2")
    public ResponseEntity<?> oauthLogin(HttpServletResponse response, @RequestHeader("Authorization") String token) {
        User user = userService.oauthLogin(token);

        issueJwtToken(response, user);

        return ResponseEntity.ok(new UserResponseDto(user));
    }

    /**
     * 회원가입 폼 정보를 받아 유저의 권한을 USER로 바꾸고 로그인을 진행합니다.
     * @param requestDto
     * @return
     */
    @PostMapping("/join")
    public ResponseEntity<?> join(HttpServletResponse response, @RequestBody JoinRequestDto requestDto) {
        User user = userService.join(requestDto);
        issueJwtToken(response, user);

        return ResponseEntity.ok(new UserResponseDto(user));
    }

    /**
     * 로그인한 유저의 ID를 받아 유저 정보와 JWT Token을 반환합니다.
     * @param id
     * @return
     */
    @GetMapping("/login/{id}")
    public ResponseEntity<?> login(HttpServletResponse response, @PathVariable("id") long id) {
        User user = userService.findUserById(id);
        issueJwtToken(response, user);
        return ResponseEntity.ok(new UserResponseDto(user));
    }

    @DeleteMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        return ResponseEntity.ok(userService.logout(request));
    }
    /**
     * 회원을 탙퇴 처리 합니다.
     * @param id
     * @return
     */
    @DeleteMapping("/user")
    public Long delete(@RequestParam Long id) {
        return userService.delete(id);
    }

    private void issueJwtToken(HttpServletResponse response, User user) {
        if(user.getUroleType() == RoleType.USER) {
            String jwtToken = jwtTokenProvider.createToken(user.getUemail());
            String refreshToken = jwtTokenProvider.createRefreshToken(user.getUemail());
            jwtTokenProvider.setHeaderToken(response, jwtToken);
            jwtTokenProvider.setHeaderRefreshToken(response, refreshToken);
            refreshTokenRepository.save(new RefreshToken(user, refreshToken));
        }
    }
}
