package com.answer.notinote.Notice.controller;


import com.answer.notinote.Notice.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gcp.vision.CloudVisionTemplate;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.UUID;


@RestController
public class NoticeController {

    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private CloudVisionTemplate cloudVisionTemplate;
    @Autowired
    NoticeService noticeService;

    @RequestMapping(value = "/notice/ocr", method = RequestMethod.POST)
    public String ocr (@RequestParam MultipartFile uploadfile, HttpServletRequest request) throws Exception{
        String nimagename = uploadfile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        nimagename = uuid + nimagename;
        String uploadPath = System.getProperty("user.dir")+"/src/main/resources/static";
        File saveFile = new File(uploadPath, nimagename);
        try {
            uploadfile.transferTo(saveFile);
        } catch (Exception e){
            e.printStackTrace();
        }
        return "ocr";
    }

    @GetMapping("/extractText")
    public String extractText(String imageUrl) {
        // [START spring_vision_text_extraction]
        String textFromImage =
                this.cloudVisionTemplate.extractTextFromImage(this.resourceLoader.getResource(imageUrl));
        return "Text from image: " + textFromImage;
    }




}
