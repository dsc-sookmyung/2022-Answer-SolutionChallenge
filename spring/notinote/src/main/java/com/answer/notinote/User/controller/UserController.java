package com.answer.notinote.User.controller;

import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.Auth.token.JwtTokenProvider;
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

    private final JwtTokenProvider jwtTokenProvider;

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


    @GetMapping("/test/user")
    public ResponseEntity<?> testforUser() {
        return ResponseEntity.ok("USER입니다.");
    }

    @GetMapping("/test/admin")
    public ResponseEntity<?> testforAdmin() {
        return ResponseEntity.ok("ADMIN입니다.");
    }

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody JoinRequestDto requestDto) {
        return ResponseEntity.ok(userService.join(requestDto));
    }

    /**
     * 입력받은 id의 유저를 찾아 jwt token을 반환합니다.
     * @param id
     * @return
     */
    @GetMapping("/login/{id}")
    public ResponseEntity<?> login(@PathVariable("id") long id) {
        User user = userService.findUserById(id);

        LoginResponseDto response = LoginResponseDto.builder()
                .id(user.getUid())
                .email(user.getUemail())
                .username(user.getUusername())
                .language(user.getUlanguage())
                .roles(user.getUroleType())
                .access_token(jwtTokenProvider.createToken(user.getUemail(), user.getUroleType()))
                .refresh_token(null)
                .build();
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh Token을 재발급합니다. - 미완
     * @param refreshToken
     * @return
     */
    @PostMapping("/refresh")
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
