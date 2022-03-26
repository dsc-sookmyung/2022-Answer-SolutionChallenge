package com.answer.notinote.Notice.controller;


import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Notice.dto.NoticeOCRDto;
import com.answer.notinote.Notice.dto.NoticeRequestDto;
import com.answer.notinote.Notice.dto.NoticeTitleListDto;
import com.answer.notinote.Notice.service.NoticeService;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;


@RestController
public class NoticeController {

    @Autowired
    NoticeService noticeService;

    @Autowired
    UserService userService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @RequestMapping(value = "/notice/ocr", method = RequestMethod.POST)
    public NoticeOCRDto executeOCR (@RequestPart MultipartFile uploadfile, HttpServletRequest userrequest) throws IOException {
        String token = jwtTokenProvider.resolveToken(userrequest);
        String email = jwtTokenProvider.getUserEmail(token);
        User user = userService.findUserByEmail(email);
        String targetLanguage = user.getUlanguage(); // 추후 입력받아야함

        String korean = noticeService.detectText(uploadfile); //원문 추출
        String fullText = noticeService.transText(korean, targetLanguage); //번역문 추출

        return new NoticeOCRDto(korean, fullText);
    }

    @RequestMapping(value = "/notice/save", method = RequestMethod.POST)
    public NoticeTitleListDto saveNotice(
            @RequestPart(value = "uploadfile") MultipartFile uploadfile,
            @RequestPart(value = "noticeRequestDto") NoticeRequestDto noticeRequestDto,
            HttpServletRequest request) throws IOException {

        return noticeService.saveNotice(uploadfile, noticeRequestDto, request);
    }
}
