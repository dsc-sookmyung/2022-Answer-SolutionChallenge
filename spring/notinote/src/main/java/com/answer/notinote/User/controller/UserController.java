package com.answer.notinote.User.controller;

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

    /**
     * OAUTH2 로그인 성공시 회원가입한 user 정보를 반환합니다.
     * @param id
     * @return
     */
    @GetMapping("/oauth/success/{id}")
    public ResponseEntity<?> auth_success(@PathVariable("id") long id) {
        User user = userService.findUserById(id);

        UserResponseDto response = UserResponseDto.builder()
                .uid(user.getUid())
                .uemail(user.getUemail())
                .username(user.getUsername())
                .ulanguage(user.getUlanguage())
                .uchildren(null)
                .uroleType(user.getUroleType())
                .build();
        return ResponseEntity.ok(response);
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
     * 회원가입 폼 정보를 받아 유저의 권한을 USER로 바꾸고 로그인을 진행합니다.
     * @param requestDto
     * @return
     */
    @PostMapping("/join")
    public ResponseEntity<?> join(HttpServletResponse response, @RequestBody JoinRequestDto requestDto) {
        return ResponseEntity.ok(userService.join(requestDto, response));
    }

    /**
     * 로그인한 유저의 ID를 받아 유저 정보와 JWT Token을 반환합니다.
     * @param id
     * @return
     */
    @GetMapping("/login/{id}")
    public ResponseEntity<?> login(HttpServletResponse response, @PathVariable("id") long id) {
        return ResponseEntity.ok(userService.login(id, response));
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

}
