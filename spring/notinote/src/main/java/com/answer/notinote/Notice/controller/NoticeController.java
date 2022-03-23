package com.answer.notinote.Notice.controller;


import com.answer.notinote.Notice.dto.NoticeOCRDto;
import com.answer.notinote.Notice.dto.NoticeRequestDto;
import com.answer.notinote.Notice.dto.NoticeTitleListDto;
import com.answer.notinote.Notice.service.NoticeService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@RestController
public class NoticeController {

    @Autowired
    NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @RequestMapping(value = "/notice/ocr", method = RequestMethod.POST)
    public NoticeOCRDto executeOCR (@RequestPart MultipartFile uploadfile) throws IOException {
        String korean = noticeService.detectText(uploadfile); //원문 추출
        String fullText = noticeService.transText(korean); //번역문 추출
        return new NoticeOCRDto(korean, fullText);
    }

    @RequestMapping(value = "/notice/save", method = RequestMethod.POST)
    public NoticeTitleListDto saveNotice(
            @RequestPart(value = "uploadfile") MultipartFile uploadfile,
            @RequestPart(value = "noticeRequestDto") NoticeRequestDto noticeRequestDto,
            HttpServletRequest request) throws IOException {
        NoticeTitleListDto notice_title = noticeService.saveNotice(uploadfile, noticeRequestDto, request); //notice 저장
        return notice_title;
    }
}
