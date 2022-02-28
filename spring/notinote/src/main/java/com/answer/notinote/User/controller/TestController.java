package com.answer.notinote.User.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {

    @GetMapping("/all")
    public String method_public() {
        return "public";
    }

    @GetMapping("/user")
    public String method_user() {
        return "user";
    }

    @GetMapping("/adming")
    public String method_admin() {
        return "admin";
    }
}
