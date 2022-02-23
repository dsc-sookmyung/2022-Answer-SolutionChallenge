package com.answer.notinote.User.controller;

import com.answer.notinote.User.config.security.jwt.JwtTokenProvider;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.dto.UserLoginDto;
import com.answer.notinote.User.dto.UserRequestDto;
import com.answer.notinote.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/join")
    public User join(@RequestBody UserRequestDto requestDto) {

        return userService.join(requestDto);
    }

    @PostMapping("/login")
    public String login(HttpSession session, @RequestBody UserLoginDto loginDto) {
        User user = userService.login(loginDto);
        String token = jwtTokenProvider.createToken(user.getUemail(), user.getRoles());

        return token;
    }

    //Todo: Logout

    //Todo: find password
}
