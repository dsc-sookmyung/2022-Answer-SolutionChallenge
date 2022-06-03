package com.answer.notinote.Auth.controller;

import com.answer.notinote.Auth.service.AuthService;
import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * oauth2 로그인을 진행합니다.
     * @param token
     * @return
     */
    @GetMapping("/login/oauth2")
    public ResponseEntity<?> oauthLogin(HttpServletResponse response, @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authService.oauthLogin(response, token));
    }

    /**
     * 회원가입 폼 정보를 받아 유저의 권한을 USER로 바꾸고 로그인을 진행합니다.
     * @param requestDto
     * @return
     */
    @PostMapping("/join")
    public ResponseEntity<?> join(HttpServletResponse response, @RequestBody JoinRequestDto requestDto) {
        return ResponseEntity.ok(authService.join(response, requestDto));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        return ResponseEntity.ok(authService.refreshToken(request, response));
    }

    /**
     * 회원을 로그아웃합니다.
     * @param request
     * @return
     */
    @DeleteMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        return ResponseEntity.ok(authService.logout(request));
    }
}
