package com.answer.notinote.Notice.controller;


import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Event.dto.EventRequestDto;
import com.answer.notinote.Notice.dto.NoticeOCRDto;
import com.answer.notinote.Notice.dto.NoticeRequestDto;
import com.answer.notinote.Notice.dto.NoticeSentenceDto;
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
        String token = jwtTokenProvider.resolveAccessToken(userrequest);
        String email = jwtTokenProvider.getUserEmail(token);
        User user = userService.findUserByEmail(email);
        String targetLanguage = user.getUlanguage();

        String korean = noticeService.detectText(uploadfile); //원문 추출
        String trans_full = noticeService.transText(korean, targetLanguage); //번역문 추출
        List<EventRequestDto> events = noticeService.detectEventOCR(korean, trans_full, targetLanguage); //이벤트 추출
        List<NoticeSentenceDto> fullText = noticeService.extractSentenceFromEventOCR(trans_full, events);
        return new NoticeOCRDto(korean, trans_full, fullText);

    }

    @RequestMapping(value = "/notice/save", method = RequestMethod.POST)
    public NoticeTitleListDto saveNotice(
            @RequestPart(value = "uploadfile") MultipartFile uploadfile,
            @RequestPart(value = "noticeRequestDto") NoticeRequestDto noticeRequestDto,
            HttpServletRequest request) throws IOException {
        /*
        LocalDate date = LocalDate.parse(stringdate);
        NoticeRequestDto noticeRequestDto = NoticeRequestDto.builder()
                .title(title)
                .date(date)
                .korean(korean)
                .fullText(fullText)
                .build();

         */
        NoticeTitleListDto notice_title = noticeService.saveNotice(uploadfile, noticeRequestDto, request); //notice 저장
        return notice_title;
    }
/*
    @PostMapping("/notice/test")
    public List<NoticeSentenceDto> test(@RequestBody NoticeOCRDto dto, @RequestParam String lan) throws JsonProcessingException {
        Notice notice = Notice.builder()
                .trans_full(dto.getFullText())
                .origin_full(dto.getKorean())
                .build();
        List<Event> events = noticeService.detectEvent(notice, lan);
        return noticeService.extractSentenceFromEvent(dto.getFullText(), events);
    }

 */
}
