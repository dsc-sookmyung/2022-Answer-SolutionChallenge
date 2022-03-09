package com.answer.notinote.User.controller;

import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.auth.token.JwtTokenProvider;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.dto.UserRequestDto;
import com.answer.notinote.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class UserController {

    private final UserService userService;

    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/join/{id}")
    public ResponseEntity<?> auth_success(@PathVariable("id") long id) {
        System.out.println("/join/id 입니다.");
        User user = userService.findUserById(id);
        return ResponseEntity.ok(user);
    }

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody JoinRequestDto requestDto) {
        return ResponseEntity.ok(userService.join(requestDto));
    }

    // 로그인
    @GetMapping("/login/{id}")
    public ResponseEntity<?> login(@PathVariable("id") long id) {
        User user = userService.findUserById(id);

        String token = jwtTokenProvider.createToken(user.getUemail(), user.getUroleType());
        return ResponseEntity.ok(token);
    }

    // token 재발급
    @PostMapping("/refresh")
    public String validateRefreshToken(@RequestHeader("REFRESH-TOKEN") String refreshToken) {
        return "";
    }

    // 회원정보 수정
    @PatchMapping()
    public User update(@RequestParam Long id, @RequestBody UserRequestDto requestDto) {
        return userService.update(id, requestDto);
    }

    // 이메일로 회원 조회
    @GetMapping("/user/email")
    public User readByEmail(@RequestParam String email) {
        return userService.findUserByEmail(email);
    }

    // 전체 회원 조회
    @GetMapping("/user/list")
    public List<User> readAll() {
        return userService.findAllUsers();
    }

    // 회원 삭제
    @DeleteMapping("/user")
    public Long delete(@RequestParam Long id) {
        return userService.delete(id);
    }

    //Todo: Logout

    //Todo: find password
}
