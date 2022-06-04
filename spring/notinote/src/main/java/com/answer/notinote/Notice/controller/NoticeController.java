package com.answer.notinote.Notice.controller;

import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Event.dto.EventRequestDto;
import com.answer.notinote.Event.service.EventService;
import com.answer.notinote.Notice.dto.*;
import com.answer.notinote.Notice.service.NoticeService;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;


@RestController
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    private final UserService userService;

    private final JwtTokenProvider jwtTokenProvider;

    private final EventService eventService;

    @RequestMapping(value = "/notice/ocr", method = RequestMethod.POST)
    public NoticeOCRDto executeOCR (@RequestPart MultipartFile uploadfile, HttpServletRequest request) throws IOException {
        String token = jwtTokenProvider.resolveAccessToken(request);
        String email = jwtTokenProvider.getUserEmail(token);
        User user = userService.findUserByEmail(email);
        String targetLanguage = user.getUlanguage();

        String korean = noticeService.detectText(uploadfile); //원문 추출
        String trans_full = noticeService.transText(korean, targetLanguage); //번역문 추출
        String en_full = noticeService.englishText(korean); // 영어 추출
        NoticeResponseBody responseBody = noticeService.detectEvent(korean, trans_full, targetLanguage, en_full); //이벤트 추출
        String title = responseBody.getTitle();
        List<EventRequestDto> eventWords = responseBody.getEvents();
        List<NoticeSentenceDto> fullText = noticeService.extractSentenceFromEventRequestDto(trans_full, eventWords);
        List<NoticeEventListDto> events = noticeService.extractEventList(fullText);
        Integer event_num = events.size();
        return new NoticeOCRDto(title, korean, trans_full, fullText, event_num, events);
    }

    @RequestMapping(value = "/notice/image", method = RequestMethod.POST)
    public ResponseEntity<?> saveImage(@RequestPart(value = "uploadfile") MultipartFile uploadfile) throws IOException {
        String imageUrl = noticeService.saveImage(uploadfile); //notice 저장
        return ResponseEntity.ok(new ImageUrlResponseDto(imageUrl));
    }

    @RequestMapping(value = "/notice/save", method = RequestMethod.POST)
    public NoticeTitleListDto saveNotice(
            @RequestBody NoticeRequestDto noticeRequestDto,
            HttpServletRequest request
    ) throws IOException {
        NoticeTitleListDto notice_title = noticeService.saveNotice(noticeRequestDto, request); //notice 저장
        return notice_title;
    }

    @RequestMapping(value = "/notice/upload", method = RequestMethod.POST)
    public String uploadObject(String objectName, String filePath) throws IOException{
        return noticeService.uploadObjectimage(objectName, filePath);
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
