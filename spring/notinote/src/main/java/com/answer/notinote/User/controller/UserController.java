package com.answer.notinote.User.controller;

import com.answer.notinote.Auth.repository.RefreshTokenRepository;
import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.User.dto.JoinRequestDto;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 회원을 탙퇴 처리 합니다.
     * @param id
     * @return
     */
    @DeleteMapping
    public Long delete(@RequestParam Long id) {
        return userService.delete(id);
    }

    /**
     * 회원의 아이들에 대한 정보를 조회합니다.
     * @param request
     * @return
     */
    @GetMapping("/children")
    public ResponseEntity<?> getChildren(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        String email = jwtTokenProvider.getUserEmail(token);
        User user = userService.findUserByEmail(email);

        return ResponseEntity.ok(userService.findChildrenByUserId(user.getUid()));
    }
}
