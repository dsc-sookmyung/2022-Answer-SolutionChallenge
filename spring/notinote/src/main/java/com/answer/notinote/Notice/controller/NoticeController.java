package com.answer.notinote.Notice.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gcp.vision.CloudVisionTemplate;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@RestController
public class NoticeController {

    @Autowired private ResourceLoader resourceLoader;
    @Autowired private CloudVisionTemplate cloudVisionTemplate;

    @RequestMapping(value = "/notice/ocr", method = RequestMethod.POST)
    public String ocr () {
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
