package com.answer.notinote.Notice.controller;


import com.answer.notinote.Notice.dto.NoticeRequestDto;
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
    public Object executeOCR (@RequestPart MultipartFile uploadfile, HttpServletRequest request) throws IOException {
        Long nid = noticeService.saveImage(uploadfile, request); //이미지 저장
        String koreantext = noticeService.detectText(nid); //원문 추출
        String transtext = noticeService.transText(nid); //번역문 추출
        //String datedetect = noticeService.dateDetect(nid);
        String dummytext = "{id: 1, content: \"1. Schedule of the closing ceremony and diploma presentation ceremony: Friday, January 4, 2019 at 9 o'clock for students to go to school.) \", date: \"\", highlight: false, registered: false}";
        ArrayList<String> list = new ArrayList<String>();
        list.add(dummytext);

        JSONObject obj = new JSONObject();
        obj.put("id",nid);
        obj.put("korean", koreantext);
        obj.put("fullText", list);
        System.out.println(obj);
        return obj;
    }

    @RequestMapping(value = "/notice/save/{nid}", method = RequestMethod.POST)
    public Object saveNotice(@PathVariable Long nid, @RequestBody NoticeRequestDto noticeRequestDto, HttpServletRequest request){
        String notice_title = noticeService.saveNotice(nid, noticeRequestDto, request);
        JSONObject obj = new JSONObject();
        obj.put("title", notice_title);
        return obj;
    }
}
