package com.answer.notinote.Auth.handler;

import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.answer.notinote.Auth.data.RoleType;
import com.answer.notinote.Auth.userdetails.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("로그인 성공 !");

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByUemail(userDetails.getEmail()).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );

        if (authentication.getAuthorities().stream().anyMatch(s -> s.getAuthority().equals(RoleType.GUEST.getGrantedAuthority()))) {
            System.out.println("회원가입으로 이동합니다.");
            response.sendRedirect("/oauth/success/" + user.getUid());
            return;
        }
        else {
            System.out.println("회원가입한 사용자입니다.");
            response.sendRedirect("/login/" + user.getUid());
        }

    }
}
