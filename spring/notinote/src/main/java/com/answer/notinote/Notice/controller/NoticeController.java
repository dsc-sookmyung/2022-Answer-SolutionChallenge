package com.answer.notinote.Notice.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoticeController {
    @RequestMapping(value = "/notice/ocr", method = RequestMethod.POST)
    public String ocr () {
        return "ocr";
    }
}
