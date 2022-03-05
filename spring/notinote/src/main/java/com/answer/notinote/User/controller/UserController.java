package com.answer.notinote.User.controller;

import com.answer.notinote.Oauth.token.JwtTokenProvider;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.dto.LoginRequestDto;
import com.answer.notinote.User.dto.LoginResponseDto;
import com.answer.notinote.User.dto.UserRequestDto;
import com.answer.notinote.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> join(@RequestBody UserRequestDto requestDto) {
        return ResponseEntity.ok(userService.join(requestDto));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginDto) {
        User user = userService.login(loginDto);

        LoginResponseDto response = new LoginResponseDto(user.getUid(), user.getUsername(), user.getUemail(),
                jwtTokenProvider.createToken(user.getEmail(), user.getRoles(), ,user.getRoles());
        return ResponseEntity.ok());
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
