package com.answer.notinote.User.controller;

import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.dto.LoginResponseDto;
import com.answer.notinote.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class UserController {

    private final UserService userService;

    /**
     * OAUTH2 로그인 성공시 회원가입한 user 정보를 반환합니다.
     * @param id
     * @return
     */
    @GetMapping("/oauth/success/{id}")
    public ResponseEntity<?> auth_success(@PathVariable("id") long id) {
        User user = userService.findUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * OAUTH2 로그인 실패시 실패했다는 문구를 리턴합니다.
     * @return
     */
    @GetMapping("/oauth/fail")
    public ResponseEntity<?> auth_fail() {
        return ResponseEntity.ok("OAuth2 로그인에 실패했습니다.");
    }

    /**
     * 회원가입 폼 정보를 받아 유저의 권한을 USER로 바꾸고 유저 정보를 리턴합니다.
     * @param requestDto
     * @return
     */
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody JoinRequestDto requestDto) {
        return ResponseEntity.ok(userService.join(requestDto));
    }

    /**
     * 로그인한 유저의 ID를 받아 유저 정보와 JWT Token을 반환합니다.
     * @param id
     * @return
     */
    @GetMapping("/login/{id}")
    public ResponseEntity<?> login(@PathVariable("id") long id) {
        return ResponseEntity.ok(userService.login(id));
    }

    /**
     * Refresh Token을 재발급합니다. - 미완
     * @param refreshToken
     * @return
     */
    @PostMapping("oauth/refresh")
    public String validateRefreshToken(@RequestHeader("REFRESH-TOKEN") String refreshToken) {
        return "";
    }

    /**
     * 회원을 탙퇴처리 합니다.
     * @param id
     * @return
     */
    @DeleteMapping("/user")
    public Long delete(@RequestParam Long id) {
        return userService.delete(id);
    }

    //Todo: Logout

    //Todo: find password
}
