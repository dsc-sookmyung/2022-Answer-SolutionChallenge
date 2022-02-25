package com.answer.notinote.User.controller;

import com.answer.notinote.User.config.security.jwt.JwtTokenProvider;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.dto.UserLoginDto;
import com.answer.notinote.User.dto.UserRequestDto;
import com.answer.notinote.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @PostMapping("/join")
    public User join(@RequestBody UserRequestDto requestDto) {
        return userService.join(requestDto);
    }

    // 로그인
    @PostMapping("/login")
    public String login(@RequestBody UserLoginDto loginDto) {
        User user = userService.login(loginDto);
        return jwtTokenProvider.createToken(user.getUemail(), user.getRoles());
    }

    // 회원정보 수정
    @PatchMapping()
    public User update(@RequestParam Long id, @RequestBody UserRequestDto requestDto) {
        return userService.update(id, requestDto);
    }

    // 이메일로 회원 조회
    @GetMapping()
    public User readByEmail(@RequestParam String email) {
        return userService.findUserByEmail(email);
    }

    // 전체 회원 조회
    @GetMapping("/list")
    public List<User> readAll() {
        return userService.findAllUsers();
    }

    // 회원 삭제
    @DeleteMapping()
    public Long delete(@RequestParam Long id) {
        return userService.delete(id);
    }

    //Todo: Logout

    //Todo: find password
}
