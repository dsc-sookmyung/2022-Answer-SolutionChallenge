package com.answer.notinote.Auth.service;

import com.answer.notinote.Auth.userdetails.GoogleUser;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class OAuthService {

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> createGetRequest(String oAuthToken) {
        String url = "https://www.googleapis.com/oauth2/v3/userinfo";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + oAuthToken);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

            return restTemplate.exchange(url, HttpMethod.GET, request, String.class);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.TOKEN_INVALID);
        }
    }

    public GoogleUser getUserInfo(ResponseEntity<String> userInfoResponse) {
        GoogleUser googleUser = null;
        try {
            googleUser = objectMapper.readValue(userInfoResponse.getBody(), GoogleUser.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return googleUser;
    }

}
