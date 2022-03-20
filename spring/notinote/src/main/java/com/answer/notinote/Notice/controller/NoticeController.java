package com.answer.notinote.Notice.controller;


import com.answer.notinote.Notice.dto.NoticeRequestDto;
import com.answer.notinote.Notice.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;


@RestController
public class NoticeController {

    @Autowired
    NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @RequestMapping(value = "/notice/ocr", method = RequestMethod.POST)
    public String saveImage (@RequestPart MultipartFile uploadfile, HttpServletRequest request) throws IOException {
        Long nid = noticeService.saveImage(uploadfile, request); //이미지 저장
        String koreantext = noticeService.detectText(nid); //원문 추출
        String transtext = noticeService.transText(nid); //번역문 추출
        //String datedetect = noticeService.dateDetect(nid);
        return "Text from image: " + transtext;
    }

    @RequestMapping(value = "/notice/save/{nid}", method = RequestMethod.POST)
    public String saveTitle(@PathVariable Long nid, @RequestBody NoticeRequestDto noticeRequestDto, HttpServletRequest request){
        String savenotice = noticeService.saveNotice(nid, noticeRequestDto, request);
        return "Success";
    }
}
