package com.answer.notinote.Auth.service;

import com.answer.notinote.Auth.userdetails.CustomUserDetails;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByUemail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return CustomUserDetails.create(user);
    }
}
