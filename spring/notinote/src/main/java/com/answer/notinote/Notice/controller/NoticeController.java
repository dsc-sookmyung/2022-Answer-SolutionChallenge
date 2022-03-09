package com.answer.notinote.Notice.controller;


import com.answer.notinote.Notice.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gcp.vision.CloudVisionTemplate;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;



@RestController
public class NoticeController {

    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private CloudVisionTemplate cloudVisionTemplate;
    @Autowired
    NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @RequestMapping(value = "/notice/ocr", method = RequestMethod.POST)
    public String saveImage (@RequestPart MultipartFile uploadfile) throws IOException {
        Long nid = noticeService.saveImage(uploadfile);
        String koreantext = noticeService.detectText(nid);
        String transtext = noticeService.transText(nid);
        return "Text from image: " + transtext;
    }





}
